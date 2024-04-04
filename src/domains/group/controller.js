require("dotenv").config();
const Group = require("./model");

module.exports.create_group = async (req, res) => {
    const {code, name} = req.body;

    try{
        const existingGroup = await Group.findOne({ code: code });

        if (existingGroup) {
            return res.status(400).json({ message: "Group has already been created" });
        }

        const group = await Group.create({code, name});

        return res.status(200).json({ message: "group created" });
    }catch(error){
        console.error(error);
        return null;
    }
}