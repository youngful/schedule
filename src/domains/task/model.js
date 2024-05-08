const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({

    name: String,

    date:{
        type: Date,
        default: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    },

    grade:{
        type: Number,
        min: 0,
        max: 100
    },
    lastUpdate:{
        type: Date,
    }

});

const Task = mongoose.model("task", taskSchema);

module.exports = Task;