import json
import os
from io import BytesIO
from typing import Any

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pypdf import PdfReader

load_dotenv()

app = FastAPI(title="CareerForge AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResumeRequest(BaseModel):
    profile: dict[str, Any]
    target_role: str = Field(..., min_length=2)


class CoverLetterRequest(BaseModel):
    profile: dict[str, Any] | None = None
    company_name: str
    job_role: str
    job_description: str


def _profile_value(profile: dict[str, Any], key: str, default: str = "") -> str:
    personal = profile.get("personal") or {}
    return personal.get(key) or default


def _list(profile: dict[str, Any], key: str) -> list[Any]:
    value = profile.get(key)
    return value if isinstance(value, list) else []


def _entry_titles(entries: list[Any]) -> list[str]:
    titles = []
    for item in entries:
        if isinstance(item, dict):
            title = item.get("title") or item.get("organization")
            if title:
                titles.append(title)
    return titles


def _mock_resume(profile: dict[str, Any], target_role: str) -> dict[str, Any]:
    name = _profile_value(profile, "fullName", "Candidate")
    skills = _list(profile, "skills") or ["Python", "React", "APIs", "Problem Solving"]
    projects = _list(profile, "projects")
    experience = _list(profile, "experience")
    achievements = _list(profile, "achievements") or [
        "Delivered measurable improvements through structured problem solving.",
        "Collaborated with cross-functional teams to ship reliable user-facing features.",
    ]

    project_lines = []
    for project in projects[:4]:
        if isinstance(project, dict):
            tech = ", ".join(project.get("technologies") or skills[:3])
            project_lines.append(
                f"{project.get('title', 'Project')}: built {project.get('description', 'a practical solution')} using {tech}."
            )
    if not project_lines:
        project_lines = [
            f"Career-focused capstone: designed a {target_role.lower()} portfolio project using {', '.join(skills[:4])}."
        ]

    experience_lines = []
    for role in experience[:4]:
        if isinstance(role, dict):
            experience_lines.append(
                f"{role.get('title', 'Contributor')} at {role.get('organization', 'an academic or professional team')}: {role.get('description', 'owned delivery, documentation, and collaboration.')}"
            )
    if not experience_lines:
        experience_lines = [
            f"Applied {target_role.lower()} skills across academic projects, internships, and self-directed builds."
        ]

    return {
        "professional_summary": (
            f"{name} is a detail-oriented {target_role} candidate with hands-on experience in "
            f"{', '.join(skills[:5])}. Strong at translating requirements into polished, maintainable products."
        ),
        "technical_skills": skills,
        "project_descriptions": project_lines,
        "experience": experience_lines,
        "achievements": achievements,
        "ats_score": min(96, 72 + len(skills) + len(project_lines) * 2),
    }


def _watsonx_generate(prompt: str) -> str | None:
    if os.getenv("AI_PROVIDER", "mock").lower() != "watsonx":
        return None

    api_key = os.getenv("WATSONX_API_KEY")
    project_id = os.getenv("WATSONX_PROJECT_ID")
    base_url = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
    model_id = os.getenv("WATSONX_MODEL_ID", "ibm/granite-13b-chat-v2")
    if not api_key or not project_id:
        return None

    token_resp = requests.post(
        "https://iam.cloud.ibm.com/identity/token",
        data={"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": api_key},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )
    token_resp.raise_for_status()
    token = token_resp.json()["access_token"]
    generation_resp = requests.post(
        f"{base_url}/ml/v1/text/generation?version=2024-05-01",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={
            "model_id": model_id,
            "project_id": project_id,
            "input": prompt,
            "parameters": {"decoding_method": "greedy", "max_new_tokens": 900, "temperature": 0.3},
        },
        timeout=60,
    )
    generation_resp.raise_for_status()
    return generation_resp.json()["results"][0]["generated_text"]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "careerforge-ai"}


@app.post("/generate-resume")
def generate_resume(payload: ResumeRequest) -> dict[str, Any]:
    prompt = (
        "Return only valid JSON for a resume with keys professional_summary, technical_skills, "
        f"project_descriptions, experience, achievements, ats_score. Target role: {payload.target_role}. "
        f"Profile: {json.dumps(payload.profile, default=str)}"
    )
    try:
        generated = _watsonx_generate(prompt)
        if generated:
            return json.loads(generated[generated.find("{") : generated.rfind("}") + 1])
    except Exception:
        pass
    return _mock_resume(payload.profile, payload.target_role)


@app.post("/generate-cover-letter")
def generate_cover_letter(payload: CoverLetterRequest) -> dict[str, str]:
    profile = payload.profile or {}
    name = _profile_value(profile, "fullName", "Candidate")
    skills = ", ".join((_list(profile, "skills") or ["software engineering", "collaboration"])[:6])
    projects = ", ".join(_entry_titles(_list(profile, "projects"))[:2])
    text = (
        f"Dear Hiring Team at {payload.company_name},\n\n"
        f"I am excited to apply for the {payload.job_role} role. My background in {skills} aligns well "
        f"with your requirements, and my project experience{f' in {projects}' if projects else ''} has prepared "
        "me to contribute quickly to product-focused engineering teams.\n\n"
        f"Your job description emphasizes {payload.job_description[:180].strip()}. I can bring a practical "
        "mindset, clear communication, and a strong habit of learning fast while building reliable solutions.\n\n"
        f"Thank you for considering my application.\n\nSincerely,\n{name}"
    )
    return {"cover_letter": text}


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)) -> dict[str, Any]:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    raw = await file.read()
    reader = PdfReader(BytesIO(raw))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    lower = text.lower()
    keywords = ["python", "react", "node", "api", "mongodb", "leadership", "project", "skills", "experience"]
    found = [word for word in keywords if word in lower]
    missing = [word.title() for word in keywords if word not in lower][:6]
    formatting_score = 88 if len(reader.pages) <= 2 and len(text) > 500 else 72
    keyword_score = int((len(found) / len(keywords)) * 100)
    overall = round(keyword_score * 0.6 + formatting_score * 0.4)

    suggestions = [
        "Add a targeted skills section with tools from the job description.",
        "Quantify project impact using metrics, scale, or performance improvements.",
        "Keep the resume to one or two pages with clear section headings.",
    ]
    if "github" not in lower:
        suggestions.append("Include GitHub or portfolio links for technical proof.")

    return {
        "overall_score": overall,
        "keyword_score": keyword_score,
        "formatting_score": formatting_score,
        "suggestions": suggestions,
        "missing_skills": missing,
    }
