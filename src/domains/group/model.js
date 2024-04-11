const mongoose = require("mongoose");

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
    subject:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
});

const Group = mongoose.model("group", groupSchema);

module.exports = Group;


