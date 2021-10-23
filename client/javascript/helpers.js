const BASEURL = location.href.match(/(localhost|127)/) ? "http://localhost:8080/" : "https://desolate-chamber-59847.herokuapp.com/" 
console.log(BASEURL);

async function postDataWithToken (url, data) {
	const dataWithToken = data
	dataWithToken.user = window.datastore.user
	dataWithToken.token = window.datastore.token
	return postData(url, dataWithToken)
}

async function postData(url, data) {
	const response = await fetch(BASEURL + url, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data)
	});
	return response.json();
}

function collectFormData(formElement) {
	var data = {}
	formElement.querySelectorAll("input, textarea").forEach(input=>{
		data[input.name] = input.value
	})
	return data
}

function checkFormResponse(response) {
	if(response.ok) {
		Object.assign(window.datastore, response.data)
		localStorage.dailyflowdata = JSON.stringify(window.datastore)
		return true

	}
	else {
		if(response.info == "TokenMismatch") logout()
		return false
	}
}

function beautifyDate(datetime) {
	var date = new Date(datetime)
	var day = date.getDay()
	var hours = date.getHours()
	var minutes = String(date.getMinutes()).padStart(2, "0")

	var weekdays = [
		"Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
	]

	var weekday = weekdays[day]
	var datum = date.toLocaleDateString()
	return weekday + ", " +  datum
}

function beautifyDateTime(datetime) {
	var date = new Date(datetime)
	var day = date.getDay()
	var hours = date.getHours()
	var minutes = String(date.getMinutes()).padStart(2, "0")

	var weekdays = [
		"Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
	]

	var weekday = weekdays[day]
	var datum = date.toLocaleDateString()
	return beautifyDate(datetime) + ", " + hours + ":" + minutes
}