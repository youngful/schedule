const express = require("express");
const routes = express.Router();

const {
  add_task
} = require("./controller");

routes.post("/add_task", add_task);



module.exports = routes;