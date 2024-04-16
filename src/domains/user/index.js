const express = require("express");
const routes = express.Router();

const {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get,
  get_info,
  update_info,
  join_group,
  get_learnings,
  resetPassword_post,
  recoverPassword_reset
} = require("./controller");

routes.get("/signup", signup_get);
routes.get("/login", login_get);
routes.get("/log_out", logout_get);
routes.get("/get_info", get_info)
routes.get("/get_learnings", get_learnings)


routes.post("/sign_up", signup_post);
routes.post("/log_in", login_post);
routes.post("/update_info", update_info);
routes.post("/join_group", join_group);
routes.post("/reset_password", resetPassword_post)
routes.post("/reset-password-confirm/:token", recoverPassword_reset);



module.exports = routes;