# Backend Product Requirements Document (PRD)

This document details the backend requirements and API specifications for the Japanese Learning Application. The backend is built with **Django 5.x**, **Django REST Framework**, and **PostgreSQL**.

---

## 1. Database Schema (Models)

### 1.1 User & Profile

- **User** (Django default): `email`, `username`, `password`, `date_joined`, `is_active`
- **UserProfile** (One-to-One with User):

| Field | Type | Description |
|:---|:---|:---|
| `current_level` | Enum | Current JLPT level (N5–N1) |
| `daily_goal_minutes` | Integer | Daily study target in minutes |
| `total_xp` | Integer | Cumulative experience points |
| `preferred_language` | String | UI language preference (default: `en`) |

### 1.2 Kana

| Field | Type | Description |
|:---|:---|:---|
| `id` | PK | — |
| `character` | String | The kana character (e.g., `か`) |
| `romaji` | String | Romanized reading (e.g., `ka`) |
| `kana_type` | Enum | `hiragana` or `katakana` |
| `group` | String | Row grouping (e.g., `a-row`, `ka-row`, `sa-row`) |
| `stroke_order_image` | URL/Path | Image showing stroke order |
| `audio_url` | URL/Path | Pronunciation audio clip |

### 1.3 Vocabulary

| Field | Type | Description |
|:---|:---|:---|
| `id` | PK | — |
| `kanji` | String (nullable) | Kanji form (e.g., `食べる`) |
| `kana` | String | Hiragana/Katakana reading (e.g., `たべる`) |
| `romaji` | String | Romanized form (e.g., `taberu`) |
| `meaning` | String | English translation |
| `jlpt_level` | Enum | N5, N4, N3, N2, N1 |
| `part_of_speech` | String | Noun, Verb, Adjective, etc. |
| `category` | String | Topic grouping: `greetings`, `food`, `travel`, `numbers`, `family`, etc. |
| `example_sentence_jp` | Text | Japanese example sentence |
| `example_sentence_en` | Text | English translation of example |
| `audio_url` | URL/Path | Pronunciation audio |
| `difficulty_order` | Integer | Ordering within a level for progressive difficulty |

### 1.4 Kanji

| Field | Type | Description |
|:---|:---|:---|
| `id` | PK | — |
| `character` | String | The kanji (e.g., `食`) |
| `onyomi` | String | Chinese-origin reading (e.g., `ショク`) |
| `kunyomi` | String | Japanese-origin reading (e.g., `た.べる`) |
| `meaning` | String | English meaning |
| `stroke_count` | Integer | Number of strokes |
| `jlpt_level` | Enum | N5–N1 |
| `stroke_order_image` | URL/Path | Stroke order visual |
| `example_words` | M2M → Vocabulary | Words that use this kanji |

### 1.5 GrammarPoint

| Field | Type | Description |
|:---|:---|:---|
| `id` | PK | — |
| `title` | String | e.g., `は (wa) — Topic Marker` |
| `explanation` | Text | Detailed English explanation |
| `structure` | String | e.g., `[Noun] は [Noun] です` |
| `jlpt_level` | Enum | N5–N1 |
| `example_sentences` | JSON | List of `{japanese, romaji, english}` |
| `difficulty_order` | Integer | Ordering within a level |

### 1.6 UserProgress

| Field | Type | Description |
|:---|:---|:---|
| `id` | PK | — |
| `user` | FK → User | — |
| `content_type` | String | `vocabulary`, `kana`, `kanji`, `grammar` |
| `content_id` | Integer | ID of the content item |
| `status` | Enum | `new`, `learning`, `reviewing`, `mastered` |
| `correct_count` | Integer | Total correct answers |
| `incorrect_count` | Integer | Total incorrect answers |
| `ease_factor` | Float | SRS ease factor (default 2.5) |
| `interval_days` | Integer | Current SRS interval |
| `next_review_date` | Date | When to show this item next |
| `last_reviewed_at` | DateTime | Last interaction timestamp |

### 1.7 StudySession

