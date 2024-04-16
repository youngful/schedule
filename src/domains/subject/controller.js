require("dotenv").config();
const Task = require("../task/model");
const Subject = require("./model");
const Group = require("../group/model")
const User = require("../user/model")

module.exports.add_task = async (req, res) => {
    const { subId, taskName } = req.body;

    try {
        const subject = await Subject.findById(subId);
        
        const task = await Task.create({ name: taskName });
        
        subject.tasks.push(task);
        
        const group = await Group.findOne({ 'subject._id': subId });

        const userIds = group.students.map(student => student._id);

        for (const userId of userIds) {
            const user = await User.findById(userId);
            user.tasks.push(task);

            await user.save();
        }
        
        const groupSubject = group.subject.find(s => s._id.equals(subId));
        groupSubject.tasks.push(task);
        await group.save();
        await subject.save();

        return res.status(200).json({ message: 'Task created' });
    } catch(error) {
        console.error(error);
        return res.status(400).json({ message: error });
    }
}
