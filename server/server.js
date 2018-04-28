var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { user } = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        console.log('Error in Saving the Data');
        res.status(400).send(err);
    });
});

//Configuring Express JS to listen to 3000 port
app.listen(3000, () => {
    console.log('Started on Port 3000');
});

module.exports = {app};