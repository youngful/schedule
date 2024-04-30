const mongoose = require("mongoose");
const Task = require("../task/model")
const User = require("../user/model")
const Meeting = require("../meeting/model")

const groupSchema = new mongoose.Schema({
    code: {
        type: Number,
        unique: true, 
        required: true 
    },
    name: String,
    dueDate:{
        type: Date,
        default: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    },
    tasks:[{
        type: Task.schema
    }],
    meetings:[{
        type: Meeting.schema
    }],
    students: [{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Student'
        type: User.schema

    }],
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
});

const Group = mongoose.model("group", groupSchema);

module.exports = Group;