| Field | Type | Description |
|:---|:---|:---|
| `id` | PK | — |
| `user` | FK → User | — |
| `session_type` | String | `vocabulary`, `kana`, `kanji`, `grammar`, `quiz` |
| `jlpt_level` | String | Level studied |
| `start_time` | DateTime | — |
| `end_time` | DateTime (nullable) | — |
| `words_reviewed` | Integer | Items covered |
| `accuracy_percentage` | Float | Correctness rate |
| `xp_earned` | Integer | XP gained this session |

### 1.8 UserStreak

| Field | Type | Description |
|:---|:---|:---|
| `user` | One-to-One → User | — |
| `current_streak` | Integer | Consecutive days studied |
| `longest_streak` | Integer | All-time best |
| `last_study_date` | Date | To detect broken streaks |

---

## 2. API Endpoints

### 2.1 Authentication & User Management

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| **POST** | `/api/auth/register/` | Register a new account | No |
| **POST** | `/api/auth/login/` | Login, receive JWT tokens | No |
| **POST** | `/api/auth/refresh/` | Refresh access token | No |
| **POST** | `/api/auth/logout/` | Blacklist token (logout) | Yes |
| **GET** | `/api/users/profile/` | Get authenticated user profile | Yes |
| **PUT** | `/api/users/profile/update/` | Update profile (goals, level, etc.) | Yes |

#### Request/Response Examples

**POST `/api/auth/register/`**
```json
// Request
{ "email": "user@example.com", "username": "tanaka", "password": "securePass123" }

// Response 201
{ "id": 1, "email": "user@example.com", "username": "tanaka",
  "tokens": { "access": "eyJ...", "refresh": "eyJ..." } }
```

**POST `/api/auth/login/`**
```json
// Request
{ "email": "user@example.com", "password": "securePass123" }

// Response 200
{ "id": 1, "username": "tanaka",
  "tokens": { "access": "eyJ...", "refresh": "eyJ..." } }
```

---

### 2.2 Kana Endpoints

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| **GET** | `/api/kana/hiragana/` | All 46 hiragana characters | Yes |
| **GET** | `/api/kana/katakana/` | All 46 katakana characters | Yes |
| **GET** | `/api/kana/hiragana/<str:group>/` | Specific row (e.g., `ka-row` → か き く け こ) | Yes |
| **GET** | `/api/kana/katakana/<str:group>/` | Same for katakana | Yes |
| **GET** | `/api/kana/details/<int:kana_id>/` | Single kana with stroke order and audio | Yes |

#### Response Example

**GET `/api/kana/hiragana/`** (single item in `results`)
```json
{
  "id": 6,
  "character": "か",
  "romaji": "ka",
  "kana_type": "hiragana",
  "group": "ka-row",
  "stroke_order_image": "/media/kana/hiragana_ka.png",
  "audio_url": "/media/audio/kana/ka.mp3"
}
```

---

### 2.3 Vocabulary Endpoints

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| **GET** | `/api/words/n5/` | N5 vocabulary (paginated) | Yes |
| **GET** | `/api/words/n4/` | N4 vocabulary (paginated) | Yes |
| **GET** | `/api/words/n3/` | N3 vocabulary (paginated) | Yes |
| **GET** | `/api/words/n2/` | N2 vocabulary (paginated) | Yes |
| **GET** | `/api/words/n1/` | N1 vocabulary (paginated) | Yes |
| **GET** | `/api/words/details/<int:word_id>/` | Single word details | Yes |
| **GET** | `/api/words/categories/` | List all available categories | Yes |
| **GET** | `/api/words/category/greetings/` | Words in "greetings" category | Yes |
| **GET** | `/api/words/category/food/` | Words in "food" category | Yes |
| **GET** | `/api/words/category/numbers/` | Words in "numbers" category | Yes |
| **GET** | `/api/words/category/travel/` | Words in "travel" category | Yes |
| **GET** | `/api/words/category/family/` | Words in "family" category | Yes |

#### Response Example

**GET `/api/words/n5/`** (single item in `results`)
```json
{
  "id": 42,
  "kanji": "食べる",
  "kana": "たべる",
  "romaji": "taberu",
  "meaning": "to eat",
  "part_of_speech": "verb",
  "category": "food",
  "example_sentence_jp": "朝ごはんを食べる。",
  "example_sentence_en": "I eat breakfast.",
  "audio_url": "/media/audio/vocab/taberu.mp3",
  "user_status": "learning"
}
```

