const userPill = document.getElementById('userPill');
const logoutBtn = document.getElementById('logoutBtn');

(async () => {
  try {
    const res = await fetch('/api/session');
    const data = await res.json();
    if (!data.authenticated) {
      window.location.href = 'login.html';
      return;
    }
    if (userPill) {
      userPill.textContent = `Logged in as ${data.username}`;
    }
  } catch (err) {
    if (userPill) {
      userPill.textContent = 'Could not verify session.';
    }
  }
})();

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      window.location.href = 'login.html';
    }
  });
}
