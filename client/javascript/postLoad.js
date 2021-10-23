function postLoad() {
    showDate()
    displayItems()
    displayUserdata()
}

function showDate() {
    var dateElement = document.querySelector("#date")
    if(dateElement) {
        dateElement.textContent = beautifyDate(Date.now())
    }
}

async function displayItems() {
    var itemsElements = document.querySelectorAll(".displayItems")
    for(var itemsElement of itemsElements) {
        var category = itemsElement.dataset.what
        var {user} = window.datastore
        var items = await postDataWithToken("loadAll", {path: user+"/"+category})
        var next = itemsElement.dataset.next
        if(next) {
            items = pickItems(items, next, category)
        }

        for(var item of items) {
            checkAutoRemove(category, item)
            itemsElement.innerHTML += displayItem(item, category)
        }
    }
}

function pickItems(items, next, category) {
    const dt = Number(next) * 86400 * 1000
    const nextitems = items.filter((item) => {
        const d = new Date(item.datetime)
        const today = new Date()
        if(category === "geburtstage") {
            const year = today.getMonth() > d.getMonth() ? today.getFullYear() + 1 : today.getFullYear()
            d.setFullYear(year)
        }
        const lastMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() )
        const msToday = lastMidnight.getTime()
        const msItem = d.getTime()
        const diff =  msItem - msToday
        return diff < dt && diff > 0  
    })
    return nextitems
}

async function checkAutoRemove(category, item) {
    if(category !== "termine") return
    const id = item.id
    const d = new Date(item.datetime)
    const today = new Date()
    const lastMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() )
    const msToday = lastMidnight.getTime()
    const msItem = d.getTime()
    const diff =  msToday - msItem
    console.log(category);
    if(diff > 2629800000 ){
        await postDataWithToken("deleteItem", {path: window.datastore.user+"/"+category+"/"+id})
    } 
}

function displayUserdata(){
    var userElement = document.querySelector(".displayUserdata")
    if(userElement) {
        var {user, email, vorname, nachname} = window.datastore
        userElement.innerHTML = `
        <div class="item user"><b>${"Nachname"}</b><br>${nachname}</div>
        <div class="item user"><b>${"Vorname"}</b><br>${vorname}</div>
        <div class="item user"><b>${"Benutzername"}</b><br>${user}</div>
        <div class="item user"><b>${"E-Mail"}</b><br>${email}</div>
        `
    }
}

function displayItem(item, category) {

    if(category === "termine") {
        return `<div class="item termin">
           ${beautifyDateTime(item.datetime)}: <br> <b>${item.title}</b> - ${item.description}
           <br><button class="bearbeiten" onclick="edit('termin', '${item.id}')"></button>
           <button class="löschen" onclick="remove('termin', '${item.id}')"></button>
        </div>`
    }

    else if(category === "geburtstage") {
        return `<div class="item geburtstag">
        ${beautifyDate(item.datetime)} - <b>${item.firstname} ${item.surname}</b><img src="img/confetti.png" class="candle">
           <br><button onclick="edit('geburtstag', '${item.id}')" class="bearbeiten"></button>
           <button class="löschen" onclick="remove('geburtstag', '${item.id}')"></button>
           
           
        </div>`
    }

    else if(category === "notizen") {
        return `<div class="item notiz">
            ${item.note}
            <br><button onclick="edit('notiz', '${item.id}')" class="bearbeiten"></button>
            <button class="löschen" onclick="remove('notiz', '${item.id}')"></button>
        </div>`
    }
}
