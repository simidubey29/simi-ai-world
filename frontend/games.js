async function getRoast() {
  const name = document.getElementById('roast-name').value.trim();
  if (!name) return;
  const box = document.getElementById('roast-result');
  box.textContent = 'Cooking roast... 🔥';
  box.className = 'result-box show';
  const res = await fetch('/api/games/roast', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
  const data = await res.json();
  box.textContent = data.roast;
}

async function getTruthOrDare(type) {
  const box = document.getElementById('tod-result');
  box.textContent = 'Thinking...';
  box.className = 'result-box show';
  const res = await fetch(`/api/games/truth-or-dare?type=${type}`);
  const data = await res.json();
  box.textContent = data.result;
}

async function getWYR() {
  const box = document.getElementById('wyr-result');
  box.innerHTML = '<div class="wyr-opt">Loading...</div>';
  const res = await fetch('/api/games/would-you-rather');
  const data = await res.json();
  box.innerHTML = `<div class="wyr-opt">👆 ${data.optionA}</div><div class="wyr-opt">👇 ${data.optionB}</div>`;
}

const quizData = [
  { q: "Simi's fav genre?", opts: ["Thriller", "Romance", "Comedy", "Horror"], ans: 2 },
  { q: "Simi's go-to late night snack?", opts: ["Maggi", "Chips", "Ice cream", "Nothing"], ans: 0 },
  { q: "Simi's mood on Monday mornings?", opts: ["Energetic", "Sleepy", "Angry", "Excited"], ans: 1 },
  { q: "How does Simi react when ignored?", opts: ["Gets sad", "Moves on", "Starts drama", "Spam texts"], ans: 3 },
  { q: "Simi's biggest red flag in people?", opts: ["Rudeness", "Dishonesty", "Being boring", "Bad grammar"], ans: 1 },
];

let qIndex = 0, score = 0, playerName = '';

function startQuiz() {
  playerName = prompt('Your name?') || 'Anonymous';
  qIndex = 0; score = 0;
  showQuestion();
}

function showQuestion() {
  const area = document.getElementById('quiz-area');
  if (qIndex >= quizData.length) {
    area.innerHTML = `<p style="font-size:18px;font-weight:600;color:#2d1b69">You scored ${score}/${quizData.length} 🎉</p>
    <p style="font-size:14px;color:#888;margin-top:6px">${score >= 4 ? 'You actually know me 🥹' : score >= 2 ? 'Thoda thoda 😅' : 'Do we even know each other bro 💀'}</p>
    <button onclick="startQuiz()" style="margin-top:12px">Play again</button>`;
    fetch('/api/games/quiz-score', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ player_name: playerName, score, total: quizData.length }) });
    return;
  }
  const q = quizData[qIndex];
  area.innerHTML = `<p style="font-size:14px;font-weight:500;margin-bottom:12px;color:#2d1b69">Q${qIndex+1}: ${q.q}</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    ${q.opts.map((o, i) => `<button onclick="answer(${i})" style="text-align:left">${o}</button>`).join('')}
  </div>`;
}

function answer(i) {
  const q = quizData[qIndex];
  if (i === q.ans) score++;
  qIndex++;
  showQuestion();
}