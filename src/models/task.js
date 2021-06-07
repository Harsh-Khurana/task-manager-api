const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    description : {
        type : String
    },
    completed : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('Task', taskSchema);