const mongoose = require("mongoose");
const Student = require("../user/model")
const Teacher = require("../teacher/model")

const groupSchema = new mongoose.Schema({
    code: Number,
    name: String,
    students:{
        type: [Student.schema],
        reaqired: false
    },
    teacher:{
        type: Student.schema,
        reaqired: false
    }
});


const Group = mongoose.model("group", groupSchema);

module.exports = Group;


//в subject
// grade: [{
//     type: Number,
//     min: 0,
//     max: 100
// }]