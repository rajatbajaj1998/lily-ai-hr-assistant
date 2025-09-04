# Lily – HR Self-Service Chatbot

Lily is an AI-powered HR assistant that enables employees to quickly get answers to HR-related queries such as leave balance, benefits, payroll information, and company policies all through a conversational web interface.  
It integrates with **n8n** for workflow automation and supports contextual responses via **LLM models**.

---

## 📹 Video Walkthrough
[▶ Watch the Video Walkthrough](https://drive.google.com/file/d/1YT-kIm4WTXdMMt8O79K8covDLIQDFEkN/view?usp=drive_link)

---

## 🛠 Tech Stack
- **Frontend:** React (Figma Make export), TailwindCSS
- **Backend Automation:** n8n workflow automation
- **LLM Provider:** Groq / OpenAI (configurable)
- **Hosting:** Figma Make Web Hosting
- **Integrations:** Custom Webhooks, Calendar overlay, Notifications panel

---

## 📌 Features

### P0 – Core Features
- **Natural Language Chat** – Ask HR questions in plain English.
- **AI-powered Responses** – Answers sourced from HR policy knowledge base via LLM (Groq/OpenAI).
- **UI Integration Triggers** – Identify queries like “show calendar” or “check notifications” and open relevant UI elements instantly.
- **Failover Mode** – Local canned responses if backend/n8n is unavailable.

### P1 – Enhanced Features
- **Popular Questions** – Clickable quick-access buttons for frequent queries.
- **Sidebar Dropdown Summaries** – Instant view of leave balance, payroll info, HR contact, and 24×7 HR helpline.

### P2 – Future Features
- **Conversation History** – View past queries and answers.
- **Team Chart / Hierarchy** – See your reporting structure.
- **Ticket Escalation** – Route complex issues to HR ticketing system.

---

## 🚀 How It Works

1. **User types a question** in the chatbot input.
2. **App sends query** to n8n via a webhook.
3. **n8n workflow processes request**:
   - Passes query to AI model (Groq/OpenAI)
   - Formats and sends back the AI-generated answer
4. **Frontend displays** the response in the chat window.
5. For specific intents (e.g., "open calendar"), Lily triggers UI changes instantly.

---

