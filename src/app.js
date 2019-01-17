const fs = require("fs");
const comments = require("./comments.json");
const Handler = require("./handler.js");
const app = new Handler();

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));
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
  readContent(res, url);
};

const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  text
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

const getMessage = (res, messageData) => {
  return `<h2>${messageData.name}<h2><h3>${messageData.date}</h3><p>${
    messageData.comment
  }</p>`;
};

const organiseComments = function(res) {
  fs.readFile('./Public/guestBook.html', (err, content)=>{
    comments.forEach(data => {
      let message = getMessage(res, data);
      content += message;
    });
    send(res, content)
  })
};

const renderGuestBook = (req, res) => {
  const text = req.body;
  console.log(text, "text");
  let { name, comment } = readArgs(text);
  console.log(readArgs(text));
  let date = new Date();
  comments.unshift({ name, comment, date: date.toLocaleString() });
  fs.writeFile('./src/comments.json', JSON.stringify(comments), (err) => {
    return;
  });
  organiseComments(res);
};

const renderError = (req, res, err) => {
  send(res, "Server Unresponding", 500);
};

app.use(readBody);
app.use(logRequest);
app.get(renderURL);
app.post("/guestBook.html", renderGuestBook);
app.use(sendNotFound);
app.error(renderError);
module.exports = app.handleRequest.bind(app);
