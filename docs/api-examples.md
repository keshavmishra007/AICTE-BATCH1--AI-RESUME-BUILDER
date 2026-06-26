# API Examples

Register:

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Aarav Sharma\",\"email\":\"aarav@example.com\",\"password\":\"password123\"}"
```

Generate resume:

```bash
curl -X POST http://localhost:5000/resume/generate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"targetRole\":\"Full Stack Developer\",\"template\":\"modern\"}"
```

Analyze resume:

```bash
curl -X POST http://localhost:5000/ats/analyze \
  -H "Authorization: Bearer TOKEN" \
  -F "resume=@resume.pdf"
```
