let token = '';

async function adminLogin() {
  const pass = document.getElementById('pass-input').value;
  const res = await fetch('/api/admin/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ password: pass }) });
  const data = await res.json();
  if (data.success) {
    token = data.token;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadStats();
    showTab('confessions');
  } else {
    document.getElementById('login-err').textContent = 'Wrong password babe';
  }
}

async function loadStats() {
  const res = await fetch('/api/admin/stats', { headers: {'x-admin-token': token} });
  const d = await res.json();
  document.getElementById('stats-row').innerHTML = `
    <div class="stat-card"><div class="num">${d.confessions}</div><div class="lbl">Confessions</div></div>
    <div class="stat-card"><div class="num">${d.unread}</div><div class="lbl">Unread</div></div>
    <div class="stat-card"><div class="num">${d.chats}</div><div class="lbl">Chats</div></div>
    <div class="stat-card"><div class="num">${d.roasts}</div><div class="lbl">Roasts</div></div>
  `;
}

async function showTab(tab) {
  const content = document.getElementById('tab-content');
  content.innerHTML = '<p style="color:#aaa;padding:1rem">Loading...</p>';
  if (tab === 'confessions') {
    const res = await fetch('/api/admin/confessions', { headers: {'x-admin-token': token} });
    const rows = await res.json();
    content.innerHTML = rows.length ? rows.map(c => `
      <div class="confession-item ${c.is_read ? '' : 'unread'}">
        <div class="name">${c.sender_name}</div>
        <div class="msg">${c.message}</div>
        <div class="time">${new Date(c.created_at).toLocaleString()}</div>
        <div class="actions">
          ${!c.is_read ? `<button onclick="markRead(${c.id})">Mark read</button>` : ''}
          <button onclick="deleteConfession(${c.id})" style="color:red">Delete</button>
        </div>
      </div>`).join('') : '<p style="color:#aaa;padding:1rem">No confessions yet 🥲</p>';
  }
  if (tab === 'chats') {
    const res = await fetch('/api/admin/chats', { headers: {'x-admin-token': token} });
    const rows = await res.json();
    content.innerHTML = `<table><tr><th>Time</th><th>Role</th><th>Message</th></tr>${rows.map(r=>`<tr><td>${new Date(r.created_at).toLocaleString()}</td><td>${r.role}</td><td>${r.content}</td></tr>`).join('')}</table>`;
  }
  if (tab === 'roasts') {
    const res = await fetch('/api/admin/roasts', { headers: {'x-admin-token': token} });
    const rows = await res.json();
    content.innerHTML = `<table><tr><th>Name</th><th>Roast</th><th>When</th></tr>${rows.map(r=>`<tr><td>${r.target_name}</td><td>${r.roast_text}</td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`).join('')}</table>`;
  }
  if (tab === 'scores') {
    const res = await fetch('/api/admin/quiz-scores', { headers: {'x-admin-token': token} });
    const rows = await res.json();
    content.innerHTML = `<table><tr><th>Name</th><th>Score</th><th>Total</th><th>When</th></tr>${rows.map(r=>`<tr><td>${r.player_name}</td><td>${r.score}</td><td>${r.total}</td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`).join('')}</table>`;
  }
}

async function markRead(id) {
  await fetch(`/api/admin/confessions/${id}/read`, { method: 'PATCH', headers: {'x-admin-token': token} });
  showTab('confessions'); loadStats();
}

async function deleteConfession(id) {
  if (!confirm('Delete this?')) return;
  await fetch(`/api/admin/confessions/${id}`, { method: 'DELETE', headers: {'x-admin-token': token} });
  showTab('confessions'); loadStats();
}