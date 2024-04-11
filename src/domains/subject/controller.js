require("dotenv").config();
const Task = require("../task/model");
const Subject = require("./model");

module.exports.add_task = async (req, res) => {
    const { subId, taskName } = req.body;

    try{
        const subject = await Subject.findById(subId);
        
        const task = await Task.create({name: taskName});

        subject.tasks.push(task);

        await subject.save()

        return res.status(200).json({ message: 'Task created' });
        
    }catch(error){
        console.error(error);
        return res.status(400).json({ message: error });;
    }
}