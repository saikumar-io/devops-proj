# Nexus Task Manager - DevOps Mini Project

Nexus is a modern, high-performance Task Manager application built to demonstrate a full-stack DevOps lifecycle. It features a polished Glassmorphism UI, a RESTful Flask backend, and is fully containerized with a CI/CD pipeline.

## 🚀 Features

- **Premium UI/UX:** Glassmorphism design with Dark/Light modes.
- **REST API:** Flask-based backend with SQLAlchemy.
- **Real-time Stats:** Automatic task counters and success rate calculation.
- **CI/CD Ready:** Complete Docker and Jenkins integration.
- **Responsive:** Optimized for both desktop and mobile devices.

---


## 🛠️ Tech Stack

- **Backend:** Python (Flask), SQLite, SQLAlchemy
- **Frontend:** HTML5, Vanilla CSS3 (Custom Design), Vanilla JavaScript
- **Icons:** Lucide Icons
- **DevOps:** Docker, Docker Compose, Jenkins

---

## 💻 Local Setup (Without Docker)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd devops_proj
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```
   Access at: `http://localhost:5000`

---

## 🐳 Docker Deployment

1. **Build and Run with Docker Compose:**
   ```bash
   docker-compose up --build -d
   ```

2. **Access the app:** `http://localhost:5000`

---

## ⚙️ Jenkins CI/CD Setup

1. **Install Jenkins:** Ensure Docker is installed on the Jenkins server.
2. **Plugins:** Install "Docker Pipeline" plugin.
3. **Webhook Setup:**
   - Go to your GitHub Repository Settings > Webhooks.
   - Payload URL: `http://<your-jenkins-ip>:8080/github-webhook/`.
   - Content Type: `application/json`.
4. **Create Pipeline:**
   - Create a "Pipeline" job in Jenkins.
   - Link your GitHub repository.
   - Point to the `Jenkinsfile` in the project root.

---

## 📂 Project Structure

```text
devops_proj/
├── app.py              # Flask Application Entry
├── models.py           # Database Models
├── requirements.txt    # Python Dependencies
├── Dockerfile          # Container Configuration
├── docker-compose.yml  # Orchestration Script
├── Jenkinsfile         # CI/CD Pipeline
├── static/
│   ├── css/style.css   # Modern Design System
│   └── js/app.js       # Frontend Interactivity
└── templates/
    └── index.html      # Main Dashboard
```

## 📄 License
This project is for educational purposes as part of a DevOps mini-project.
