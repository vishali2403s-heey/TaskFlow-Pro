# 🚀 TaskFlow Pro

A modern **Full Stack Project Management Tool** built using **Node.js, Express.js, MySQL, HTML, CSS, JavaScript, Bootstrap, and Chart.js**.

TaskFlow Pro helps teams manage projects, organize tasks, collaborate with members, and monitor progress through a beautiful dashboard.

---

## 📸 Project Preview

> Add screenshots of your project inside the **screenshots/** folder.

### Dashboard
<img width="1905" height="856" alt="image" src="https://github.com/user-attachments/assets/ed611d56-9950-4f9a-a737-14c36544fa2a" />


### Projects
<img width="1892" height="770" alt="image" src="https://github.com/user-attachments/assets/bce475d8-e3e2-4eb3-8ac5-d73bbd87e179" />

### Tasks
<img width="1882" height="860" alt="image" src="https://github.com/user-attachments/assets/87bfc78a-59c0-4820-af4b-d270141142be" />


### Analytics
<img width="1897" height="837" alt="image" src="https://github.com/user-attachments/assets/4a01df5d-2d7d-4b95-8db1-7dad87ccac03" />


---

# ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- Secure Password Hashing (bcrypt)
- JWT Authentication
- Logout

### 📊 Dashboard
- Total Projects
- Total Tasks
- Completed Tasks
- Pending Tasks
- Team Members
- Deadlines
- Monthly Activity Chart
- Task Distribution Chart

### 📁 Projects
- Create Project
- Edit Project
- Delete Project
- Project Status
- Project Progress

### ✅ Tasks
- Create Task
- Assign Task
- Update Task
- Delete Task
- Due Date
- Priority
- Task Status

### 👥 Team
- Add Members
- Manage Team
- Member Roles

### 🔔 Notifications
- Task Updates
- Project Updates
- Deadline Alerts

### 👤 Profile
- Edit Profile
- Update Password
- View Activity

### ⚙ Settings
- Account Settings
- Theme Settings
- Notification Preferences

### 📈 Analytics
- Monthly Performance
- Task Completion Rate
- Project Statistics

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- Chart.js
- Bootstrap Icons

## Backend

- Node.js
- Express.js

## Database

- MySQL

## Authentication

- JWT
- bcryptjs

## Tools

- VS Code
- Git
- GitHub
- Postman

---

# 📂 Project Structure

```text
TaskFlow-Pro/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── assets/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── projects.html
│   ├── tasks.html
│   ├── analytics.html
│   ├── team.html
│   ├── notifications.html
│   ├── profile.html
│   └── settings.html
│
├── database/
│   └── taskflow.sql
│
├── screenshots/
│
├── README.md
└── .gitignore
```

---

# 💾 Installation

### Clone Repository

```bash
git clone https://github.com/YourUsername/TaskFlow-Pro.git
```

Go inside project

```bash
cd TaskFlow-Pro
```

---

## Backend Installation

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Run server

```bash
npm run dev
```

---

## Database

Create MySQL Database

```sql
CREATE DATABASE taskflow;
```

Import

```
database/taskflow.sql
```

---

# 🔑 Environment Variables

Create

```
backend/.env
```

```env
PORT=5000

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=yourpassword

DB_NAME=taskflow

JWT_SECRET=taskflow_secret_key
```

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

---

## Projects

| Method | Endpoint |
|---------|----------|
| GET | /api/projects |
| POST | /api/projects |
| PUT | /api/projects/:id |
| DELETE | /api/projects/:id |

---

## Tasks

| Method | Endpoint |
|---------|----------|
| GET | /api/tasks |
| POST | /api/tasks |
| PUT | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

# 📱 Responsive Design

✔ Desktop

✔ Tablet

✔ Mobile

---

# 🚀 Future Improvements

- Drag & Drop Kanban Board
- Calendar View
- File Uploads
- Email Notifications
- Dark Mode
- Real-time Chat
- Socket.io Integration
- Activity Timeline

---

# 👩‍💻 Author

**Shalini S**

- 🎓 B.Tech Artificial Intelligence & Machine Learning
- 💻 Full Stack Developer
- 🌱 Passionate about AI, Web Development, and Software Engineering

**GitHub**



---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project helpful:

⭐ Star this repository

🍴 Fork this repository

📢 Share it with others

---

## 💙 Thank You

Thank you for visiting **TaskFlow Pro**.

Happy Coding! 🚀
