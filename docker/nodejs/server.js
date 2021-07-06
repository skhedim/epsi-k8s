/* JS features */
Array.prototype.flatMap = function(f) {
  return this.map(f).reduce((x,y) => x.concat(y), [])
}

/* Dependencies */
const express = require("express");
const bodyParser = require("body-parser");
const Persons = require('./persons');

/* Configuration */
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


/* Application */
app.get("/persons", function(req, res) {
	const name = req.query.name;
	const person = Persons.findPersonByName(name);
	res.json(person);
});

/* Running */
var port = process.env.port || 3000;
app.listen(port, function() {
	console.log("Application started: curl http://localhost:" + port);
});
