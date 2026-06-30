// InterviewAgent: pure AI layer — no Next.js, no MongoDB, no Express.
// Receives conversation history + current topic, returns a StreamTextResult.
// The caller (route) is responsible for converting it to a Response.

import { streamText } from "ai";
import { aiModel } from "../client";
import { CoreMessage } from "@ai-sdk/core";

export function InterviewAgent(messages: CoreMessage[], targetTopic: string) {
    const systemPrompt = `
You are a friendly but professional interviewer helping someone craft their ideal dating profile.
Your job is to learn about the user through natural conversation so their personality shines through.

Current interview topic: ${targetTopic}

Rules:
- Ask only ONE question at a time.
- Keep questions short, warm, and conversational — not clinical.
- Do NOT explain or evaluate the user's answers.
- Do NOT ask follow-up questions about a topic they've already answered well.
- Wait for the user to respond before moving on.
- Stay on the current topic unless the user naturally transitions away.
`;

    const result = streamText({
        model: aiModel,
        system: systemPrompt,
        messages,
    });

    // Return the raw StreamTextResult — the route converts it to a Response.
    return result;
}