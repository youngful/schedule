const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({

    name: String,

    date:{
        type: Date,
        default: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    },

});

const Meeting = mongoose.model("meeting", meetingSchema);

module.exports = Meeting;