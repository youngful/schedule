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

server.get('/sign_up/teacher', function(req, res) {
  res.sendFile(pages + "/sign_up-teacher.html");
});

server.get('/sign_up/student', function(req, res) {
  res.sendFile(pages + "/sign_up-student.html");
});

const startServer = () => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
      
startServer();
