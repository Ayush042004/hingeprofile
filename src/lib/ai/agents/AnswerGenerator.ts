import { generateObject } from "ai";
import { z } from "zod";

import { smartModel } from "../client";
import { promptAnswerSystemPrompt } from "../prompts/generation";
import { ExtractedPersonality } from "./PersonalityExtractor";

const AnswerSchema = z.array(
  z.object({
    promptId: z.string(),
    answer: z.string().max(500),
  })
);

export type PromptAnswer = z.infer<typeof AnswerSchema>[number];

interface PromptOption {
  _id: string;
  prompt: string;
  category: string;
}

export async function generatePromptAnswers(
  personality: ExtractedPersonality,
  selectedPrompts: PromptOption[]
): Promise<(PromptAnswer & Pick<PromptOption, "prompt" | "category">)[]> {
  const { object } = await generateObject({
    model: smartModel,
    schema: AnswerSchema,
    system: promptAnswerSystemPrompt,
    temperature: 0.9,
    maxOutputTokens: 8192,
    prompt: `
Candidate Personality

${JSON.stringify(personality, null, 2)}

Generate ONE answer for each prompt.

Prompts

${JSON.stringify(selectedPrompts, null, 2)}
`,
  });

  const promptMap = new Map(
    selectedPrompts.map((p) => [p._id, p])
  );

  return object.map((item) => {
    const prompt = promptMap.get(item.promptId);

    if (!prompt) {
      throw new Error(`Unknown promptId: ${item.promptId}`);
    }

    return {
      ...item,
      prompt: prompt.prompt,
      category: prompt.category,
    };
  });
}