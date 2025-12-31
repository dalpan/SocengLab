<div align="center">

# Soceng Lab - Adaptive Social Engineering Simulator

### Human beings are the most exploited attack surface.
<p>SocEngLab is a hands‑on, open‑source lab designed to explore that reality.</p>

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Status](https://img.shields.io/badge/Status-✓%20OPERATIONAL-brightgreen)

[Instalation](#-quick-start) • [Fitures](#-features) • [Contributions](#-contributions)

</div>

---
## 🎯 About

**SocEngLab** is an interactive social engineering simulation platform focused on the human layer of security. Instead of exploiting software bugs, this lab models how attackers manipulate trust, authority, urgency, and emotion during real conversations.

Unlike traditional phishing simulators or offensive toolkits, SocEngLab places participants in the role of the target, not the attacker. The goal is not to win, but to experience manipulation, recognize influence, and reflect on failure.

**THIS TOOL IS FOR AUTHORIZED SECURITY TESTING AND TRAINING ONLY**

- ✅ Use only with explicit written consent from all participants
- ✅ All simulations run locally - NO external messages sent
- ✅ Designed for controlled training environments
- ❌ DO NOT use against real targets without authorization
- ❌ Unauthorized use may violate laws (e.g., CFAA, GDPR, local anti-fraud laws)

By using this tool, you agree to use it ethically and legally. The developers assume no liability for misuse.

## ✨ Features

- **AI Challenge Generator**: Dynamic LLM-powered challenges with real-time AI evaluation and chatbot-style interaction
- **Adaptive Challenge Engine**: Node-based branching scenarios with dynamic escalation
- **Quiz Mode**: Multiple-choice assessments with instant feedback
- **Bilingual**: English and Indonesian (i18n ready)
- **Offline-First**: Works without network by default
- **Single User**: Seeded authentication, no registration
- **Scoring Engine**: 0-100 susceptibility score with Cialdini category breakdown
- **Similarity-Based Essay Scoring**: Dynamic evaluation of open-ended answers using Levenshtein distance algorithm


## 🚀 Quick Start

### Docker (Recommended)

```bash
# Clone
git clone https://github.com/dalpan/SocengLab.git
cd SocengLab

# Start
make build
make up
make seed

# Done! 
# Frontend: http://localhost:3000
# Backend: http://localhost:8001
# Login: soceng / Cialdini@2025!
```
### Obtaining an LLM API Key

The **AI Challenge** feature requires an API key from the LLM provider you choose. Example providers and quick steps to obtain an API key:

- Google AI Studio:
  
  ```bash
  1. Open https://aistudio.google.com/api-keys
  2. Sign in with your Google account
  3. Create a new API key and copy its value
  ```
- OpenAI:
  
  ```bash
  1. Open https://platform.openai.com/account/api-keys
  2. Sign in, create a new API key, and copy it
  ```
  
- Anthropic / Gemini / Other providers: follow the provider's documentation to create an API key

After obtaining the API key, add it to the application via `Settings → LLM Configuration`

**Security note:** do not commit API keys to public repositories. Store keys securely and restrict access where possible.

## 📋 Makefile Commands

| Command                             | Description                                      |
| ----------------------------------- | ------------------------------------------------ |
| `make help`                         | Show all available commands                      |
| **Setup & Installation**            |                                                  |
| `make install`                      | Install backend and frontend dependencies        |
| `make build`                        | Build all Docker images                          |
| `make up`                           | Start all services (frontend, backend, database) |
| `make down`                         | Stop all running services                        |
| `make restart`                      | Restart all services                             |
| **Logs & Development**              |                                                  |
| `make logs`                         | Show logs from all services                      |
| `make logs-backend`                 | Show only backend logs                           |
| `make logs-frontend`                | Show only frontend logs                          |
| `make test`                         | Run backend & frontend tests                     |
| **Database Tools**                  |                                                  |
| `make seed`                         | Import sample challenges and quizzes             |
| `make drop`                         | Remove challenges & quizzes from database        |
| `make db-shell`                     | Open MongoDB shell                               |
| **Maintenance**                     |                                                  |
| `make clean`                        | Remove containers and volumes                    |
| `make clean-all`                    | Remove everything including images               |
| **YAML Validation**                 |                                                  |
| `make validate-yaml FILE=path.yaml` | Validate a single YAML file                      |
| `make validate-yaml-all`            | Validate all YAML files in `/data/sample`        |

---

### Manual

<details>
<summary>Expand manual installation</summary>

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# Frontend  
cd frontend
yarn install
yarn start

# Import samples
python bin/import_yaml.py data/sample/
```

</details>

---

## 🤝 Contributions

### Add AI Challenge (Online)

Use the **AI Challenge Generator** interface:
1. Go to **AI Challenge** page
2. Select challenge type: Comprehensive, Email Analysis, Interactive, or Real-World Scenarios
3. Configure:
   - Category (Phishing, Pretexting, Baiting, Tailgating, Vishing, Spear Phishing)
   - Difficulty (Beginner, Intermediate, Advanced)
   - Language (Indonesian, English)
   - Number of Questions (3-20)
4. Click "Generate Challenge"
5. Answer questions in chatbot-style interface with real-time AI evaluation
6. Review detailed results with AI feedback and similarity scores

**Features:**
- Multiple question formats: Multiple Choice, Scenario Analysis, Red Flag Identification, Email Analysis
- AI-powered real-time evaluation and adaptive question sequencing
- Dynamic essay scoring based on semantic similarity (≥70% similarity = correct)
- Instant feedback with learning insights for each answer

### Add Custom Challenges (Offline)

Make file `data/sample/your-challenge.yaml`:

```yaml
type: challenge
title: "Challenge Title"
difficulty: medium
cialdini_categories: [authority, urgency]
nodes:
  - id: start
    type: message
    channel: email_inbox
    content_en:
      subject: "..."
      body: "..."
    next: choice_1
```

[Detail template](templates/challenge_template.yaml)

### Add Quiz

```yaml
type: quiz
title: "Quiz Title"
difficulty: easy
questions:
  - id: q1
    content_en:
      text: "Question?"
    options:
      - text: "Answer A"
        correct: true
```

[Detail template](templates/quiz_template.yaml)

### Submit

```bash
python bin/validate_yaml.py your-file.yaml
# Submit PR to GitHub
```
Readmore for detail [Contribution](/CONTRIBUTING.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Dr. Robert Cialdini for foundational research on influence and persuasion
- The security research community for continuous innovation
- All contributors and testers

<div align="center">

**Made with ❤️ for security awareness**

[⭐ Star](https://github.com/dalpan/SocengLab) • [🐛 Issues](https://github.com/dalpan/SocengLab/issues) • [💡 Features](https://github.com/dalpan/SocengLab/issues)

**Remember**: With great power comes great responsibility. Use this tool ethically and legally. 🛡️
</div>

