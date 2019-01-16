const fs = require("fs");

const send = function(res, statusCode, content) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const app = (req, res) => {
  if (req.url == "/favicon.ico") {
    res.end();
    return;
  }
  fs.readFile("." + req.url, (err, chunk) => {
    send(res, 200, chunk);
  });

};

// Export a function that can act as a handler

module.exports = app;