---

### 2.4 Kanji Endpoints

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| **GET** | `/api/kanji/n5/` | All N5 kanji (paginated) | Yes |
| **GET** | `/api/kanji/n4/` | All N4 kanji (paginated) | Yes |
| **GET** | `/api/kanji/n3/` | All N3 kanji (paginated) | Yes |
| **GET** | `/api/kanji/n2/` | All N2 kanji (paginated) | Yes |
| **GET** | `/api/kanji/n1/` | All N1 kanji (paginated) | Yes |
| **GET** | `/api/kanji/details/<int:kanji_id>/` | Single kanji with readings, stroke order, linked vocab | Yes |

#### Response Example

**GET `/api/kanji/details/5/`**
```json
{
  "id": 5,
  "character": "食",
  "onyomi": "ショク",
  "kunyomi": "た.べる",
  "meaning": "eat, food",
  "stroke_count": 9,
  "jlpt_level": "n5",
  "stroke_order_image": "/media/kanji/shoku.png",
  "example_words": [
    { "id": 42, "kanji": "食べる", "kana": "たべる", "meaning": "to eat" },
    { "id": 78, "kanji": "食事", "kana": "しょくじ", "meaning": "meal" }
  ]
}
```

---

### 2.5 Grammar Endpoints

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| **GET** | `/api/grammar/n5/` | All N5 grammar points (paginated) | Yes |
| **GET** | `/api/grammar/n4/` | All N4 grammar points (paginated) | Yes |
| **GET** | `/api/grammar/n3/` | All N3 grammar points (paginated) | Yes |
| **GET** | `/api/grammar/n2/` | All N2 grammar points (paginated) | Yes |
| **GET** | `/api/grammar/n1/` | All N1 grammar points (paginated) | Yes |
| **GET** | `/api/grammar/details/<int:grammar_id>/` | Single grammar point with full explanation | Yes |

#### Response Example

**GET `/api/grammar/details/1/`**
```json
{
  "id": 1,
  "title": "は (wa) — Topic Marker",
  "explanation": "は marks the topic of a sentence. It tells the listener what you are talking about.",
  "structure": "[Noun] は [Noun] です",
  "jlpt_level": "n5",
  "example_sentences": [
    { "japanese": "私は学生です。", "romaji": "Watashi wa gakusei desu.", "english": "I am a student." },
    { "japanese": "これは本です。", "romaji": "Kore wa hon desu.", "english": "This is a book." }
  ]
}
```

---

### 2.6 Quiz / Practice Endpoints

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| **GET** | `/api/quiz/vocabulary/n5/` | Generate N5 vocabulary quiz (random MCQs) | Yes |
| **GET** | `/api/quiz/vocabulary/n4/` | Generate N4 vocabulary quiz | Yes |
| **GET** | `/api/quiz/vocabulary/n3/` | Generate N3 vocabulary quiz | Yes |
| **GET** | `/api/quiz/vocabulary/n2/` | Generate N2 vocabulary quiz | Yes |
| **GET** | `/api/quiz/vocabulary/n1/` | Generate N1 vocabulary quiz | Yes |
| **GET** | `/api/quiz/kana/hiragana/` | Generate hiragana recognition quiz | Yes |
| **GET** | `/api/quiz/kana/katakana/` | Generate katakana recognition quiz | Yes |
| **GET** | `/api/quiz/kanji/n5/` | Generate N5 kanji quiz | Yes |
| **GET** | `/api/quiz/kanji/n4/` | Generate N4 kanji quiz | Yes |
| **GET** | `/api/quiz/kanji/n3/` | Generate N3 kanji quiz | Yes |
| **GET** | `/api/quiz/kanji/n2/` | Generate N2 kanji quiz | Yes |
| **GET** | `/api/quiz/kanji/n1/` | Generate N1 kanji quiz | Yes |
| **POST** | `/api/quiz/submit/` | Submit quiz answers, get score + update progress | Yes |
| **GET** | `/api/quiz/history/` | Past quiz results | Yes |

