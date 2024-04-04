require("dotenv").config();
const Subject = require("./model");

module.exports.create_subject = async (req, res) => {
    const {code, name, teacher, student} = req.body;

    try{
        const subject = await Subject.create(name, grade);
        console.log(subject);
        
    }catch(error){
        console.error(error);
        return null;
    }
}