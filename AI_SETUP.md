# AI_SETUP.md

## AI Career & Skills Advisor – AI Setup Guide

This document provides instructions for setting up and integrating AI features in the AI Career & Skills Advisor web application.

---

## 1. Overview

This project is designed to provide intelligent career guidance, skills assessment, and personalized recommendations using AI. The AI logic is modular and can be extended to use various providers (OpenAI, Azure, custom models, etc.).

---

## 2. AI Integration Points

- **Chatbot:** The main chat interface uses AI to generate career advice and answer user queries.
- **Skills Assessment:** AI can be used to analyze user responses and suggest skill improvements.
- **Personalized Reports:** AI generates tailored recommendations and learning paths.

---

## 3. AI Provider Configuration

### File: `src/lib/ai-providers.ts`

- This file contains logic for integrating with different AI providers.
- To add a new provider, implement a function that accepts a prompt and returns a response.
- Example (OpenAI):

```ts
export async function openaiChat(prompt: string): Promise<string> {
  // Call OpenAI API here
}
```

### File: `src/lib/career-advisor.ts`

- Contains core logic for career advice and skill analysis.
- Uses the provider functions to generate responses.

---

## 4. Environment Variables

- Store API keys and secrets in a `.env.local` file (not committed to version control).
- Example:

```
OPENAI_API_KEY=your-openai-key-here
```

- Access these variables in your provider functions using `process.env`.

---

## 5. Extending AI Capabilities

- To add new AI features, create new functions in `ai-providers.ts` and call them from the relevant components or API routes.
- For advanced use cases, consider using vector databases, embeddings, or custom ML models.

---

## 6. Testing AI Features

- Use the `/api/chat` endpoint to test chat-based AI responses.
- Mock responses can be used for local development if API keys are not available.

---

## 7. Troubleshooting

- Ensure all required environment variables are set.
- Check API usage limits and error logs for failed requests.
- Review provider documentation for integration details.

---

## 8. References

- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers)
- [Environment Variables in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

For further assistance, refer to the project README or contact the project maintainer.
