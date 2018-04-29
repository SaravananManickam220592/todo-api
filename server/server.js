var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { user } = require('./models/user');

var app = express();

app.use(bodyParser.json());

//Route to add a new Todo
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

//Route to get all the Todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo })

    }).catch((e) => {
        res.status(400).send();
    });
})

//Configuring Express JS to listen to 3000 port
app.listen(3000, () => {
    console.log('Started on Port 3000');
});

module.exports = { app };