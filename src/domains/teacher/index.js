const express = require("express");
const routes = express.Router();

const {
  signup_post,
} = require("./controller");

routes.post("/sign_up", signup_post);

module.exports = routes;