#### Request/Response Examples

**GET `/api/quiz/vocabulary/n5/`** (returns 10 random MCQs)
```json
{
  "quiz_type": "vocabulary",
  "level": "n5",
  "question_count": 10,
  "questions": [
    {
      "word_id": 42,
      "question": "What does 食べる (たべる) mean?",
      "options": ["to eat", "to drink", "to run", "to sleep"],
      "audio_url": "/media/audio/vocab/taberu.mp3"
    }
  ]
}
```

**POST `/api/quiz/submit/`**
```json
// Request
{
  "quiz_type": "vocabulary",
  "level": "n5",
  "answers": [
    { "word_id": 42, "user_answer": "to eat", "is_correct": true },
    { "word_id": 15, "user_answer": "dog", "is_correct": false }
  ]
}

// Response 200
{
  "score": 1, "total": 2, "accuracy": 50.0, "xp_earned": 5,
  "corrections": [
    { "word_id": 15, "correct_answer": "cat", "user_answer": "dog" }
  ]
}
```

---

### 2.7 User Progress & SRS

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| **GET** | `/api/progress/summary/` | Overall dashboard stats (total mastered, accuracy, etc.) | Yes |
| **GET** | `/api/progress/due-reviews/` | Words/items scheduled for review today | Yes |
| **GET** | `/api/progress/n5/` | N5 progress breakdown | Yes |
| **GET** | `/api/progress/n4/` | N4 progress breakdown | Yes |
| **GET** | `/api/progress/n3/` | N3 progress breakdown | Yes |
| **GET** | `/api/progress/n2/` | N2 progress breakdown | Yes |
| **GET** | `/api/progress/n1/` | N1 progress breakdown | Yes |
| **POST** | `/api/progress/record/<int:word_id>/` | Record correct/incorrect answer, update SRS | Yes |

#### Request/Response Examples

**POST `/api/progress/record/42/`**
```json
// Request
{ "content_type": "vocabulary", "is_correct": true, "response_time_ms": 2300 }

// Response 200
{
  "word_id": 42, "new_status": "reviewing",
  "next_review_date": "2026-07-22", "interval_days": 3, "xp_earned": 10
}
```

**GET `/api/progress/summary/`**
```json
{
  "total_words_learned": 85,
  "total_kana_mastered": 46,
  "total_kanji_learned": 12,
  "overall_accuracy": 78.5,
  "total_xp": 1250,
  "current_level": "n5",
  "level_progress": {
    "n5": { "total": 800, "mastered": 85, "learning": 40, "percentage": 15.6 }
  }
}
```

---

### 2.8 Study Sessions

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| **POST** | `/api/sessions/start/` | Start a study session, returns session ID | Yes |
| **POST** | `/api/sessions/complete/<int:session_id>/` | Complete session with metrics | Yes |
| **GET** | `/api/sessions/history/` | Past session history (paginated) | Yes |

---

### 2.9 Streaks & Gamification

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| **GET** | `/api/streaks/current/` | User's current and longest streak | Yes |
| **POST** | `/api/streaks/checkin/` | Mark today as a study day | Yes |
| **GET** | `/api/leaderboard/weekly/` | Top users by XP this week | Yes |
| **GET** | `/api/leaderboard/monthly/` | Top users by XP this month | Yes |
| **GET** | `/api/leaderboard/all-time/` | Top users by total XP | Yes |

---

## 3. Pagination

All list endpoints use cursor-based pagination with a default page size of **50 items**.

```json
{
  "count": 800,
  "next": "/api/words/n5/?cursor=abc123",
  "previous": null,
  "page_size": 50,
  "results": [ ... ]
}
```

---

## 4. Technology Stack

| Component | Technology |
|:---|:---|
| Web Framework | Django 5.x |
| API Framework | Django REST Framework |
| Database | PostgreSQL (`psycopg2-binary`) |
| Authentication | `djangorestframework-simplejwt` |
| CORS | `django-cors-headers` |
| Media Storage | Django `MEDIA_ROOT` (local for MVP) |
