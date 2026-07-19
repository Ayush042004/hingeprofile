import { generateObject } from "ai";
import { z } from "zod";

import { smartModel } from "../client";
import { photoSystemPrompt } from "../prompts/generation";
import { ExtractedPersonality } from "./PersonalityExtractor";

const PhotoTypeEnum = z.enum([
  "Portrait",
  "Travel",
  "Hobby",
  "Friends",
  "Pet",
  "Food",
  "Sports",
  "Lifestyle",
  "Nature",
  "Other",
]);

const PhotoSuggestionSchema = z
  .array(
    z.object({
      order: z.number().int().min(1).max(6),
      photoType: PhotoTypeEnum,
      title: z.string().max(150),
      description: z.string().max(1000),
      reason: z.string().max(1000),
      caption: z.string().max(200),
      importance: z.number().int().min(1).max(10),
      required: z.boolean(),
    })
  )
  .length(6);

export type PhotoSuggestion = z.infer<typeof PhotoSuggestionSchema>[number];

export async function advisePhotos(
  personality: ExtractedPersonality
): Promise<PhotoSuggestion[]> {
  try {
    const { object } = await generateObject({
      model: smartModel,
      schema: PhotoSuggestionSchema,
      system: photoSystemPrompt,
      temperature: 0.8,
      maxOutputTokens: 8192,
      prompt: `
Candidate Personality

${JSON.stringify(personality, null, 2)}

Generate exactly 6 Hinge photo recommendations.

Requirements:
- Return exactly 6 recommendations.
- Use unique order values from 1 to 6.
- Recommend a variety of photo types.
- Title should be short.
- Description should explain what the photo should look like.
- Reason should explain why it improves the dating profile.
- Caption must be under 80 characters.
- Recommendations should feel realistic and personalized.
`,
    });

    const orders = new Set(object.map((p) => p.order));

    if (orders.size !== 6) {
      throw new Error("Duplicate photo order generated.");
    }

    return object.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Photo recommendation generation failed:", error);
    throw new Error("Failed to generate photo recommendations.");
  }
}