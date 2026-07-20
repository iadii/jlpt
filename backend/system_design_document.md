# 🎌 JLPT Sensei — Enterprise System Design Document

> **Japanese Learning Application** — Full Stack Architecture with ML/NLP Integration  
> **Version**: 1.0 | **Date**: July 2026  
> **Tech Stack**: Django 6.0 · Next.js 16 · PostgreSQL · FastAPI ML Service

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Tiers](#2-architecture-tiers)
3. [Current Backend Architecture](#3-current-backend-architecture)
4. [Database Schema](#4-database-schema)
5. [ML/NLP Features](#5-mlnlp-features)
6. [API Design](#6-api-design)
7. [Data Flow Diagrams](#7-data-flow-diagrams)
8. [Infrastructure & Deployment](#8-infrastructure--deployment)
9. [Observability](#9-observability)
10. [Diagram Files](#10-diagram-files)

---

## 1. System Overview

JLPT Sensei is a comprehensive Japanese language learning platform designed around the JLPT (Japanese Language Proficiency Test) certification levels (N5→N1). The system provides:

- **Content Learning**: Kana (Hiragana/Katakana), Vocabulary, Kanji, Grammar
- **Active Practice**: Adaptive quizzes with MCQ generation
- **Spaced Repetition**: ML-enhanced SRS for optimal memory retention
- **Gamification**: Streaks, XP, leaderboards
- **AI Features**: Grammar checking, pronunciation scoring, AI conversation tutor
- **Search**: Full-text Japanese search with Elasticsearch + kuromoji

### Key Design Principles

| Principle | Implementation |
|:---|:---|
| **Clean Architecture** | View → Service → Model with Mapper + DTO pattern |
| **Domain-Driven Design** | 8 bounded contexts as Django apps |
| **Microservice for ML** | FastAPI service scaled independently |
| **Event-Driven Async** | Celery for background tasks |
| **Cache-First Reads** | Redis for leaderboards, review queues |

---

## 2. Architecture Tiers

The system is organized into **6 tiers**:

### Tier 1: Client Tier
| Component | Technology | Purpose |
|:---|:---|:---|
| Web App | Next.js 16, React 19, Tailwind v4 | SSR/CSR web interface |
| Mobile (Future) | React Native | iOS + Android |
| PWA | Service Worker | Offline flashcards, push notifications |
| State Mgmt | Zustand + TanStack Query | Client + server state |

### Tier 2: Edge/Gateway Tier
| Component | Technology | Purpose |
|:---|:---|:---|
| CDN | CloudFlare | Static assets, audio, DDoS protection |
| Reverse Proxy | Nginx | SSL, rate limiting, gzip, load balancing |
| API Gateway | Nginx + django-ratelimit | JWT validation, CORS, throttling |

### Tier 3: API Tier (Django)
| Component | Technology | Purpose |
|:---|:---|:---|
| REST API | Django 6.0 + DRF 3.17 | 8 domain apps, 56+ endpoints |
| WebSocket | Django Channels + Daphne | Live quiz, real-time notifications |
| Auth | SimpleJWT | Access/refresh tokens, blacklist |
| Docs | drf-spectacular | OpenAPI 3.0 documentation |

### Tier 4: ML/NLP Tier
| Component | Technology | Purpose |
|:---|:---|:---|
| ML Service | FastAPI + Uvicorn | Independent scaling, GPU optional |
| Smart SRS | Half-Life Regression | Optimal review scheduling |
| Adaptive Quiz | IRT + Thompson Sampling | Personalized question selection |
| Grammar Check | MeCab + BERT / Gemini | Japanese grammar error detection |
| Speech ASR | Whisper / Cloud STT | Pronunciation scoring |
| AI Tutor | Gemini 2.0 Flash | JLPT-constrained conversation |
| Recommender | SVD / Collaborative Filtering | Personalized content ranking |

### Tier 5: Async Tier
| Component | Technology | Purpose |
|:---|:---|:---|
| Workers | Celery 5.x | SRS recalc, ML batch, analytics |
| Scheduler | Celery Beat | Daily SRS, weekly stats, cache warmup |
| Broker | Redis | Task queue + result backend |

### Tier 6: Data Tier
| Component | Technology | Purpose |
|:---|:---|:---|
| Primary DB | PostgreSQL 16 | OLTP, 10+ models, SRS data |
| Cache | Redis 7 | Sessions, leaderboard, review queues |
| Search | Elasticsearch 8 + kuromoji | Japanese full-text search |
| Object Storage | S3 / MinIO | Audio files, stroke order images |

---

## 3. Current Backend Architecture

### App Structure (Clean Layered Pattern)

```
backend/
├── config/              # Django project settings
├── accounts/            # 🔐 Auth + User Profile
│   ├── views.py         # Thin controllers (APIView)
│   ├── services.py      # Business logic (AuthService, ProfileService)
│   ├── mappers.py       # Model → Dict conversion (UserMapper)
│   ├── dtos.py          # Response shape serializers
│   ├── requests.py      # Input validation serializers
│   └── models.py        # UserProfile (OneToOne → User)
├── kana/                # あ Hiragana/Katakana
├── vocabulary/          # 📖 JLPT Vocabulary (N5-N1)
├── kanji/               # 漢 Kanji Characters
├── grammar/             # 📝 Grammar Points
├── quiz/                # 🎯 Quiz Generation + Scoring
├── progress/            # 📊 SRS + Learning Progress
├── sessions/            # ⏱️ Study Session Tracking
├── streaks/             # 🏆 Streaks + Leaderboard
└── shared/              # 🔧 ApiResponse, Pagination, Exceptions
```

### Request Lifecycle

```
HTTP Request
  → Nginx (SSL, rate limit)
    → Django Middleware (CORS, Auth, CSRF)
      → View (thin controller — validates input)
        → Service (business logic — no HTTP awareness)
          → Model (database operations)
        ← Mapper (converts Model → dict)
      ← ApiResponse.success(data) (standardized envelope)
    ← JSON Response
  ← HTTP Response
```

### Standardized Response Envelope

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

All errors follow the same shape:
```json
{
  "status": "error",
  "message": "Resource not found",
  "errors": null
}
```

---

## 4. Database Schema

### Current Models (9 tables)

| Model | App | Key Fields | Relationships |
|:---|:---|:---|:---|
| `User` | Django built-in | username, email, password | — |
| `UserProfile` | accounts | level, xp, daily_goal | OneToOne → User |
| `Kana` | kana | character, romaji, type, group | — |
| `Vocabulary` | vocabulary | kanji, kana, meaning, level, category | — |
| `Kanji` | kanji | character, onyomi, kunyomi, strokes | M2M → Vocabulary |
| `GrammarPoint` | grammar | title, structure, explanation, examples | — |
| `UserProgress` | progress | content_type, content_id, SRS fields | FK → User |
| `StudySession` | sessions | type, level, time, accuracy, xp | FK → User |
| `UserStreak` | streaks | current, longest, last_study_date | OneToOne → User |

### Proposed New Models (3 tables)

| Model | App | Purpose |
|:---|:---|:---|
| `MLPrediction` | ml | Store ML recall predictions per user per item |
| `UserInteraction` | analytics | Event tracking for analytics + ML training data |
| `ConversationMessage` | ml | AI tutor chat history |

---

## 5. ML/NLP Features

### Feature Priority Matrix

| Priority | Feature | ML/NLP Tech | Model |
|:---|:---|:---|:---|
| 🔴 High | Smart SRS | Logistic Regression / HLR | Custom trained |
| 🔴 High | Adaptive Quiz | IRT + Thompson Sampling | Custom |
| 🟡 Medium | Grammar Check | Transformer NLP | BERT-japanese / Gemini |
| 🟡 Medium | Speech Recognition | ASR | Whisper / Cloud STT |
| 🟡 Medium | AI Tutor | LLM | Gemini 2.0 Flash |
| 🟢 Low | Content Recommender | Collaborative Filtering | SVD / ALS |
| 🟢 Low | Handwriting Recognition | CNN | Custom / Cloud Vision |
| 🟢 Low | Reading Difficulty | Text Classification | Custom JLPT classifier |

### Smart SRS — Input Features

```
time_since_last_review (hours)
review_count
correct_count / incorrect_count
response_time_ms
ease_factor (current SM-2)
content_difficulty (difficulty_order)
user_proficiency (total_xp, overall_accuracy)
time_of_day
session_fatigue (items_reviewed_this_session)
```

### Adaptive Quiz — Algorithm

```
1. Estimate user ability θ from recent performance (IRT)
2. Thompson Sampling to balance:
   - 40% weak areas (exploitation)
   - 40% zone of proximal development
   - 20% exploration (new items)
3. Generate distractors from same JLPT level
```

---

## 6. API Design

### Current Endpoints: 56+

| Domain | Endpoints | Auth Required |
|:---|:---|:---|
| Auth & Profile | 6 | Mixed |
| Kana | 5 | Yes |
| Vocabulary | 8 | Yes |
| Kanji | 6 | Yes |
| Grammar | 6 | Yes |
| Quiz | 14 | Yes |
| Progress & SRS | 8 | Yes |
| Sessions | 3 | Yes |
| Streaks & Leaderboard | 6 | Yes |

### Proposed New Endpoints (v2)

| Method | Endpoint | Description |
|:---|:---|:---|
| POST | `/api/v2/ml/check-grammar/` | Japanese grammar error detection |
| POST | `/api/v2/ml/score-pronunciation/` | Audio pronunciation scoring |
| GET | `/api/v2/ml/recommendations/` | Personalized content recommendations |
| POST | `/api/v2/ml/chat/` | AI tutor conversation |
| GET | `/api/v2/ml/chat/history/` | Conversation history |
| GET | `/api/v2/search/?q=食` | Full-text Japanese search |
| GET | `/api/v2/progress/smart-review/` | ML-optimized review queue |

---

## 7. Data Flow Diagrams

### Quiz Flow (ML-Enhanced)
```
User → GET /quiz/vocabulary/n5/
  → Django Quiz Service
  → FastAPI ML: get_adaptive_questions(user_id, level)
    → IRT: estimate ability θ
    → Thompson Sampling: select optimal questions
  ← Ranked questions to client

User → POST /quiz/submit/
  → Score answers → Record in UserProgress
  → Celery async: update_srs_with_ml(answers)
    → HLR: predict P(recall) per item
    → Update next_review_date
  → Award XP → Update streak
  ← Results + corrections
```

### Daily SRS Recalculation
```
Celery Beat (00:00 UTC)
  → For each active user:
    → Fetch all UserProgress records
    → FastAPI ML: batch_predict_recall(features)
    → Update next_review_date for each item
    → Cache ranked review queue in Redis (24h TTL)
```

---

## 8. Infrastructure & Deployment

### Docker Compose Services

| Service | Image | Port | Purpose |
|:---|:---|:---|:---|
| `nginx` | Nginx 1.25 | 80/443 | Reverse proxy, SSL |
| `django` | Gunicorn + Uvicorn | 8000 | API server |
| `channels` | Daphne | 8001 | WebSocket server |
| `next-frontend` | Node.js 20 | 3000 | Next.js SSR |
| `ml-service` | FastAPI | 8002 | ML microservice |
| `celery-worker` | Celery | — | Async tasks |
| `celery-beat` | Celery Beat | — | Scheduler |
| `postgres` | PostgreSQL 16 | 5432 | Primary DB |
| `redis` | Redis 7 | 6379 | Cache + broker |
| `elasticsearch` | ES 8 | 9200 | Search |
| `minio` | MinIO | 9000 | Object storage |

### Persistent Volumes
- `pg_data` — PostgreSQL data
- `redis_data` — Redis persistence
- `es_data` — Elasticsearch indices
- `minio_data` — Media files
- `media_files` — Django media

---

## 9. Observability

| Layer | Tool | Purpose |
|:---|:---|:---|
| Error Tracking | Sentry | Exception capture, stack traces |
| Metrics | Prometheus + Grafana | API latency, ML inference time, DB queries |
| Logging | structlog → ELK/Loki | Structured JSON logs |
| APM | Sentry Performance | Transaction tracing |

---

## 10. Diagram Files

| File | Format | Contents |
|:---|:---|:---|
| [`SYSTEM_DESIGN.mermaid`](./SYSTEM_DESIGN.mermaid) | Mermaid | 11 diagrams: Architecture, ER, Sequences, State machines, Deployment |
| [`SYSTEM_DESIGN.excalidraw`](./SYSTEM_DESIGN.excalidraw) | Excalidraw | Visual 6-tier architecture with all components |

### Viewing Instructions

**Mermaid** (`.mermaid`):
- **GitHub**: Renders natively when pushed
- **VS Code**: Install "Mermaid Preview" extension
- **Online**: Paste sections into [mermaid.live](https://mermaid.live)
- Each diagram section is independent — copy between `%%===` markers

**Excalidraw** (`.excalidraw`):
- **VS Code**: Install "Excalidraw" extension (recommended)
- **Online**: Open at [excalidraw.com](https://excalidraw.com) → File → Open
- Fully editable — drag, resize, add notes

---

*Generated for JLPT Sensei — Japanese Learning Application*
