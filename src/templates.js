const html = {
  loginTempelate: `<html>
  <head>
    <title>Guest Book</title>
    <link rel="stylesheet" type="text/css" href="main.css" />
    <script src="loadComments.js"></script>
  </head>
  <body>
    <p class="subPageHeadline">
      <a href="/" class="homeLink"><<</a>Guest Book
    </p>
    <div id="detailsArea">
    <h1>Login to comment</h1>
    <form  action="/login" method="POST">
    <label>Name: </label> <input type="text" name="name" id="name" class="nameBox"/>
    <button class="button" id="login" type="submit" value="submit">Login</button>
  </form>
    </div>
    <div class="commentBox" id="commentBox" style="margin-top:10px">
      <p style="font-size: 25px; font-weight: 700">Comments <button id="refresh">&#x21bb</button></p>
      <div id="commentArea"></div>
    </div>
  </body>
</html>`,
  commentTempelate: (name) => `<html>
  <head>
    <title>Guest Book</title>
    <link rel="stylesheet" type="text/css" href="main.css" />
    <script src="loadComments.js"></script>
  </head>
  <body>
    <p class="subPageHeadline">
      <a href="/" class="homeLink"><<</a>Guest Book
    </p>
    <div id="detailsArea">
    <h1>Login to comment</h1>
    <form action="/logout" method="POST">
    <label>Name: </label> <span id="name">${name}</span>
    <button class="button" id="logout" type="submit" value="submit">Logout</button>
    </form>
    <label>Comment:</label>
    <textarea
    rows="8"
    cols="40"
    name="comment"
    style="margin-top:5px"
    id="commentMessage"
    ></textarea><br/>
    <button class="button" style="margin-top:4px" id="submit">Submit</button>
    </div>
    <div class="commentBox" id="commentBox" style="margin-top:10px">
      <p style="font-size: 25px; font-weight: 700">Comments <button id="refresh">&#x21bb</button></p>
      <div id="commentArea"></div>
    </div>
  </body>
</html>`,
};

module.exports = html;