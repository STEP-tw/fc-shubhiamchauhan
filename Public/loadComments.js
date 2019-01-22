const getMessage = commentData => {
  let name = unescape(commentData.name);
  let date = unescape(commentData.date);
  let comment = unescape(commentData.comment);
  return `<h2>${name}<h2>
  <h3>${date}</h3>
  <p>${comment}</p>`;
};

const clearMessageArea = () => {
  const messageBox = document.getElementById("commentArea");
  messageBox.innerHTML = "";
};

const insertMessage = function(message) {
  const div = document.createElement("div");
  const messageBox = document.getElementById("commentArea");
  div.innerHTML = getMessage(message);
  messageBox.appendChild(div);
};

const loadComments = function() {
  clearMessageArea();
  fetch("/getComments", { method: "GET" })
    .then(response => response.json())
    .catch(err => {})
    .then(myJson => {
      myJson.forEach(data => {
        insertMessage(data);
      });
    });
};

const getBody = () => {
  let name = document.getElementById("name").value;
  document.getElementById("name").value = "";
  let comment = document.getElementById("commentMessage").value;
  document.getElementById("commentMessage").value = "";
  return { name, comment };
};

const updateComments = function() {
  const data = getBody();
  clearMessageArea();
  fetch("/getComments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(myJson => {
      myJson.forEach(data => {
        insertMessage(data);
      });
    });
};

window.onload = () => {
  loadComments();
  const submit = document.getElementById("submit");
  submit.onclick = updateComments;
  const refresh = document.getElementById("refresh");
  refresh.onclick = loadComments;
};
