require("dotenv").config();
const Group = require("../group/model");
const Meeting = require("../meeting/model");
const User = require("../user/model");
const Task = require("../task/model")

module.exports.create_group = async (req, res) => {
    const { code, name } = req.body;

    try {
        const existingGroup = await Group.findOne({ code: code });

        if (existingGroup) {
            return res.status(400).json({ message: "Group has already been created" });
        }

        const group = await Group.create({ code, name });

        return res.status(200).json({ message: "Group created" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// module.exports.add_subject = async (req, res) => {
//     const { code, name } = req.body;

//     try {
//         const group = await Group.findOne({ code: code });

//         if (group) {
//             const existingSubject = group.subject.find(subject => subject.name === name);
    
//             if (!existingSubject) {
//                 const newSubject = await Subject.create({ name: name });
    
//                 group.subject.push(newSubject);
    
//                 await group.save();
    
//                 return res.status(200).json({ message: "Subject added" });
//             } else {
//                 return res.status(400).json({ message: "Subject is already in the group" });
//             }
//         } else {
//             return res.status(400).json({ message: "Group not found for the provided code" });
//         } 
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };

module.exports.add_task = async (req, res) => {
    const { code, name } = req.body;


    try {
        const group = await Group.findOne({ code: code });  
        const task = await Task.create({ name });
        
        group.tasks.push(task);

        const userIds = group.students.map(student => student._id);

        for (const userId of userIds) {
            const user = await User.findById(userId);
            user.tasks.push(task);

            await user.save();
        }
        await group.save();

        return res.status(200).json({ message: 'Task created' });
    } catch(error) {
        console.error(error);
        return res.status(400).json({ message: error });
    }
}

module.exports.add_meeting = async (req, res) => {
    const { code, name } = req.body;


    try {
        const group = await Group.findOne({ code: code });  
        const meeting = await Meeting.create({ name });
        
        group.meetings.push(meeting);

        const userIds = group.students.map(student => student._id);

        for (const userId of userIds) {
            const user = await User.findById(userId);
            user.meetings.push(meeting);
            await user.save();
        }
        await group.save();

        return res.status(200).json({ message: 'Task created' });
    } catch(error) {
        console.error(error);
        return res.status(400).json({ message: error });
    }
}