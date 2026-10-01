# Login & Registration System

A full-stack authentication project built to practice user registration, login, session management, password hashing, protected routes, and logout.

## Features

- User registration
- Password validation
- Duplicate username/email checks
- Login with username or email
- Generic invalid-credentials error
- Server-side session management
- Protected dashboard route
- Logout and session destruction
- Password hashing with bcrypt
- Client-side and server-side form validation

## Tech Stack

- Node.js
- Express.js
- express-session
- bcrypt
- HTML5
- CSS3
- JavaScript
- JSON file storage

## Project Structure

```text
login-register/
├── server.js
├── data/
│   └── users.json
└── public/
    ├── register.html
    ├── login.html
    ├── dashboard.html
    ├── css/
    │   └── style.css
    └── js/
        └── ...
```

## How It Works

The application checks the user's session before serving the protected dashboard. If there is no valid session, the request is redirected to the login page.

Passwords are hashed with bcrypt before being stored. The application does not store plain-text passwords.

## Run Locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## What I Practiced

- Building authentication flows with Express
- Working with sessions and cookies
- Password hashing with bcrypt
- Protecting server-side routes
- Validating user input
- Connecting frontend forms to backend APIs

## Security Notes

This is a learning project.

- The session secret should be stored in an environment variable in production.
- JSON file storage is suitable for this demonstration; production applications should use a proper database such as MongoDB or PostgreSQL.
- Additional production security measures such as HTTPS, rate limiting, CSRF protection, and secure cookie configuration should be added before deployment.

## Author

**SHAIK FAISAL**

[GitHub](https://github.com/faisalshaik78)
