const BASEURL = location.href.match(/(localhost|127)/) ? "http://localhost:8080/" : "https://desolate-chamber-59847.herokuapp.com/" 
console.log(BASEURL);

async function postDataWithToken (url, data) {
	const dataWithToken = data
	dataWithToken.user = window.datastore.user
	dataWithToken.token = window.datastore.token
	return postData(url, dataWithToken)
}

async function postData(url, data) {
	console.log(data);
	const response = await fetch(BASEURL + url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		//credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}




function collectFormData(formElement) {
	var data = {}
	formElement.querySelectorAll("input, textarea").forEach(input=>{
		data[input.name] = input.value
	})
	return data
}




function checkFormResponse(response) {
	console.log(response);
	if(response.ok) {
		Object.assign(window.datastore, response.data)
		localStorage.dailyflowdata = JSON.stringify(window.datastore)
		return true

	}
	else {
		console.log(response);
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