var mongoose = require('mongoose');

var Trainee = mongoose.model('Trainee', {
    firstName: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    lastName: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    traineeEmail: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    traineeMobileNo: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    traineeInstution: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    profession: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    },
    joiningDate: {
        type: String,
        required : true,
        minlength : 1,
        trim : true
    }
});

module.exports={Trainee};