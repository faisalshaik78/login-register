const form = document.getElementById('registerForm');
const msg = document.getElementById('msg');

function showMsg(text, type) {
  if (!msg) return;
  msg.textContent = text;
  msg.className = `msg ${type}`;
}

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
    if (password.length < 8 || !/\d/.test(password)) {
      showMsg('Password must be at least 8 characters and include a number.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || 'Registration failed.', 'error');
        return;
      }

      showMsg('Registered successfully! Redirecting to login...', 'success');
      setTimeout(() => (window.location.href = 'login.html'), 1200);
    } catch (err) {
      showMsg('Network error. Is the server running?', 'error');
    }
  });
}
