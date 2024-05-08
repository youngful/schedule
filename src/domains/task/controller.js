require("dotenv").config();
const User = require("../user/model");
const Task = require("../task/model")

module.exports.set_grade = async (req, res) => {
    const { code, grade } = req.body;

    const user = await User.findById("6628b0549149dbc8cb5fa3ef");

    try {
        
        for(let task of user.tasks){
            if (task.id === code){
                const dbTask = await Task.findById(code);
                dbTask.grade = grade;
                dbTask.lastUpdate = Date.now();
                task.grade = grade;
                task.lastUpdate = Date.now();

                console.log(task);
                
                await user.save();
                await dbTask.save();
                return res.status(200).json({ message: "Marked" });   
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};