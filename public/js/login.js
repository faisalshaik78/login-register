const form = document.getElementById('loginForm');
const msg = document.getElementById('msg');

function showMsg(text, type) {
  if (!msg) return;
  msg.textContent = text;
  msg.className = `msg ${type}`;
}

// If already logged in, skip straight to dashboard
(async () => {
  try {
    const res = await fetch('/api/session');
    const data = await res.json();
    if (data.authenticated) {
      window.location.href = 'dashboard.html';
    }
  } catch (err) {
    // ignore — user can still log in manually
  }
})();

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (msg) msg.className = 'msg';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      showMsg('Please fill in both fields.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || 'Login failed.', 'error');
        return;
      }

      window.location.href = 'dashboard.html';
    } catch (err) {
      showMsg('Network error. Is the server running?', 'error');
    }
  });
}
