require("dotenv").config();
const User = require("./model");
const jwt = require("jsonwebtoken");
const Group = require("../group/model")


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

const maxAge = 3 * 24 * 60 * 60;
const secret = process.env.SECRET_TOKEN;
const createToken = (id, age = maxAge) => {
    return jwt.sign({ id }, secret, {
        expiresIn: age,
    });
};

module.exports.get_info = async (req, res) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decodedToken = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decodedToken);
                    }
                });
            });

            const userId = decodedToken.id;
            const user = await User.findById(userId);

            const userData = {
                id: user._id,
                dateOfBirth: user.dateOfBirth,
                email: user.email,
                phone: user.phone,
                name: user.name,
                lastName: user.lastName
            };

            res.json(userData); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports.get_user_info = async (req) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decodedToken = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decodedToken);
                    }
                });
            });

            const userId = decodedToken.id;
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    } else {
        return null;
    }
};

module.exports.update_info = async (req, res) => {
    const { email, phone, dateOfBirth } = req.body;

    try {
        const user = await this.get_user_info(req);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await User.findByIdAndUpdate(user._id, { email, phone, dateOfBirth });

        return res.status(200).json({ message: 'User data updated successfully.' });
    } catch (error) {
        console.error('Error updating user data:', error);
        return res.status(500).json({ message: 'Failed to update user data.' });
    }
};

module.exports.signup_get = (req, res) => {
    res.json({ message: "signup" });
};

module.exports.login_get = (req, res) => {
    res.json({ message: "login" });
};

module.exports.signup_post = async (req, res) => {
    const { personalCode, email, password } = req.body;
    
    try {
        if(personalCode){
            const group = await Group.findOne({ code: personalCode });

            if (group) {
                const user = await User.create({ personalCode, email, password });
                group.students.push(user); 
                await group.save(); ç
                return res.status(200).json({ message: "signed up" });
            } else {
                return res.status(400).json({ message: "Group not found for the provided personal code" });
            }
        }
        
        const user = await User.create({ email, password });
        return res.status(200).json({ message: "signed up" });
        
    } catch (err) {
        const errors = handleErrors(err);
        return res.status(400).json({ errors });
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, {
            secure: true,
            httpOnly: true,
            sameSite: "None",
            maxAge: maxAge * 1000,
        });

        res.status(200).json( {token} );
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", {
        secure: true,
        httpOnly: true,
        sameSite: "None",
        maxAge: 1,
    });
    res.status(200).json({ message: "logout" });
};



