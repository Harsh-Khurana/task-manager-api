const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
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

userSchema.statics.findByCredentials = async ({ email, password }) =>{
    const user = await User.findOne({ email });
    if(!user){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user;
}

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;