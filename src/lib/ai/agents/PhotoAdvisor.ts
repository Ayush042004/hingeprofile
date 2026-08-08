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
      description: z.string().max(300),
      reason: z.string().max(500).optional().default(""),
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
- Title should be short (2-4 words).
- Description MUST be a quick, concise 1-2 sentence idea (max 25 words) of how the photo should look (e.g. outfit, pose, background). Keep it short and actionable.
- Reason: keep minimal or empty.
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