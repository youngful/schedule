require("dotenv").config();
const User = require("./model");
const jwt = require("jsonwebtoken");
const Group = require("../group/model")
const Task = require("../task/model")
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mkdirAsync = promisify(fs.mkdir);
const nodemailer = require("nodemailer");
const { group } = require("console");

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: "", password: "", massage: "" };


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
                type: user.type,
                dateOfBirth: user.dateOfBirth,
                email: user.email,
                phone: user.phone,
                name: user.firstName,
                lastName: user.lastName,
                file: user.file,
                tasks: user.tasks,
                groups: []
            };

            for(let code of user.personalCode){
                let containeGroup = await Group.findOne({code: code})
                if(containeGroup){
                    userData.groups.push(containeGroup);
                }
            }

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
    const { email, phone, dateOfBirth, fileName } = req.body;

    try {
        const user = await this.get_user_info(req);

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено.' });
        }

        await User.findByIdAndUpdate(user._id, { email, phone, dateOfBirth, file: fileName });

        return res.status(200).json({ message: 'Дані користувача успішно оновлені.' });
    } catch (error) {
        console.error('Помилка при оновленні даних користувача:', error);
        return res.status(500).json({ message: 'Не вдалося оновити дані користувача.' });
    }
};

module.exports.signup_get = (req, res) => {
    res.json({ message: "signup" });
};

module.exports.login_get = (req, res) => {
    res.json({ message: "login" });
};

module.exports.signup_post = async (req, res) => {
    const { personalCode, email, password, firstName, lastName, phone } = req.body;

    try {
        if (personalCode) {
            const group = await Group.findOne({ code: personalCode });

            if (group) {
                const user = await User.create({ personalCode, email, password, firstName, lastName });
                group.students.push(user);
                await group.save();
                return res.status(200).json({ message: "signed up" });
            } else {
                return res.status(400).json({ message: "Group not found for the provided personal code" });
            }
        } else {
            const user = await User.create({ email, password, firstName, lastName, phone });

            const userId = user._id.toString();
            const userFolderPath = path.join(__dirname, '..', 'uploads', userId);


            if (!fs.existsSync(userFolderPath)) {
                await mkdirAsync(userFolderPath);
                user.folderSRC = userFolderPath;
                await user.save();
            } else {
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({ message: "Failed to create user directory" });
            }

            return res.status(200).json({ message: "signed up" });
        }

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

        res.status(200).json({ token });
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

module.exports.join_group = async (req, res) => {
    const { code } = req.body;
    const user = await this.get_user_info(req);

    try {
        const group = await Group.findOne({ code: code });

        if (group) {
            const isUserInGroup = group.students.includes(user._id);
            const isCodeAlreadyAssigned = user.personalCode.includes(code);

            if (!isUserInGroup && !isCodeAlreadyAssigned) {
                user.personalCode.push(code);

                group.students.push(user);
                await group.save();

                for (let task of group.tasks) {
                    let newTask = await Task.create({ name: task.name });
                    user.tasks.push(newTask);
                }

                await user.save();

                return res.status(200).json({ message: "Group added" });
            } else if (isCodeAlreadyAssigned) {
                return res.status(400).json({ message: "Code is already assigned to the user" });
            } else {
                return res.status(400).json({ message: "Student is already in the group" });
            }
        } else {
            return res.status(400).json({ message: "Group not found for the provided code" });
        }
    } catch (err) {
        const errors = handleErrors(err);
        return res.status(400).json({ errors });
    }
};


module.exports.get_learnings = async (req, res) => {
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

            const groups = await Group.find({ code: { $in: user.personalCode } });

            const formattedData = [];
            for (let group of groups) {
                const groupData = {
                    _id: group._id,
                    nameGroup: group.name,
                    dueDate: group.dueDate,
                    tasks: [],
                    meetings: []
                };

                for (let task of group.tasks) {
                    const tasks = await Task.find({ _id: { $in: group.tasks } }, 'name date');
                    const tasksInfo = tasks.map(task => ({ name: task.name, date: task.date }));
                    groupData.tasks.push({ name: task.name, date: task.date });
                }
                for (let meeting of group.meetings) {
                    const meets = await Task.find({ _id: { $in: group.meetings } }, 'name date');
                    const meetingsInfo = meets.map(meeting => ({ name: meeting.name, date: meeting.date }));
                    groupData.meetings.push({ name: meeting.name, date: meeting.date });
                }
                formattedData.push(groupData);
            }
            res.json(formattedData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports.resetPassword_post = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw Error("Invalid email");
        }

        const resetToken = createResetToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Термін дії токена - 1 година
        await user.save();

        sendResetPasswordEmail(email, resetToken);

        res.status(200).json({
            message: "Reset password email sent",
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

const sendResetPasswordEmail = (email, token) => {
    const resetLink = `http://localhost:3001/reset_password-confirm/${token}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_ADDRESS,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_ADDRESS,
        to: email,
        subject: "Reset Password",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
    <h2 style="color: #212121;">Welcome to Study Space!</h2>
    <p style="color: #616161; font-size: 16px;">We received a request to reset your password. To proceed, please click the link below:</p>
    
    <a href="${resetLink}" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #5D7CFB; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">Change Password</a>
    
    <p style="color: #616161; font-size: 16px; margin-top: 15px;">If the button above does not work, you can also copy and paste the following link into your browser:</p>
    
    <p style="color: #5D7CFB; font-size: 16px;">${resetLink}</p>
    
    <p style="color: #616161; font-size: 16px; margin-top: 15px;">Thank you for choosing our platform. We look forward to having you as part of our community!</p>
    
    <p style="color: #757575; font-size: 14px;">Best regards,<br/>Study Space Team</p>
    </div>

    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log("Reset Password Email sent: " + info.response);
        }
    });
}

module.exports.recoverPassword_reset = async (req, res) => {
    const token = req.params.token;
    const { newPassword, confirmPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(404)
                .json({ message: "Invalid or expired reset token" });
        }

        if (newPassword === confirmPassword) {
            user.password = newPassword;
            user.lastPasswordChange = Date.now();
            user.resetPasswordToken = undefined;
            await user.save();
            // res.redirect("/log_in");
            res.status(200).json({ message: "password reseted" });
        } else {
            throw Error("incorrect password");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const createResetToken = () => {
    return jwt.sign({}, secret, { expiresIn: "1h" });
};
