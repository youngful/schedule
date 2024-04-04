const mongoose = require("mongoose");


const subjectSchema = new mongoose.Schema({

    name: String,

    grade:[{
        type: Number,
        min: 0,
        max: 100
    }]

});

const Subject = mongoose.model("subject", subjectSchema);

module.exports = Subject;