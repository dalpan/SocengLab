# LLM Prompt Templates for Soceng Lab

This document contains all LLM prompts used in Soceng Lab for pretext generation and adaptive scenario content.

## System Prompts

### Base System Prompt
```
You are a social engineering pretext generator for authorized security awareness training. 
Your role is to create realistic, ethically-sound pretexts that help train people to recognize 
and resist social engineering attacks.

CRITICAL RULES:
1. All outputs are for training purposes only
2. Mark all generated content as "[TRAINING MATERIAL]"
3. Never generate actual malicious payloads
4. Focus on education, not exploitation
5. Content will be reviewed before use

Your outputs will be sanitized to remove real PII (emails, phones, SSNs).
```

## Pretext Generation Prompts

### Email Pretext (Authority)
```
Generate a realistic phishing email that demonstrates the "Authority" principle of influence.

Context:
- Target: {target_description}
- Industry: {industry}
- Attack vector: {vector}
- Cialdini principle: Authority

Requirements:
1. Use authority figure impersonation (CEO, IT admin, etc.)
2. Include realistic business context
3. Add subtle red flags for training
4. Provide 2-3 variants (low/medium/high sophistication)
5. Mark clearly as "[TRAINING MATERIAL]"

Output format:
{
  "subject": "...",
  "from": "...",
  "body": "...",
  "red_flags": ["flag1", "flag2"],
  "sophistication": "medium"
}
```

### Phone Pretext (Scarcity + Urgency)
```
Generate a phone conversation script demonstrating scarcity and urgency tactics.

Context:
- Scenario: {scenario}
- Target role: {role}
- Objective: {objective}

Requirements:
1. Create opener, middle, and close
2. Include time pressure language
3. Use scarcity framing ("limited time", "only for you")
4. Provide trainer notes on manipulation tactics
5. Include appropriate responses

Output as structured conversation with annotations.
```

### Chat/SMS Pretext (Liking + Social Proof)
```
Generate a chat-based social engineering attempt using liking and social proof.

Context:
- Platform: {platform}
- Relationship: {relationship}
- Goal: {goal}

Requirements:
1. Build rapport naturally
2. Reference mutual connections (social proof)
3. Use friendly, conversational tone
4. Include subtle manipulation indicators
5. Provide escalation path

Output as message sequence with timing.
```

## Adaptive Content Prompts

### Next Node Generation
```
Given the participant's response in a social engineering scenario, generate the next node.

Current state:
- Scenario: {scenario_title}
- Current node: {node_id}
- Participant action: {action}
- Cialdini triggers active: {triggers}
- Compliance history: {history}

Requirements:
1. Maintain narrative consistency
2. Escalate appropriately based on compliance
3. Add new Cialdini principle if applicable
4. Include scoring rationale
5. Provide 2-3 branch options

Output format:
{
  "node_id": "...",
  "type": "message|question|end",
  "content": {...},
  "next_options": [...],
  "score_impact": {...}
}
```

### Personalization Prompt
```
Personalize this generic scenario to target profile.

Generic scenario: {scenario}
Target profile:
- Role: {role}
- Industry: {industry}
- Experience level: {level}
- Known interests: {interests}

Requirements:
1. Adapt language to industry jargon
2. Reference realistic tools/systems
3. Adjust sophistication to experience level
4. Maintain core learning objectives
5. Keep red flags identifiable

Output personalized scenario maintaining original structure.
```

## Safety & Sanitization Prompts

### PII Detection Prompt
```
Analyze this generated content for personal identifiable information (PII).

Content: {content}

Identify and flag:
1. Real email addresses
2. Phone numbers
3. SSNs or government IDs
4. Physical addresses
5. Credit card numbers
6. Real company names (if sensitive)

Suggest replacements that maintain realism without real PII.
```

### Harmful Content Detection
```
Review this training content for potential harm.

Content: {content}

Check for:
1. Actual exploits or malware
2. Real credentials
3. Instructions for illegal activity
4. Harassment or discrimination
5. Excessive psychological pressure

Flag any issues with severity rating and suggested modifications.
```

## Report Generation Prompts

### Debrief Summary
```
Generate a training debrief summary for this simulation.

Simulation data:
- Participant: {name}
- Scenario: {scenario}
- Decisions: {decisions}
- Score: {score}
- Cialdini triggers: {triggers}

Requirements:
1. Summarize attack progression
2. Identify key decision points
3. Explain manipulation techniques used
4. Provide actionable recommendations
5. Maintain supportive, educational tone

Output as structured debrief document.
```

### Organizational Report
```
Generate aggregate report for organization security training.

Data:
- Participants: {count}
- Scenarios: {scenarios}
- Average scores: {scores}
- Common vulnerabilities: {vulnerabilities}

Requirements:
1. Executive summary (non-technical)
2. Key findings with statistics
3. Risk areas by Cialdini category
4. Training recommendations
5. Comparison to industry benchmarks (if available)

Output as professional report suitable for leadership.
```

## Prompt Engineering Best Practices

### Temperature Settings
- **Factual content**: 0.3-0.5 (low randomness)
- **Creative pretexts**: 0.7-0.9 (more variation)
- **Safety checks**: 0.1-0.3 (deterministic)

### Token Limits
- Short prompts: 500-1000 tokens
- Scenario generation: 1500-2500 tokens
- Reports: 2000-4000 tokens

### Model Selection
- **OpenAI GPT-4o**: General purpose, good balance
- **GPT-5.1**: More sophisticated, better context
- **Gemini 2.5 Flash**: Fast, cost-effective
- **Claude Sonnet 4**: Excellent safety, nuanced

## Example Conversations

### Example 1: Authority Email Generation

**User Prompt**:
```
Generate a CEO fraud email targeting finance department. 
Medium sophistication. Industry: Healthcare.
```

**LLM Response**:
```json
{
  "subject": "Urgent: Vendor Payment Authorization Required",
  "from": "John.Smith@healthcorp-cfo.com",
  "body": "Hi [Name],\n\nI'm traveling for the board meeting and need you to process an urgent vendor payment before EOD. Details attached. Please confirm receipt.\n\nThanks,\nJohn Smith\nCFO",
  "red_flags": [
    "Domain typo: healthcorp-cfo.com vs healthcorp.com",
    "Urgency without proper channels",
    "Vague 'vendor' reference",
    "Unusual request while 'traveling'"
  ],
  "sophistication": "medium",
  "cialdini_principles": ["authority", "scarcity"],
  "training_notes": "CEO fraud relies on authority + urgency. Verify via known channels."
}
```

## Prompt Versioning

All prompts are version-controlled and tagged:

- **v1.0**: Initial release (Jan 2025)
- **v1.1**: Added sanitization layer
- **v1.2**: Improved personalization

Track changes in `docs/prompt_changelog.md`.

## Contributing New Prompts

When adding prompts:
1. Test with multiple models
2. Verify safety constraints
3. Document expected outputs
4. Include examples
5. Submit PR with prompt template

---

**Maintained by**: Soceng Lab Team  
**Last Updated**: January 2025  
**Next Review**: Quarterly
