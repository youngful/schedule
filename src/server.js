require("./config/db");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(routes);
app.use(express.static(__dirname + '/front-end'))

module.exports = app;
