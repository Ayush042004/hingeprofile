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
      shot: z.string().max(250).optional().default(""),
      look: z.string().max(250).optional().default(""),
      setting: z.string().max(250).optional().default(""),
      description: z.string().max(500).optional().default(""),
      reason: z.string().max(500).optional().default(""),
      caption: z.string().max(200).optional().default(""),
      importance: z.number().int().min(1).max(10).optional().default(5),
      required: z.boolean().optional().default(false),
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

Generate exactly 6 Hinge photo recommendations tailored to this candidate.

Requirements:
- Return exactly 6 recommendations.
- Use unique order values from 1 to 6.
- Recommend a variety of photo types.
- Title: short title (2-4 words).
- Shot: 8-15 words describing framing, pose, expression, or camera angle.
- Look: 5-12 words describing outfit, clothes, or appearance.
- Setting: 5-12 words describing environment, location, or background.
- Caption: magnetic photo caption text under 80 characters.
- Recommendations should feel highly realistic and personalized.
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