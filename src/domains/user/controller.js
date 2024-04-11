require("dotenv").config();
const User = require("./model");
const jwt = require("jsonwebtoken");
const Group = require("../group/model")
const Subject = require("../subject/model")
const Task = require("../task/model")
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mkdirAsync = promisify(fs.mkdir);
const multer = require('multer');

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
                dateOfBirth: user.dateOfBirth,
                email: user.email,
                phone: user.phone,
                name: user.name,
                lastName: user.lastName,
                file: user.file
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
    const { personalCode, email, password } = req.body;

    try {
        if (personalCode) {
            const group = await Group.findOne({ code: personalCode });

            if (group) {
                const user = await User.create({ personalCode, email, password });
                group.students.push(user);
                await group.save();
                return res.status(200).json({ message: "signed up" });
            } else {
                return res.status(400).json({ message: "Group not found for the provided personal code" });
            }
        } else {
            const user = await User.create({ email, password });

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
                await user.save();

                group.students.push(user._id);
                await group.save();


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
                    subjects: []
                };
                for (let subjectId of group.subject) {
                    const subject = await Subject.findById(subjectId);
                    const tasks = await Task.find({ _id: { $in: subject.tasks } }, 'name date'); // Включаємо поле з датою
                    const tasksInfo = tasks.map(task => ({ taskName: task.name, date: task.date }));
                    groupData.subjects.push({ name: subject.name, tasks: tasksInfo });
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

