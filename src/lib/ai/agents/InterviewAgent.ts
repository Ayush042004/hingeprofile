import {
  streamText,
  generateObject,
  type ModelMessage,
} from "ai";
import { z } from "zod";

import { chatModel } from "../client";
import { interviewSystemPrompt } from "../prompts/interview";

const OpeningQuestionSchema = z.object({
  message: z.string().describe("Greeting + first interview question"),
  topic: z.string().describe("Topic of the first question"),
});

interface ConductInterviewParams {
  messages: ModelMessage[];
  nextTopic: string | null;
}

export async function conductInterview({
  messages,
  nextTopic,
}: ConductInterviewParams) {
  const systemInstruction = `${interviewSystemPrompt}

${
  nextTopic
    ? `Current interview state:
- Ask ONLY about this topic: ${JSON.stringify(nextTopic)}
- Ask exactly ONE question.
- Wait for the candidate's answer before asking another question.`
    : `Current interview state:
- All interview topics are complete.
- Do NOT ask another question.
- Thank the candidate.
- End the interview politely.
- Tell them feedback will be generated next.`
}`;

  try {
    return streamText({
      model: chatModel,
      system: systemInstruction,
      messages: messages,
      temperature: 0.4,
      maxOutputTokens: 1000,
    });
  } catch (error) {
    console.error("Interview generation failed:", error);
    throw new Error("Failed to generate interview response.");
  }
}

// Non-streaming version for the opening question
export async function getOpeningQuestion() {
  const result = await generateObject({
    model: chatModel,
    schema: OpeningQuestionSchema,
    system: interviewSystemPrompt,
    prompt: `Start the interview.

- Greet the candidate warmly.
- Ask exactly ONE opening question.
- The question should be about personality, communication, or humor.
- Do not ask follow-up questions.`,
    temperature: 0.4,
    maxOutputTokens: 1000,
  });

  return result.object;
}