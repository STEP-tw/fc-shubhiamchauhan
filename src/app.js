const fs = require("fs");
const Handler = require("./handler.js");
const app = new Handler();

const getComments = () => {
  if (!fs.existsSync("./src/comments.json")) {
    fs.writeFileSync("./src/comments.json", "[]");
  }
  return JSON.parse(fs.readFileSync("./src/comments.json", "utf8"));
};

const comments = getComments();

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => {
    content += chunk
  });
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const logRequest = (req, res, next) => {
  console.log(req.method, req.url);
  console.log("headers =>", JSON.stringify(req.headers, null, 2));
  console.log("body =>", req.body);
  next();
};

const send = (res, content, statusCode = 200) => {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const sendNotFound = (req, res) => {
  res.statusCode = 404;
  res.end();
};

const getURLPath = function(url) {
  if (url == "/") return "./Public/index.html";
  return "./Public" + url;
};

const readContent = function(res, url) {
  const path = getURLPath(url);
  fs.readFile(path, (err, content) => {
    if (err) {
      send(res, "File Not Found", 404);
      return;
    }
    send(res, content);
  });
};

const renderURL = (req, res) => {
  let url = req.url;
  if (url == "/getComments") {
    send(res, JSON.stringify(getComments()), 200);
    return;
  }
  readContent(res, url);
};

const renderGuestBook = (req, res) => {
  const text = JSON.parse(req.body);
  let { name, comment } = text;
  let date = new Date();
  comments.unshift({ name, comment, date: date.toUTCString()});
  fs.writeFileSync("./src/comments.json", JSON.stringify(comments));
  renderURL(req, res);
};

const renderError = (req, res, err) => {
  send(res, "Server Unresponding", 500);
};

app.use(readBody);
app.use(logRequest);
app.get(renderURL);
app.post("/getComments", renderGuestBook);
app.use(sendNotFound);
app.error(renderError);
module.exports = app.handleRequest.bind(app);
