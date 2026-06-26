# CareerForge AI - AI Resume & Portfolio Builder

CareerForge AI is a professional MVP for an AI-powered resume, cover letter, ATS, and portfolio builder. It uses a React dashboard, a Node/Express API for authentication and storage, and a FastAPI AI service with a configurable provider. The Python service runs in mock mode by default and can be switched to IBM Watsonx when credentials are available.

## Architecture

React Frontend -> Node.js Backend -> Python FastAPI AI Service -> IBM Watsonx AI

## Features

- JWT register/login with protected dashboard
- MongoDB-backed student profile
- AI resume generation for five target roles
- Three resume templates: modern, professional, classic
- Authenticated PDF download for resumes and cover letters
- Personalized cover letter generator
- ATS PDF analyzer with score bars, suggestions, and missing skills
- Responsive portfolio page generated from profile data
- Dark mode, sidebar navigation, toast notifications, loading states

## Folder Structure

```text
careerforge-ai/
  frontend/
  backend/
  python-ai/
  docs/
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running locally or MongoDB Atlas URI

## Setup

1. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp python-ai/.env.example python-ai/.env
```

2. Install JavaScript dependencies:

```bash
npm run install:all
```

3. Install Python dependencies:

```bash
cd python-ai
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

4. Start services in three terminals:

```bash
cd python-ai
uvicorn app:app --reload --port 8000
```

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

Open `http://localhost:5173`.

## Watsonx Configuration

The AI service defaults to deterministic mock generation:

```env
AI_PROVIDER=mock
```

To use IBM Watsonx:

```env
AI_PROVIDER=watsonx
WATSONX_API_KEY=your-key
WATSONX_PROJECT_ID=your-project-id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
```

The Watsonx path asks the model to return structured JSON for resume generation. If credentials are missing or generation fails, the service falls back to the local generator so the MVP remains demoable.

## Backend APIs

- `POST /auth/register`
- `POST /auth/login`
- `GET /profile`
- `PUT /profile`
- `POST /resume/generate`
- `GET /resume/latest`
- `GET /resume/:id/download`
- `POST /coverletter/generate`
- `GET /coverletter/:id/download`
- `POST /ats/analyze`
- `GET /portfolio`

## Python APIs

- `POST /generate-resume`
- `POST /generate-cover-letter`
- `POST /analyze-resume`
- `GET /health`

## Demo Flow

1. Register a user.
2. Fill the profile page or paste entries from `docs/sample-profile.json`.
3. Generate a resume for a target role.
4. Switch templates and download the PDF.
5. Generate a cover letter using a job description.
6. Upload the resume PDF to the ATS analyzer.
7. Preview the portfolio page.

## Notes

- MongoDB must be running before starting the backend.
- PDF ATS analysis supports uploaded PDF files only.
- The frontend expects the backend at `http://localhost:5000`.
- The backend expects the AI service at `http://localhost:8000`.
