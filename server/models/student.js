var mongoose = require('mongoose');

var Student = mongoose.model('Student', {
    name: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    email: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    mobile: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
});

module.exports={Student};