## Task Manager API
A simple API where a registered user can make requests to do CRUD operations on their account & tasks.

Base URL attached in the repo which can be used with routes followed with -
* '/users' - Specific paths in src/routes/user.js
* '/tasks' - Specific paths in src/routes/task.js

Environment variables constitute(to be included in your .env file) -
1. JWT_SECRET - JWT secret key
1. DB_URL - Database connection URL
1. SENDGRID_API_KEY - Emails to send using sendgrid api
1. EMAIL_FROM - My email id from which email are sent, just don't wanna expose it :)
