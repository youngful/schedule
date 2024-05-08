const express = require("express");
const routes = express.Router();

const {
    set_grade
} = require("./controller");

routes.post("/set_grade", set_grade);

module.exports = routes;