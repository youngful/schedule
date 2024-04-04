const express = require("express");
const routes = express.Router();

const {
  create_subject
} = require("./controller");

routes.post("/create_subject", create_subject);



module.exports = routes;