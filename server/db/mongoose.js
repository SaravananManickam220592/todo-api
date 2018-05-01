var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');

mongoose.connect('mongodb://sarodb:Sara2205@ds163689.mlab.com:63689/todoapidbsarava2205' || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };