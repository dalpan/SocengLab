<div align="center">

<img height="50px" alt="Pretexta" src="https://github.com/user-attachments/assets/fc119f85-9703-4ae6-ba2d-f71460f10c7c" />

### The Psychology Behind Successful Attacks
#### An Open Source Lab for Simulating Human Exploitation via Social Engineering

![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Type](https://img.shields.io/badge/Category-Demo_Lab_|_Research-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

</div>

---

Most security tools are designed to protect systems. **Pretexta is designed to understand why humans fail.
<br>** Modern social engineering attacks do not rely on malware or exploits. They rely on **pretexting, authority, urgency, trust, and cognitive bias**.

Pretexta was created as an **open source simulation lab** to model how thesepsychological attack techniques work in practice — in a controlled, ethical, and defensive environment.
This project focuses on **learning, experimentation, and community research**,
not on generating real-world attacks.

---

### What Pretexta Is

- A **defensive social engineering simulation lab**
- A platform to study **human decision-making under pressure**
- An interactive environment for experimenting with **pretexting techniques**
- A community-driven, **fully open source** research project

All scenarios are **fictional, self-contained, and designed for defense and education only**.

---

### Features

- **Real-Time AI Chat**: Interact with dynamic AI personas (e.g., "The Urgent CEO", "Angry IT Support") powered by **Groq (Llama 3)**, Gemini, or Claude.
- **Adaptive Psychology**: Scenarios are built on Cialdini's 6 Principles of Influence (Reciprocity, Scarcity, Authority, etc.).
- **Interactive AI Lab**: A WhatsApp-style chat interface where you must defend against active pretexting attempts.
- **Win/Loss Detection**: The AI automatically detects if you've been compromised (shared credentials, clicked links) or successfully defended the asset.
- **Mission Logs**: Detailed history of your simulations with scoring and analysis.
- **Quiz Mode**: Assess your theoretical knowledge of social engineering tactics.
- **Bilingual Support**: Full support for English and Indonesian (Bahasa Indonesia).

---

### How a Typical Demo Works

1. A participant enters a simulated social engineering scenario
2. An AI-driven attacker applies psychological pressure in real time
3. The participant makes decisions under realistic constraints
4. The system detects compromise or resistance
5. A post-mission psychological debrief explains *why* the outcome occurred

This flow is intentionally designed to fit a **short, repeatable demo format**
suitable for live Demo Lab environments.

---

### Quick Start (Demo Environment)

#### Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/dalpan/Pretexta.git
cd Pretexta

# Build and Start
make build
make up

# Seed Initial Data
make seed

# Access the Lab
# Frontend: http://localhost:3000
# Backend: http://localhost:8001
# Login: soceng / Cialdini@2025!
```

### LLM Configuration (Required)

To use the AI Chat features, you need an API key. We recommend **Groq** for the best speed/free-tier experience.

1.  **Get a Key**:
    *   **Groq**: [console.groq.com](https://console.groq.com) (Recommended)
    *   **Google Gemini**: [aistudio.google.com](https://aistudio.google.com)
    *   **Anthropic**: [console.anthropic.com](https://console.anthropic.com)
2.  **Configure**:
    *   Go to `Settings` in the Pretexta Dashboard.
    *   Select your provider (e.g., Groq).
    *   Paste your API Key and click **Save**.

---

### Tech Stack

*   **Frontend**: React 18, Tailwind CSS, Lucide Icons, Axios
*   **Backend**: Python FastAPI, LangChain, Motor (MongoDB Async)
*   **AI/LLM**: LangChain integration with Groq (Llama 3), Gemini Pro, Claude Sonnet
*   **Database**: MongoDB

---

### Contributions

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to add new scenarios, quizzes, or features.

#### Adding a New Scenario
You can add new scenarios easily by creating a YAML file in `data/sample/`:

```yaml
type: ai_challenge
title: "The Fake Recruiter"
persona:
  name: "Sarah Jenkins"
  role: "Recruiter at TechCorp"
  goal: "Get user to open malicious resume PDF"
  style: "Professional, Friendly, slightly pushy"
```

Then run `make seed` to import it.

### Open Source & Community

Pretexta is **fully open source** and intended for:

- Security researchers exploring human-layer attack surfaces
- Educators teaching social engineering defense
- Hackers interested in psychological attack modeling
- Contributors who want to extend scenarios or analysis methods

We actively encourage:
- Scenario contributions
- Research experiments
- Critical feedback
- Forks and extensions

---

### Ethics & Scope

Pretexta is designed strictly for **defensive education and research**.

- No real-world targeting
- No phishing infrastructure
- No data harvesting
- No automation for live attacks

All simulations are fictional and isolated from real systems.

---

### License

This project is licensed under the MIT License.

---

**Pretexta**
"*Understanding why social engineering works — before attackers do.*"
