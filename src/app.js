const fs = require("fs");
const Handler = require("./handler.js");
const app = new Handler();
const html = require("./templates.js");

const getComments = () => {
  if (!fs.existsSync("./src/comments.json")) {
    fs.writeFileSync("./src/comments.json", "[]");
  }
  return JSON.parse(fs.readFileSync("./src/comments.json", "utf8"));
};

const getUserData = () => {
  if (!fs.existsSync("./src/userData.json")) {
    fs.writeFileSync("./src/userData.json", "{}");
  }
  return JSON.parse(fs.readFileSync("./src/userData.json", "utf8"));
};

const userData = getUserData();
const comments = getComments();

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => {
    content += chunk;
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

const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split('=');
  const assignKeyValueToArgs = ([key, value]) => args[key] = value;
  text.split('&').map(splitKeyValue).forEach(assignKeyValueToArgs);
  return args;
}

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
    send(res, JSON.stringify(comments), 200);
    return;
  }
  if (url == "/guestBook.html") return getGuestBook(req, res);
  readContent(res, url);
};

const renderGuestBook = (req, res) => {
  const text = JSON.parse(req.body);
  let { name, comment } = text;
  let date = new Date();
  comments.unshift({ name, comment, date: date.toUTCString() });
  fs.writeFile("./src/comments.json", JSON.stringify(comments), err => {});
  renderURL(req, res);
};

const renderError = (req, res, err) => {
  send(res, "Server Unresponding", 500);
};

const getGuestBook = function(req, res) {
  const cookie = req.headers["cookie"];
  let content = html.loginTempelate;
  if (userData[cookie]) {
    content = html.commentTempelate(userData[cookie]);
  }
  send(res, content);
  return;
};

const renderCommentPage = function(req, res) {
  const text = req.body;
  let { name } = readArgs(text);
  name = unescape(name).replace(/\+/g," ");  
  const hasValidCookie = Object.values(userData).includes(name);
  if (!hasValidCookie) {
    const date = new Date().toTimeString();
    const cookie = `name=${name}${date}`;
    const data = {};
    data[cookie] = name;
    res.setHeader("Set-Cookie", cookie);
    fs.writeFile("./src/userData.json", JSON.stringify(data), err => {});
  }
  send(res, html.commentTempelate(name));
};

const renderLogout = function(req, res){
  const cookie = req.headers["cookie"];
  delete userData[cookie];
  res.setHeader("Set-Cookie", '');
  send(res, html.loginTempelate);
}

app.use(readBody);
app.use(logRequest);
app.get(renderURL);
app.post('/logout', renderLogout)
app.post("/getComments", renderGuestBook);
app.post('/login', renderCommentPage)
app.use(sendNotFound);
app.error(renderError);
module.exports = app.handleRequest.bind(app);
