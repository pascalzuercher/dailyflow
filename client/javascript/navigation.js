async function load(url, addState = true) {
	const html = await fetch(url).then(r=>r.text())
    if(addState) history.pushState({}, url, `#${url}`)
	document.querySelector(".content").innerHTML = html
    postLoad() 
}

async function loadFromHash() {
    var current = location.hash.slice(1)
    if(!window.datastore.user || !current) {
        current = "welcome.html"
    }
    load(current, false)
}

window.addEventListener("popstate", loadFromHash)