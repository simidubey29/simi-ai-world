const fetch = require('node-fetch');

const callClaude = async (messages, maxTokens = 300) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: maxTokens,
      messages
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || '';
};

module.exports = { callClaude };