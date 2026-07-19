import { generateObject } from "ai";
import { z } from "zod";

import { smartModel } from "../client";
import { bioSystemPrompt } from "../prompts/generation";
import { ExtractedPersonality } from "./PersonalityExtractor";

const BioSchema = z.object({
  bio: z
    .string()
    .max(300)
    .describe("A witty Hinge bio under 150 characters."),
});

export async function generateBio(
  personality: ExtractedPersonality
): Promise<string> {
  const { object } = await generateObject({
    model: smartModel,
    schema: BioSchema,
    system: bioSystemPrompt,
    temperature: 0.8,
    prompt: `
Create ONE Hinge bio.

Personality:
- Humor: ${personality.personality.humor.value}
- Energy: ${personality.personality.energyLevel.value}
- Hobbies: ${personality.hobbies.value.join(", ")}
- Interests: ${personality.interests.value.join(", ")}
- Occupation: ${personality.career.occupation.value}
- Favorite Foods: ${personality.favoriteFoods.value.join(", ")}
- Relationship Goal: ${personality.relationship.goal.value}
- Travel: ${
      personality.travel.likesTravel.value
        ? `Yes (${personality.travel.travelStyle.value})`
        : "No"
    }

Requirements:
- Maximum 150 characters.
- Funny and natural.
- No emojis.
- No hashtags.
- No quotation marks.
- Return only the bio.
`,
  });

  return object.bio;
}