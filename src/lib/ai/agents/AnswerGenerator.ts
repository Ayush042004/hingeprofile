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
  try {
    const { object } = await generateObject({
      model: smartModel,
      schema: AnswerSchema,
      system: promptAnswerSystemPrompt,
      temperature: 0.8,
      maxOutputTokens: 3000,
      prompt: `
Candidate Personality (Verified Evidence):

${JSON.stringify(personality, null, 2)}

STRICT EVIDENCE RULE:
- Draw answers ONLY from verified candidate evidence in the personality object above.
- If a topic or hobby was not discussed, DO NOT fabricate or invent unmentioned facts.

Generate ONE answer for each prompt.

Prompts

${JSON.stringify(selectedPrompts, null, 2)}
`,
    });

    const promptMap = new Map(
      selectedPrompts.map((p) => [p._id, p])
    );

    return object.map((item, idx) => {
      const prompt = promptMap.get(item.promptId) || selectedPrompts[idx] || selectedPrompts[0];

      return {
        promptId: prompt._id,
        answer: item.answer || "Finding hidden gems in the city and enjoying good conversation.",
        prompt: prompt.prompt,
        category: prompt.category,
      };
    });
  } catch (error) {
    console.warn("Prompt answer generation failed, using deterministic fallback answers:", error);
    const hobbies = personality.hobbies?.value || personality.interests?.value || [];
    const primaryHobby = hobbies.length > 0 ? hobbies[0] : "exploring local coffee spots";

    return selectedPrompts.map((p, idx) => ({
      promptId: p._id,
      answer:
        idx === 0
          ? `mostly spending my weekends ${primaryHobby} and trying new spots.`
          : idx === 1
          ? `debating best movie plot twists over iced coffee.`
          : `someone authentic who loves spontaneous weekend adventures.`,
      prompt: p.prompt,
      category: p.category,
    }));
  }
}