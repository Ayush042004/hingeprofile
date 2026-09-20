import { generateObject } from "ai";
import { z } from "zod";

import { smartModel } from "../client";
import { promptRecommendSystemPrompt } from "../prompts/generation";
import { ExtractedPersonality } from "./PersonalityExtractor";

interface PromptOption {
  _id: string;
  prompt: string;
  category: string;
  tags: string[];
  tone: string;
}

const RecommendationSchema = z.object({
  promptIds: z.array(z.string()).length(3),
});

export async function recommendPrompts(
  personality: ExtractedPersonality,
  allPrompts: PromptOption[]
): Promise<string[]> {
  try {
    const { object } = await generateObject({
      model: smartModel,
      schema: RecommendationSchema,
      system: promptRecommendSystemPrompt,
      temperature: 0.4,
      maxOutputTokens: 4000,
      prompt: `
Candidate Personality

${JSON.stringify(personality, null, 2)}

Available Hinge Prompts

${JSON.stringify(allPrompts, null, 2)}

Task:
- Recommend exactly THREE prompts.
- Choose prompts that best match the candidate's personality.
- Consider hobbies, interests, humor, relationship goals, lifestyle, and communication style.
- Return ONLY the prompt IDs.
`,
    });

    const validIds = new Set(allPrompts.map((p) => p._id));

    const uniqueIds = [...new Set(object.promptIds)];

    if (uniqueIds.length === 3 && uniqueIds.every((id) => validIds.has(id))) {
      return uniqueIds;
    }

    console.warn("Prompt recommendation returned invalid/duplicate IDs, using deterministic fallback selection.");
    return getFallbackPromptIds(allPrompts);
  } catch (error) {
    console.warn("Prompt recommendation failed, using deterministic fallback selection:", error);
    return getFallbackPromptIds(allPrompts);
  }
}

function getFallbackPromptIds(allPrompts: PromptOption[]): string[] {
  if (allPrompts.length >= 3) {
    return allPrompts.slice(0, 3).map((p) => p._id);
  }
  return allPrompts.map((p) => p._id);
}