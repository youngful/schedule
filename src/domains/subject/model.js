const mongoose = require("mongoose");


const subjectSchema = new mongoose.Schema({

    name: String,

    tasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],

    gradeAVG:{
        type: Number,
        min: 0,
        max: 100
    }

});

const Subject = mongoose.model("subject", subjectSchema);

module.exports = Subject;