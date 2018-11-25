const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { Student } = require('./models/student');
var { User } = require('./models/user');
var { Trainee } = require('./models/trainee');
var { Feedback } = require('./models/feedback');
var { authenticate } = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET, POST, DELETE, PATCH');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  

//Route to add a new Todo
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        console.log('Error in Saving the Data');
        res.status(400).send(err);
    });
});

app.post('/student', (req, res) => {
    var student = new Student({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
    });
    student.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        console.log('Error in Saving the Data');
        res.status(400).send(err);
    });
});

app.get('/student', (req, res) => {
    Student.find({
    }).then((students) => {
        res.send({ students });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/student/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Student.findOneAndRemove({
        _id: id,
    }).then((student) => {
        if (!student) {
            return res.status(404).send();
        }
        res.send({ student });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/student/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['name', 'email','mobile']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Student.findOneAndUpdate({ _id: id }, { $set: body }, { new: true }).then((student) => {
        if (!student) {
            return res.status(404).send();
        }
        res.send({ student });
    }).catch((err) => {
        res.status(400).send();
    });

});


//Route to get all the Todos
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user.id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user.id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((err) => {
        res.status(400).send();
    });

});

//Route to add a new User
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        console.log('Error in Saving the Data', err);
        res.status(400).send(err);
    });
});

app.post('/trainees', (req, res) => {
    var body = _.pick(req.body, ['firstName', 'lastName', 'traineeEmail', 'traineeMobileNo', 'traineeInstution', 'profession', 'joiningDate']);
    var trainee = new Trainee(body);
    trainee.save().then(() => {
        res.send(trainee);
    }).catch((err) => {
        console.log('Error in Saving the Data', err);
        res.status(400).send(err);
    });
});

app.post('/feedbacks', (req, res) => {
    var body = _.pick(req.body, ['fullname', 'courseName', 'comments', 'ratings']);
    var feedback = new Feedback(body);
    feedback.save().then(() => {
        res.send(feedback);
    }).catch((err) => {
        console.log('Error in Saving the Data', err);
        res.status(400).send(err);
    });
});

app.get('/trainees', (req, res) => {

    Trainee.find().then((trainees) => {
        res.send({ trainees });
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/feedbacks', (req, res) => {

    Feedback.find().then((feedbacks) => {
        res.send({ feedbacks });
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

//Configuring Express JS to listen to 3000 port or the Heroku Port
app.listen(port, () => {
    console.log(`Started on Port ${port}`);
});

module.exports = { app };