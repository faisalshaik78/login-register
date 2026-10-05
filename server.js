const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const SALT_ROUNDS = 10;

function ensureUserStore() {
  const userDir = path.dirname(USERS_FILE);

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'oibsip-webdev-l2-task4-secret', // demo only — use env var in production
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
  })
);

// ---------- Helpers ----------
function normalizeUsername(value) {
  return String(value ?? '').trim().toLowerCase();
}

function readUsers() {
  try {
    ensureUserStore();
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  ensureUserStore();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function isValidPassword(password) {
  // min 8 characters, at least 1 number
  return typeof password === 'string' && password.length >= 8 && /\d/.test(password);
}

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
}

// ---------- API: Register ----------
app.post('/api/register', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username/email and password are required.' });
  }

  const cleanUsername = normalizeUsername(username);

  if (!cleanUsername) {
    return res.status(400).json({ error: 'Username/email is required.' });
  }

  if (!isValidPassword(password)) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 8 characters and include at least 1 number.' });
  }

  const users = readUsers();
  const exists = users.some((u) => u.username === cleanUsername);
  if (exists) {
    return res.status(409).json({ error: 'An account with that username/email already exists.' });
  }

  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
  const newUser = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    username: cleanUsername,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  return res.status(201).json({ message: 'Registration successful. You can now log in.' });
});

// ---------- API: Login ----------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username/email and password are required.' });
  }

  const cleanUsername = normalizeUsername(username);

  if (!cleanUsername) {
    return res.status(400).json({ error: 'Username/email is required.' });
  }

  const users = readUsers();
  const user = users.find((u) => u.username === cleanUsername);

  // Generic error — never reveal whether the username or password was wrong
  const genericError = { error: 'Invalid username or password.' };

  if (!user) {
    return res.status(401).json(genericError);
  }

  const match = bcrypt.compareSync(password, user.passwordHash);
  if (!match) {
    return res.status(401).json(genericError);
  }

  req.session.userId = user.id;
  req.session.username = user.username;

  return res.json({ message: 'Login successful.', username: user.username });
});

// ---------- API: Session check ----------
app.get('/api/session', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  return res.json({ authenticated: false });
});

// ---------- API: Logout ----------
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out. Try again.' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out.' });
  });
});

// ---------- Protected page ----------
// Dashboard is NOT served from the static middleware so we can gate it server-side.
app.get('/dashboard.html', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login.html');
  }
  return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ---------- Static assets (everything except dashboard.html) ----------
app.use(express.static(path.join(__dirname, 'public'), { index: 'login.html' }));

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`OIBSIP Login Auth System running at http://localhost:${PORT}`);
  });
}
