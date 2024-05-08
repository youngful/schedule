const express = require("express");
const router = express.Router();

const userRoutes = require("../domains/user");
const teacherRoutes = require("../domains/teacher");
const groupRoutes = require("../domains/group");
const task = require("../domains/task");

router.use("/user", userRoutes);
router.use("/teacher", teacherRoutes);
router.use("/group", groupRoutes);
router.use("/task", task);

module.exports = router;