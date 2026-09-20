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
  const verifiedTraits: string[] = [];

  if (personality.personality.humor.confidence >= 30 && personality.personality.humor.value) {
    verifiedTraits.push(`- Humor: ${personality.personality.humor.value}`);
  }
  if (personality.personality.energyLevel.confidence >= 30 && personality.personality.energyLevel.value) {
    verifiedTraits.push(`- Energy: ${personality.personality.energyLevel.value}`);
  }
  if (personality.hobbies.confidence >= 30 && personality.hobbies.value.length > 0) {
    verifiedTraits.push(`- Hobbies: ${personality.hobbies.value.join(", ")}`);
  }
  if (personality.interests.confidence >= 30 && personality.interests.value.length > 0) {
    verifiedTraits.push(`- Interests: ${personality.interests.value.join(", ")}`);
  }
  if (personality.career.occupation.confidence >= 30 && personality.career.occupation.value) {
    verifiedTraits.push(`- Occupation: ${personality.career.occupation.value}`);
  }
  if (personality.favoriteFoods.confidence >= 30 && personality.favoriteFoods.value.length > 0) {
    verifiedTraits.push(`- Favorite Foods: ${personality.favoriteFoods.value.join(", ")}`);
  }
  if (personality.relationship.goal.confidence >= 30 && personality.relationship.goal.value) {
    verifiedTraits.push(`- Relationship Goal: ${personality.relationship.goal.value}`);
  }
  if (personality.travel.likesTravel.confidence >= 30 && personality.travel.likesTravel.value) {
    verifiedTraits.push(
      `- Travel: Yes ${personality.travel.travelStyle.value ? `(${personality.travel.travelStyle.value})` : ""}`
    );
  }

  try {
    const { object } = await generateObject({
      model: smartModel,
      schema: BioSchema,
      system: bioSystemPrompt,
      temperature: 0.8,
      maxOutputTokens: 3000,
      prompt: `
Create ONE Hinge bio based strictly on verified candidate evidence.

Verified Candidate Evidence:
${verifiedTraits.length > 0 ? verifiedTraits.join("\n") : "- Persona: Warm, approachable, natural"}

STRICT EVIDENCE RULE:
- Draw ONLY from the verified traits listed above.
- If a topic or hobby is not listed, DO NOT fabricate or invent it.
- Maximum 150 characters.
- Funny and natural.
- No emojis, hashtags, or quotation marks.
- Return only the bio.
`,
    });

    return object.bio;
  } catch (error) {
    console.warn("Bio generation failed, using deterministic fallback bio:", error);
    const hobbies = personality.hobbies?.value || personality.interests?.value || [];
    const primaryHobby = hobbies.length > 0 ? hobbies[0] : "exploring local spots";
    return `mostly using my free time for ${primaryHobby} and debating movie plot twists. drop your favorite spot.`;
  }
}