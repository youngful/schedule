require("dotenv").config();
const Group = require("../group/model");
const Subject = require("../subject/model")

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

module.exports.add_subject = async (req, res) => {
    const { code, name } = req.body;

    try {
        const group = await Group.findOne({ code: code });

        if (group) {
            const existingSubject = group.subject.find(subject => subject.name === name);
    
            if (!existingSubject) {
                const newSubject = await Subject.create({ name: name });
    
                group.subject.push(newSubject);
    
                await group.save();
    
                return res.status(200).json({ message: "Subject added" });
            } else {
                return res.status(400).json({ message: "Subject is already in the group" });
            }
        } else {
            return res.status(400).json({ message: "Group not found for the provided code" });
        } 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
