
# Controlled Inference Gateway

Inference layer treating LLMs as untrusted compute with explicit cost/privacy/agency constraints.

## Architecture
```
User → Sanitizer → Budget Gate → LLM API → Validator → User
```

## Guardrails

- **No memory**: Stateless calls only
- **Sanitization**: PII/secrets removed pre-LLM
- **Cost gate**: $2/day hard budget cap
- **Rate limit**: 3 requests/IP/day
- **Output validation**: Strict JSON contracts

## Local Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm start
```

Open `frontend/index.html` in browser.

## Intentional Design

Usage limits are permanent architectural decisions, not temporary restrictions.
```

#### 4.2 `.gitignore`
```
node_modules/
.env
budget.json
.DS_Store
