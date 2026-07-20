<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg" alt="JLPT Sensei Logo" width="120" />
  <h1>JLPT Sensei - Enterprise Platform</h1>
  <p>
    <em>A Next-Generation, AI-Powered Japanese Language Learning Ecosystem</em>
  </p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
    <img src="https://img.shields.io/badge/Next.js-16%20App%20Router-black?logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/Django-6.0-092E20?logo=django" alt="Django">
    <img src="https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi" alt="FastAPI">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  </p>
</div>

---

## 📖 Table of Contents
- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Development Setup](#-local-development-setup)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment Strategy](#-deployment-strategy)
- [Contributing](#-contributing)

---

## 🎯 Overview

**JLPT Sensei** is an enterprise-grade platform designed to guide users from absolute beginner (N5) to advanced fluency (N1). Moving beyond traditional flashcards, the platform leverages Machine Learning (IRT, Half-Life Regression) and LLM-powered AI Tutors to create a hyper-personalized, adaptive learning journey.

---

## 🏗 System Architecture

The application is built on a decoupled, service-oriented architecture designed for horizontal scalability, independent deployments, and high availability.

### 1. Presentation Layer (Tier 1)
- **Framework:** Next.js 16 (React 19) utilizing the App Router.
- **Styling:** Tailwind CSS v4 with a custom premium design system (Glassmorphism, custom typography).
- **State Management:** Zustand (Client State) + TanStack Query (Server State/Caching).

### 2. Core API Backend (Tier 3)
- **Framework:** Django 6.0 with Django REST Framework (DRF).
- **Pattern:** Clean Architecture implementation (Controllers → Services → Repositories → Models).
- **Domain Apps:** Segregated into 8 distinct bounded contexts (`accounts`, `vocabulary`, `grammar`, `kana`, `kanji`, `quiz`, `progress`, `sessions`).

### 3. ML & AI Microservice (Tier 4)
- **Framework:** FastAPI (Python 3.10+).
- **Responsibilities:** 
  - AI Tutor Chatbot (Google GenAI / Gemini 2.0 Integration).
  - Smart Spaced Repetition System (SRS) using Half-Life Regression.
  - Adaptive Quizzing via Item Response Theory (IRT).
  - Natural Language Processing (NLP) for grammar and pronunciation validation.

---

## 📂 Project Structure

```text
japanese-l/
├── backend/                  # Monolithic Core API (Django)
│   ├── config/               # Main settings and WSGI/ASGI configurations
│   ├── ml_service/           # Standalone FastAPI ML Microservice
│   ├── shared/               # Cross-cutting concerns (mixins, base models)
│   └── */                    # Django domain apps (e.g., accounts, vocabulary)
├── frontend/                 # Web Application (Next.js)
│   ├── src/app/              # App Router pages and layouts
│   ├── src/components/       # Reusable UI elements and generic components
│   ├── src/lib/              # API clients, utilities, and integrations
│   └── src/store/            # Zustand state management slices
├── start.sh                  # Universal local orchestration script
└── README.md                 # Project documentation
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js**: `v20.0.0` or higher (managed via `nvm` recommended)
- **Python**: `3.10.x` or higher (managed via `pyenv` recommended)
- **PostgreSQL**: `v15` or higher (Local installation or Docker container)
- **Redis**: (Optional, required for upcoming Celery/Channels integration)

---

## 🚀 Local Development Setup

To streamline local development, we provide a unified startup script. However, you must install dependencies for all three services first.

### 1. Frontend Setup
```bash
cd frontend
npm install
```

### 2. Django Backend Setup
```bash
cd backend
uv venv .venv
source .venv/bin/activate
uv pip install -r requirements.txt
python manage.py migrate
```

### 3. FastAPI ML Service Setup
```bash
cd backend/ml_service
uv venv .venv
source .venv/bin/activate
uv pip install -r requirements.txt
```

### 4. Running the Ecosystem
From the root of the repository, execute the orchestration script:

```bash
chmod +x start.sh
./start.sh
```

**Service Endpoints:**
- 🌐 **Web Client:** [http://localhost:3000](http://localhost:3000)
- ⚙️ **Django API:** [http://localhost:8000](http://localhost:8000)
- 🧠 **ML Service Docs:** [http://localhost:8002/docs](http://localhost:8002/docs)

---

## 🧪 Testing & Quality Assurance

Quality is enforced via automated pipelines. Before submitting a PR, ensure local tests pass.

- **Frontend:** 
  ```bash
  cd frontend && npm run lint && npm run test
  ```
- **Backend (Django):** 
  ```bash
  cd backend && source .venv/bin/activate && python manage.py test
  ```
- **ML Service:** 
  ```bash
  cd backend/ml_service && source .venv/bin/activate && pytest
  ```

---

## 🚢 Deployment Strategy

The application is designed for cloud-native deployment (AWS/GCP) using containerization.

- **Frontend:** Deployed via Vercel for Edge Caching and optimal Web Vitals.
- **Django Backend:** Dockerized and orchestrated via Kubernetes or AWS ECS, backed by Managed PostgreSQL (RDS).
- **ML Service:** Deployed as an independent scalable container service, potentially utilizing GPU-backed nodes if local inference is adopted in the future.

---

## 🤝 Contributing

We welcome contributions! Please adhere to our branching strategy:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes utilizing Conventional Commits (`git commit -m 'feat: Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---
<div align="center">
  <i>Maintained by the JLPT Sensei Core Engineering Team.</i>
</div>
