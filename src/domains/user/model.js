const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Task = require("../task/model")
const Meeting = require("../meeting/model")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  personalCode: [{ 
    type: Number,
  }],
  tasks:[{
    type: Task.schema
  }],
  meetings:[{
    type: Meeting.schema
  }],
  folderSRC: String,
  file: String,
  type:{
    type: String,
    default: "student"
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  phone: String,
  dateOfBirth: String,
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastPasswordChange: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      user.lastLogin = Date.now();
      await user.save();
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};
const User = mongoose.model("user", userSchema);

module.exports = User;