const express = require("express");
const routes = express.Router();

const {
  create_group,
  add_task,
  add_meeting
} = require("./controller");

routes.post("/create_group", create_group);
routes.post("/add_task", add_task);
routes.post("/add_meeting", add_meeting);

module.exports = routes;