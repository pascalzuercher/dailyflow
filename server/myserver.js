const http = require('http');
const fs = require("fs")
const { signUp, signIn, saveData, loadData, loadAll, deleteItem } = require('./handlers');
const { servestatic } = require('./servestatic');
const PORT = process.env.PORT || 8080

http.createServer(answer).listen(PORT);
console.log(`Server listening on port http://localhost:${PORT}`)

async function answer(req, res) {

	if(req.url == "/signUp") 	{return signUp(req, res)}
	if(req.url == "/signIn") 	{return signIn(req, res)}
	if(req.url == "/saveData") 	{return saveData(req, res)}
	if(req.url == "/loadData") 	{return loadData(req, res)}
	if(req.url == "/loadAll") 	{return loadAll(req, res)}
	if(req.url == "/deleteItem") 	{return deleteItem(req, res)}


	return servestatic(req, res)
}