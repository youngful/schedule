const express = require("express");
const router = express.Router();

const userRoutes = require("../domains/user");
const teacherRoutes = require("../domains/teacher");

router.use("/user", userRoutes);
router.use("/teacher", teacherRoutes);

module.exports = router;