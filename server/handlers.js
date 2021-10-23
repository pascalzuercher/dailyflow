const {parseJsonBody} = require("./parsers")
const {respondWithJson} = require("./responders")
const {load, save, doesItemExist, remove} = require("./datastore");
const bcrypt = require('bcryptjs');

async function createToken (user) {
	const token = String(Math.round(Math.random() * 1e15))
	await save(`${user}/token.json`, {token, date: Date.now()})
	return token
}

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
	
	await save(`${user}/userdata.json`, {user, hash, email, nachname, vorname})
	const token = await createToken(user)
	respondWithJson(res, {ok: true, data: {user, email, vorname, nachname, token}})
}

async function signIn(req, res) {
	const {user, pw} = await parseJsonBody(req)
	const userdata = await load(`${user}/userdata.json`)
	const {email, vorname, nachname, hash} = userdata
	saltedpassword = pw  + "jgf75rg67d54dh5zrfuztg6rdtw4sv4t5dhfntuzho9kkhunutfg65df6";
	const passwordsMatch = await bcrypt.compare(saltedpassword, hash)
	const token = await createToken(user)
	respondWithJson(res, {ok: passwordsMatch, data: {email, user, vorname, nachname, token}})
}

async function verifyToken(user, token) {
	const saved = await load(`${user}/token.json`)
	console.log(saved.token == token);
	return saved.token == token
}

async function saveData(req, res) {
	const {path, data, user, token} = await parseJsonBody(req)
	if(!await verifyToken(user, token)) 	return respondWithJson(res, {ok: false, info: "TokenMismatch"})
	await save(path, data)
	respondWithJson(res, {ok: true})
}

async function loadData(req, res) {
	const {path, user, token} = await parseJsonBody(req)
	if(!await verifyToken(user, token)) 	return respondWithJson(res, {ok: false, info: "TokenMismatch"})
	respondWithJson(res, await load(path))
}

async function deleteItem(req, res) {
	const {path, user, token} = await parseJsonBody(req)
	if(!await verifyToken(user,token)) 	return respondWithJson(res, {ok: false, info: "TokenMismatch"})
	respondWithJson(res, await remove(path))
}

async function loadAll(req, res) {
	const {path, user, token} = await parseJsonBody(req)
	if(!await verifyToken(user, token)) 	return respondWithJson(res, {ok: false, info: "TokenMismatch"})
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