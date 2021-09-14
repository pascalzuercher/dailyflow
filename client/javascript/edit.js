

var category = {
    termin: "termine",
    geburtstag: "geburtstage",
    notiz: "notizen"

}

async function edit(type, id) {
    console.log(id);
    await load(`neuer_${type}.html`)
    var item = await postData("loadData", {path: window.datastore.user+"/"+category[type]+"/"+id})
    console.log(item);
    document.querySelector('input[name="id"]').value = id
    if(type === "termin"){
        document.querySelector('input[name="title"]').value = item.title
        document.querySelector('input[name="datetime"]').value = item.datetime
        document.querySelector('input[name="description"]').value = item.description
    }
    if(type === "geburtstag"){
    document.querySelector('input[name="surname"]').value = item.surname
    document.querySelector('input[name="firstname"]').value = item.firstname
    document.querySelector('input[name="datetime"]').value = item.datetime
    }
    
    if (type ==="notiz"){
        document.querySelector('textarea[name="note"]').value = item.note
    }
}

async function remove(type, id) {
    console.log(id);
    await postData("deleteItem", {path: window.datastore.user+"/"+category[type]+"/"+id})
    location.reload()
}



async function deleteAccount(){
        if(window.confirm("Willst du dein Konto wirklich löschen? - Deine Daten werden dabei endgültig gelöscht und können nicht wiederhergestellt werden")){
            await postData("deleteItem", {path: window.datastore.user})
            localStorage.removeItem("dailyflowdata")
            window.assign("#welocme.html")
            
    }
}

async function passwordForget(){
    window.confirm("Bitte wende dich an folgende E-Mail Adresse um dein Passwort zurückzusetzen: pascal.zuercher@gymburgdorf.ch")

}