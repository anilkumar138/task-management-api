# TaskFlow — Task Management System

A full-stack task management application built with the MERN stack. TaskFlow allows users to register, log in, and organize their tasks through a clean, responsive dashboard.

## Features

### Authentication
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes

### Task Management
- Create, view, update, and delete tasks
- Set task status: Pending, In Progress, Completed
- Set task priority: Low, Medium, High
- Assign due dates
- Search tasks by title or description
- Filter tasks by status and priority
- Pagination for task lists
- User-specific task access

### Dashboard
- Task summary cards
- Task status and priority indicators
- Search and filter controls
- Responsive React interface

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

**Tools**
- Git and GitHub
- Postman
- MongoDB Atlas

## Project Structure

```text
Task Management/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
├── server.js
├── package.json
├── .env.example
├── postman/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── layouts/
    │   ├── pages/
    │   └── services/
    ├── package.json
    └── vite.config.js
```

## Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/anilkumar138/task-management-api.git
cd task-management-api
```

### 2. Configure the backend

Install backend dependencies from the project root:

```bash
npm install
```

Create a `.env` file in the project root using `.env.example` as a template.

Configure these environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use your own MongoDB connection string and a strong, private JWT secret.

### 3. Start the backend

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 4. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL shown in your terminal, usually:

`http://localhost:5173`

Ensure the frontend API base URL points to your running backend.

## API Overview

The API uses JSON requests and responses.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/profile` | Get authenticated user profile |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Get tasks with search, filters, and pagination |
| GET | `/api/tasks/:id` | Get a single task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Protected endpoints require a valid JWT in the Authorization header:

`Authorization: Bearer YOUR_TOKEN`

## Testing

The project includes a Postman collection in the `postman/` directory. Import the collection into Postman to test the API endpoints.

## Deployment

The intended deployment setup is:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Deployment URLs will be added once deployment is complete.

## Security

- Keep `.env` out of version control.
- Never publish database credentials or JWT secrets.
- Use environment variables for production configuration.
- Access tasks only through authenticated user accounts.

## Author

**Anil Kumar**

GitHub: https://github.com/anilkumar138

LinkedIn: https://www.linkedin.com/in/anil-kumar9718

---

If you find this project useful, consider giving the repository a star.
