const express = require("express");
const routes = express.Router();

const {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get,
} = require("./controller");

routes.get("/signup", signup_get);
routes.get("/login", login_get);
routes.get("/log_out", logout_get);


routes.post("/sign_up", signup_post);
routes.post("/log_in", login_post);



module.exports = routes;