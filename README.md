# Task Management REST API

A secure Task Management REST API built using Node.js, Express.js, MongoDB and JWT Authentication.

## Features

- User registration and login
- JWT authentication
- Password hashing using bcryptjs
- Protected APIs
- User profile
- Create, view, update and delete tasks
- Users can access only their own tasks
- Search tasks by title or description
- Filter tasks by status and priority
- Pagination
- Input validation
- Secure error responses

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- Postman

## Project Structure

```text
Task Management
├── src
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils
│   │   └── generateToken.js
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md