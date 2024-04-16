require("dotenv").config();
const server = require("./server");
const pages = __dirname + "/front-end/pages"
const port = 3001 || 5001;

server.get('/log_in', function(req, res) {
  res.sendFile(pages + "/sign_in.html");
});

server.get('/sign_up', function(req, res) {
  res.sendFile(pages + "/sign_up.html");
});

server.get('/calendar', function(req, res) {
  res.sendFile(pages + "/calendar.html");
});


server.get('/sign_up/teacher', function(req, res) {
  res.sendFile(pages + "/sign_up-teacher.html");
});

server.get('/sign_up/student', function(req, res) {
  res.sendFile(pages + "/sign_up-student.html");
});

server.get('/reset_password', function(req, res) {
  res.sendFile(pages + "/reset_password.html");
});

server.get('/reset_password-confirm/:token', function(req, res) {
  res.sendFile(pages + "/reset_password-confirm.html");
});

server.get('/', function(req, res) {
  res.sendFile(pages + "/home.html");
});

server.get('/profile', function(req, res) {
  res.sendFile(pages + "/profile.html");
});

server.get('/learning', function(req, res) {
  res.sendFile(pages + "/learning.html");
});

server.get('/dashboard', function(req, res) {
  res.sendFile(pages + "/dashboard.html");
});

server.get('/grades', function(req, res) {
  res.sendFile(pages + "/grades.html");
});

server.get('/planner', function(req, res) {
  res.sendFile(pages + "/planner.html");
});

const startServer = () => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
      
startServer();
