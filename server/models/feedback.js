var mongoose = require('mongoose');

var Feedback = mongoose.model('Feedback', {
    fullname: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    courseName: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    comments: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    ratings: {
        type: Number,
        required : true,
        minlength : 1,
        trim : true
    }
});

module.exports={Feedback};