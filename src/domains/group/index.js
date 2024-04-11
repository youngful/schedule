const express = require("express");
const routes = express.Router();

const {
  create_group,
  add_subject
} = require("./controller");

routes.post("/create_group", create_group);
routes.post("/add_subject", add_subject);



module.exports = routes;