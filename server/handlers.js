// const fs = require('fs').promises
// const {pbkdf2Sync} = require('crypto');
const {parseJsonBody} = require("./parsers")
const {respondWithJson} = require("./responders")
const {load, save, doesItemExist, remove} = require("./datastore");
const bcrypt = require('bcryptjs');




// const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
// console.log(key.toString('hex'));  // '3745e48...08d59ae'

async function signUp(req, res) {
	const {nachname, vorname, user, email, pw} = await parseJsonBody(req)

	if(!email) {
		return respondWithJson(res, {ok: false, info: "email must not be empty"})
	}
	if(doesItemExist(user)) {
		return respondWithJson(res, {ok: false, info: "user already exists"})
	}

	const saltedpassword = pw  + "jgf75rg67d54dh5zrfuztg6rdtw4sv4t5dhfntuzho9kkhunutfg65df6";
	
	const hash = await bcrypt.hash(saltedpassword, 10)
	
	console.log('Your hash: ', hash);
		
	await save(`${user}/userdata.json`, {user, hash, email, nachname, vorname})
	respondWithJson(res, {ok: true, data: {user, email, vorname, nachname}})

}

async function signIn(req, res) {
	const {user, pw} = await parseJsonBody(req)
	const userdata = await load(`${user}/userdata.json`)
	const {email, vorname, nachname, hash} = userdata
	saltedpassword = pw  + "jgf75rg67d54dh5zrfuztg6rdtw4sv4t5dhfntuzho9kkhunutfg65df6";
	const passwordsMatch = await bcrypt.compare(saltedpassword, hash)
	console.log({ok: passwordsMatch, data: {email, user, vorname, nachname}});
	respondWithJson(res, {ok: passwordsMatch, data: {email, user, vorname, nachname}})
}

async function saveData(req, res) {
	const {path, data} = await parseJsonBody(req)
	await save(path, data)
	respondWithJson(res, {ok: true})
}

async function loadData(req, res) {
	const {path} = await parseJsonBody(req)
	respondWithJson(res, await load(path))
}

async function deleteItem(req, res) {
	const {path} = await parseJsonBody(req)
	respondWithJson(res, await remove(path))
}

async function loadAll(req, res) {
	const {path} = await parseJsonBody(req)
	try {
		const files = await load(path)
		const items = []
		for(var f of files) {
			if(f.endsWith(".json")) {
				var item = await load(path + "/" + f)
				item.id = f
				items.push(item)
			}
		}
		respondWithJson(res, items)
	}
	catch(e) {
		respondWithJson(res, [])
	}
}

module.exports = {
	signUp,
	signIn,
	saveData,
	loadData,
	loadAll,
	deleteItem
}