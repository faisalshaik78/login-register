# OIBSIP WebDev Level 2 · Task 4 — Login Authentication System

## Objective
A full-stack authentication system with registration, login, a protected
dashboard, and logout — built with Node.js, Express, and a JSON file store.

## Tech Stack
- Node.js + Express (server, routing)
- express-session (server-side session management)
- bcrypt (password hashing — 10 salt rounds, never stored in plain text)
- Vanilla HTML/CSS/JS (frontend)
- JSON file (`data/users.json`) as the data store

## Features
- Registration: username/email + password, "Register" button
- Password validation: minimum 8 characters, at least 1 number (checked
  client-side and re-validated server-side)
- Duplicate username/email check on registration
- Login: username/email + password, "Login" button
- Incorrect credentials return one generic error ("Invalid username or
  password") — the response never reveals whether the username or the
  password was wrong
- Protected `/dashboard.html`: gated server-side. A direct hit with no
  valid session is redirected (302) straight to `login.html` — the check
  happens before any HTML is sent, not client-side
- Logout button clears the session (`express-session` destroy + cookie
  clear) and redirects to login
- Passwords are hashed with bcrypt before being written to disk — plain
  text passwords are never stored or logged
- Basic form validation on both pages (empty submissions rejected)

## Running it locally
```bash
npm install
npm start
```
Then open http://localhost:3000 (redirects to the login page).

## Project structure
```
server.js              Express app: all routes + session/auth logic
data/users.json         User store (id, username, bcrypt hash, createdAt)
public/register.html    Registration form
public/login.html       Login form
public/dashboard.html   Protected page (server-side gated)
public/css/style.css    Shared styling
public/js/*.js          Client-side fetch calls to the API
```

## How the protection works
`GET /dashboard.html` is intentionally excluded from Express's static file
middleware and handled by its own route. That route checks
`req.session.userId` before calling `res.sendFile`; if there's no valid
session it responds with a redirect instead. This means the dashboard's
markup is never even sent to an unauthenticated client — it isn't a
client-side redirect that could be bypassed by disabling JavaScript.

## Notes for the demo video / screenshots
1. Register a new account with a weak password → show the validation error.
2. Register with a valid password → success message → redirect to login.
3. Log in with the wrong password → generic error shown.
4. Log in with correct credentials → land on the dashboard.
5. Copy the dashboard URL, open it in a new incognito tab (no session) →
   show it redirects to login.
6. Click Logout → show it returns to login and the dashboard is
   inaccessible again.

## Security notes
- Session secret in `server.js` is a hardcoded placeholder for this demo —
  in production it should come from an environment variable.
- `data/users.json` is a simple flat-file store, fine for a learning
  project; a real app would use a proper database (MongoDB/PostgreSQL).
