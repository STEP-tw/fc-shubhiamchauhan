const blink = function(content) {
  content.style.display = "none";
  setTimeout(() => {
    content.style.display = "block";
  }, 1000);
};

const toggleJar = function() {
  const jar = document.getElementById("jar");
  jar.onclick = blink.bind(null, jar);
};

window.onload = toggleJar;
