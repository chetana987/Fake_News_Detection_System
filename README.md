# Fake News Detection System

An end-to-end, event-driven microservices platform for detecting and flagging misinformation in real time. The system ingests social media posts, extracts claims using NLP, verifies them against multiple evidence sources, and surfaces flagged content through a live dashboard.

## Architecture

```
Twitter Stream (Simulated)
        |
   Kafka raw-posts
        |
Claim Ingestion Service ──REST──→ Python ML (Claim Extraction)
        |
   Kafka claims-extracted
        |
Verification Service ──gRPC──→ Python ML (Verification)
        |   ├── Evidence: PostgreSQL cache
        |   ├── Evidence: Wikipedia API
        |   └── Evidence: Google Fact Check API
        |
   Kafka scored-claims
        |
Flagging Service (Rule Engine)
        |── PostgreSQL (persistence)
        |── Kafka flagged-posts
        └── WebSocket ──→ React Dashboard
```

## Services

| Service | Port | Responsibility |
|---------|------|----------------|
| **Claim Ingestion** | `8081` | Ingests posts, calls ML for claim extraction, publishes to Kafka |
| **Verification** | `8082` | Gathers evidence (Wikipedia, Google Fact Check, DB cache), calls ML for scoring, publishes results |
| **Flagging** | `8083` | Applies rule-based flagging, persists to DB, pushes real-time alerts via WebSocket, exposes REST API |
| **Python ML** | `8000` / `50051` / `50052` | BERT-based NER for claim extraction + sentence embeddings for truth scoring |
| **Frontend** | `80` (prod) / `5173` (dev) | React + TypeScript dashboard with live feed, analytics, and WebSocket updates |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.2.5, Spring Kafka, Spring Data JPA |
| **ML** | Python 3.11, FastAPI, Transformers (BERT), Sentence-Transformers |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Zustand, Recharts |
| **Messaging** | Apache Kafka 7.6.0 (Confluent), ZooKeeper |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Build** | Maven, npm, Docker Compose |

## Quick Start

### Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+ (frontend)
- Python 3.11+ (ML)
- Docker & Docker Compose

### 1. Start Infrastructure

```bash
docker compose up -d zookeeper kafka postgres redis
```

### 2. Build Services

```bash
mvn clean install -DskipTests
```

### 3. Start Java Services

```bash
# Terminal 1 - Claim Ingestion
cd claim-ingestion-service
set PGTZ=UTC && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 2 - Verification
cd verification-service
set PGTZ=UTC && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 3 - Flagging
cd flagging-service
set PGTZ=UTC && mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 4. Start ML Service (Optional)

```bash
cd python
pip install -r requirements.txt
uvicorn claim_extractor.server:app --host 0.0.0.0 --port 8000
```

### 5. Start Frontend (Optional)

```bash
cd frontend
npm install
npm run dev
```

### 6. Full Deployment with Docker

```bash
docker compose up --build -d
```

## API Endpoints

### Flagging Service (`http://localhost:8083`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/stats` | Aggregate dashboard statistics |
| `GET` | `/api/flagged` | List all flagged posts |
| `GET` | `/api/flagged/{id}` | Get flagged post by ID |
| `WS` | `/ws/flagged-claims` | WebSocket real-time alerts |

### Python ML Service (`http://localhost:8000`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/extract-claim` | Extract claim from text |

## Data Flow

1. **Simulated Twitter stream** publishes posts to `raw-posts` Kafka topic every 5 seconds
2. **Claim Ingestion** consumes posts, calls Python ML for NER-based claim extraction, publishes to `claims-extracted`
3. **Verification** consumes claims, retrieves evidence in parallel (Wikipedia, Google Fact Check, PostgreSQL cache), calls Python ML via gRPC for truth scoring, publishes to `scored-claims`
4. **Flagging** consumes scores, applies rule-based verdicts (`truthScore < 0.3` → FALSE, `< 0.5` → SUSPICIOUS, `> 0.8` → TRUE), persists to PostgreSQL, and publishes flagged posts
5. **Frontend** receives real-time updates via WebSocket and polls REST endpoints for analytics

## Project Structure

```
├── claim-ingestion-service/   # Spring Boot - post ingestion & claim extraction
├── verification-service/      # Spring Boot - evidence retrieval & verification
├── flagging-service/          # Spring Boot - flagging rules, REST API, WebSocket
├── shared-models/             # Shared DTOs, security config, DB schemas
├── frontend/                  # React + TypeScript dashboard
├── python/                    # FastAPI + gRPC ML service
├── docker-compose.yml         # Full stack deployment
└── seed-data.sql              # Sample claims for testing
```

---

*Project by Chetana Mahajan*
