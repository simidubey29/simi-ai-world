let userId = "";

// ✅ YOUR DEPLOYED BACKEND URL
const BASE_URL = "https://simi-ai-world-2.onrender.com";

// ✅ LOGIN
async function login() {
  let name = document.getElementById("username").value.trim();

  if (!name) {
    alert("Enter your name 😒");
    return;
  }

  try {
    let res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    let data = await res.json();

    userId = data.userId;

    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("chatScreen").classList.remove("hidden");

  } catch (err) {
    alert("Server not reachable 😢");
    console.log(err);
  }
}

// ✅ ENTER KEY
function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}

// ✅ SEND MESSAGE
async function sendMessage() {
  let input = document.getElementById("msg");
  let text = input.value.trim();

  if (!text) return;

  let box = document.getElementById("chatBox");

  box.innerHTML += `<div class="user">${text}</div>`;
  input.value = "";

  try {
    let res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, userId })
    });

    let data = await res.json();

    box.innerHTML += `<div class="bot">${data.reply}</div>`;
    box.scrollTop = box.scrollHeight;

  } catch (err) {
    console.log(err);
    box.innerHTML += `<div class="bot">Simi offline 😢</div>`;
  }
}