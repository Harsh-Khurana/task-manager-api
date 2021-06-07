const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type : String,
        trim : true,
        minLength : 6,
        validate(value){
            if(value.indexOf('password') != -1){
                throw new Error('Password cannot contain password string in it')
            }
        }
    },
    age : {
        type : Number,
        validate(value){
            if(value < 0){
                throw new Error('Age cannot be negative');
            }
        }
    }
})

module.exports = mongoose.model('User', userSchema);