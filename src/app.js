const fs = require("fs");

const send = function(res, statusCode, content) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const getRequestedFile = url => {
  if (url == "/") return "./Public/index.html";
  return "./Public" + url;
};

const app = (req, res) => {
  fs.readFile(getRequestedFile(req.url), (err, chunk) => {
    if (err) {
      send(res, 404, "Invalid request");
      return;
    }
    send(res, 200, chunk);
  });
};

module.exports = app;
