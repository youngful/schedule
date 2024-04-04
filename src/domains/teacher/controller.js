require("dotenv").config();
const Teacher = require("./model");
const jwt = require("jsonwebtoken");


// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: "", password: "", massage:"" };


    if (err.message === "incorrect email") {
        errors.email = "That email is not registered";
    }

    if (err.message === "incorrect password" || err.massage === "password error") {
        errors.password = "That password is incorrect";
    }

    if (err.code === 11000) {
        if (err.keyPattern.email) errors.email = "that email is already registered";
        return errors;
    }

    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};


module.exports.signup_post = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    try {

        const user = await Teacher.create({ firstName, lastName, email, password });
        
        res.status(200).json({ message: "signed up" });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};



