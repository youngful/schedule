const express = require("express");
const routes = express.Router();

const {
  create_group
} = require("./controller");

routes.post("/create_group", create_group);



module.exports = routes;