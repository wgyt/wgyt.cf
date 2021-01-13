// Set Up express.js
const express = require('express');
const app = express();
app.listen(3000, ()=>{});
const mustacheExpress = require('mustache-express');
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.engine('html', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'html');
console.clear()
// Set Up repl.it database
const Database = require("@replit/database")
const db = new Database()
// Set Up read from key on db
function readdb(key) {
	value = db.get(key).then(value => { return value });
	return value;
}
// Set Up write to key on db
function writedb(key, value) {
	if (key === "/dash") { return "error, forbidden url" }
	value = db.set(key, value).then(() => { return "success" });
	return value;
}
// Set Up delete key from db
function deletedb(key) {
	value = db.delete(key).then(() => { return true });
	return value;
}
// Set Up list all keys from db
function readlistdb(key) {
	value = db.list().then(keys => {return keys});
	return value;
	return value
}
// All dash url's
app.get('/dash/', (req, res) => {
	res.render('index', {
    userid: req.cookies.id,
    username: req.cookies.name,
	idlist: process.env.ids,
    userroles: req.cookies.roles
  });
});
// Login
app.get('/dash/auth/callback/', (req, res) => {
	res.render('auth', {
    userid: req.query.id,
    username: req.query.name,
	idlist: process.env.ids,
    userroles: req.query.roles
  });
});
app.get('/dash/logout/', (req, res) => {
  res.sendFile(`${__dirname}/views/logout.html`);
});
// Main Dashboard
app.get('/dash/main/', (req, res) => {
	res.render('main', {
    userid: req.cookies.id,
    username: req.cookies.name,
	idlist: process.env.ids,
    userroles: req.cookies.roles
  });
});
// new short url
app.get('/dash/new/', (req, res) => {
	res.render('new', {
    userid: req.cookies.id,
    username: req.cookies.name,
    userroles: req.cookies.roles,
	idlist: process.env.ids,
		urlid: req.query.urlid,
		type: "New"
  });
});
app.get('/dash/newurl', (req, res) => {
  writedb(req.query.urlid,req.query.urllong)
	res.set('location', '/dash/main');
  res.status(301).send()
});
// edit url
app.get('/dash/edit/', (req, res) => {
	res.render('new', {
    userid: req.cookies.id,
    username: req.cookies.name,
    userroles: req.cookies.roles,
			idlist: process.env.ids,
		urlid: req.query.urlid,
		type: "Edit"
  });
});
// delete url
app.get('/dash/delete/', (req, res) => {
	res.render('delete', {
    userid: req.cookies.id,
    username: req.cookies.name,
    userroles: req.cookies.roles,
	idlist: process.env.ids,
		urlid: req.query.urlid
  });
});
app.get('/dash/delurl/', (req, res) => {
  deletedb(req.query.urlid)
	res.set('location', '/dash/main');
  res.status(301).send()
});
// NULL
app.get('/null/', function (req, res) {
  res.sendFile(`${__dirname}/views/error.html`);
})
// Serve /
app.get('/', (req, res) => {
	res.set('location', '//www.wgyt.tk');
  res.status(301).send()
});
// Serve short url's
app.get("/:link",(req, res) => {
db.get(req.params.link).then(value => {
	res.set('location', value);
  res.status(301).send()
});
});
// Last resort
app.get('/*', function (req, res) {
  res.sendFile(`${__dirname}/views/error.html`);
});
