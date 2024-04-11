require("dotenv").config();
const Group = require("../group/model");
const Subject = require("../subject/model")

module.exports.create_group = async (req, res) => {
    const { code, name, studentIds } = req.body;

    try {
        const existingGroup = await Group.findOne({ code: code });

        if (existingGroup) {
            return res.status(400).json({ message: "Group has already been created" });
        }

        const group = await Group.create({ code, name, students: studentIds });

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
            const existingSubject = await Subject.findOne({ name: name });

            if (!existingSubject) {
                // Створення нового предмету, якщо він ще не існує
                const newSubject = new Subject({ name: name });
                await newSubject.save();

                // Додавання ідентифікатора нового предмету до масиву subject групи
                group.subject.push(newSubject._id);
                await group.save();

                return res.status(200).json({ message: "Subject added" });
            } else {
                // Якщо предмет вже існує, перевірте, чи він вже доданий до групи
                const isExist = group.subject.includes(existingSubject._id);

                if (!isExist) {
                    // Якщо предмет не доданий до групи, додайте його
                    group.subject.push(existingSubject._id);
                    await group.save();

                    return res.status(200).json({ message: "Subject added" });
                } else {
                    return res.status(400).json({ message: "Subject is already in the group" });
                }
            }
        } else {
            return res.status(400).json({ message: "Group not found for the provided code" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
