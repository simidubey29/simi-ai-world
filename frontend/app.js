const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send-btn');

const sessionId = 'session_' + Math.random().toString(36).slice(2);
let history = [];

function addMsg(text, role) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.innerHTML = `<div class="bubble">${text}</div>`;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

async function sendMessage() {
  const msg = inputEl.value.trim();
  if (!msg) return;
  inputEl.value = '';
  sendBtn.disabled = true;

  addMsg(msg, 'user');
  history.push({ role: 'user', content: msg });

  const typing = addMsg('typing...', 'bot typing');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, session_id: sessionId, history })
    });
    const data = await res.json();
    typing.remove();
    addMsg(data.reply || 'hmm kuch toh hua...', 'bot');
    history.push({ role: 'assistant', content: data.reply });
  } catch {
    typing.remove();
    addMsg('arre yaar connection gaya 😭', 'bot');
  }

  sendBtn.disabled = false;
  inputEl.focus();
}

sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });