const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minLength: 6,
        validate(value){
            if(value.indexOf('password') != -1){
                throw new Error('Password cannot contain password string in it')
            }
        }
    },
    age: {
        type: Number,
        validate(value){
            if(value < 0){
                throw new Error('Age cannot be negative');
            }
        }
    },
    tokens: [
        {
            type: String,
            required: true
        }
    ]
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function(){
    const userObject = this.toObject();

    delete userObject.tokens;
    delete userObject.password;
    
    return userObject;
}

userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    this.tokens.push(token);
    await this.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) =>{
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

userSchema.pre('delete', async function(next){
    await Task.deleteMany({ owner: this._id });

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;