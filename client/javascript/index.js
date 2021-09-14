document.querySelectorAll("a").forEach(link=>link.addEventListener("click", (event)=>{
	var url = event.target.closest("a").getAttribute("href")
	load(url)
	event.preventDefault()
}))

function init() {
    window.datastore = JSON.parse(localStorage.dailyflowdata || "{}")
    login()
    loadFromHash()
   
}

init()

function signUp(event) {
	event.preventDefault()
    signUpOrSignIn(event.target, "signUp")
}


function signIn(event) {
	event.preventDefault()
    signUpOrSignIn(event.target, "signIn")
}

async function signUpOrSignIn(formElement, action) {
    var data = collectFormData(formElement)
    var response = await postData(action, data)
    var ok = checkFormResponse(response)
    if(ok) {
        load("home.html")
        login()
        
    }
}


function login() {
    if(window.datastore.user) {
        var {user, vorname, nachname} = window.datastore
        document.documentElement.classList.add("auth")
        document.querySelector(".profile").textContent = vorname + " " + nachname
    }
}

function sign(event) {
    postForm(event).then(login)
}







function logout(){
    localStorage.removeItem("dailyflowdata")
    location.href = "#welcome.html"
    location.reload();
}

function savebirthday(event) {
	event.preventDefault()
    saveItem(event.target, "geburtstage", "geburtstage.html")
}

function savenotizen(event) {
	event.preventDefault()
    saveItem(event.target, "notizen", "notizen.html")
}

function savetermin(event) {
	event.preventDefault()
    saveItem(event.target, "termine", "termine.html")
}

async function saveItem(formElement, category, redirect) {
    var data = collectFormData(formElement)
    var timestamp = data.id || (Date.now() + ".json")
    var path = `${window.datastore.user}/${category}/${timestamp}`
    var response = await postData("saveData", {path, data})
    var ok = checkFormResponse(response)
    if(ok) {
        load(redirect)
    }
}

