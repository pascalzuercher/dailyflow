const fs = require('fs').promises
const {existsSync} = require('fs')
const path = require('path')

async function createDirIfNotExists(dirname) {
	return fs.mkdir(dirname, {recursive: true}).catch(e => {
		if(e.code !== 'EEXIST') {throw e}
	})
}

function doesItemExist(filepath) {
	filepath = path.join("data", filepath)
	return existsSync(filepath)
}

async function save(filepath, jsondata) {
	filepath = path.join("data", filepath)
	if(!path.extname(filepath)) {
		filepath = filepath + ".json"
	}
	const folder = path.dirname(filepath)
	await createDirIfNotExists(folder)
	await fs.writeFile(filepath, JSON.stringify(jsondata))
}

async function load(filepath) {
	filepath = path.join("data", filepath)
	const stat = await fs.stat(filepath)
	if(stat.isDirectory()) {
		return await fs.readdir(filepath)
	}
	const raw = await fs.readFile(filepath, {encoding: "utf8"})
	return JSON.parse(raw)
}

async function remove(filepath) {
	filepath = path.join("data", filepath)
	const stat = await fs.stat(filepath)
	if(stat.isDirectory()) {
		await fs.rmdir(filepath, { recursive: true });
	}
	else {
		await fs.unlink(filepath)
	}
	return {ok: true}
}

module.exports = {save, load, doesItemExist, remove}