const inp = document.querySelector("#inp");
const b = document.getElementById("btn");
const chata = document.querySelector(".chat");

b.addEventListener("click", function () {
  show();
});

inp.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    show();
  }
});

function show() {
  const inval = inp.value.trim();
  if (inval === "") return;

  appendMessage("int", inval + "🧑");

  fetch('/generate-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `text=${encodeURIComponent(inval)}`,
  })
    .then(response => response.json())
    .then(data => {
      appendMessage("out", "🤖" + data.output);
    })
    .catch(error => {
      appendMessage("out", "🤖" + error.message);
    });

  inp.value = "";
}

function appendMessage(type, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", type);
  messageDiv.textContent = message;
  chata.appendChild(messageDiv);
  chata.scrollTop = chata.scrollHeight;
}
