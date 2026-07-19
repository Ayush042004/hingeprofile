import { generateObject, type ModelMessage } from "ai";
import { z } from "zod";

import { smartModel } from "../client";
import { extractionSystemPrompt } from "../prompts/extraction";

const AiTraitNumber = z.object({
  value: z.number(),
  confidence: z.number().min(0).max(100),
});

const AiTraitString = z.object({
  value: z.string(),
  confidence: z.number().min(0).max(100),
});

const AiTraitBool = z.object({
  value: z.boolean(),
  confidence: z.number().min(0).max(100),
});

const AiTraitStrArr = z.object({
  value: z.array(z.string()),
  confidence: z.number().min(0).max(100),
});

export const PersonalitySchema = z.object({
  personality: z.object({
    introversion: AiTraitNumber,
    confidence: AiTraitNumber,
    humor: AiTraitString,
    communicationStyle: AiTraitString,
    energyLevel: AiTraitString,
  }),

  lifestyle: z.object({
    fitness: AiTraitBool,
    traveller: AiTraitBool,
    petOwner: AiTraitBool,
    smoker: AiTraitBool,
    drinker: AiTraitBool,
    workLifeBalance: AiTraitString,
  }),

  interests: AiTraitStrArr,
  hobbies: AiTraitStrArr,
  favoriteMovies: AiTraitStrArr,
  favoriteMusic: AiTraitStrArr,
  favoriteFoods: AiTraitStrArr,
  favoriteBooks: AiTraitStrArr,

  travel: z.object({
    likesTravel: AiTraitBool,
    favoriteDestination: AiTraitString,
    travelStyle: AiTraitString,
  }),

  relationship: z.object({
    goal: AiTraitString,
    loveLanguage: AiTraitString,
    lookingFor: AiTraitString,
    dealBreakers: AiTraitStrArr,
  }),

  career: z.object({
    occupation: AiTraitString,
    education: AiTraitString,
    ambition: AiTraitString,
  }),

  promptTraits: z.object({
    funny: z.boolean(),
    romantic: z.boolean(),
    adventurous: z.boolean(),
    intellectual: z.boolean(),
    creative: z.boolean(),
    foodie: z.boolean(),
    geeky: z.boolean(),
  }),
});

export type ExtractedPersonality = z.infer<typeof PersonalitySchema>;

export async function extractPersonality(
  transcript: ModelMessage[]
): Promise<ExtractedPersonality> {
  try {
    const transcriptText = transcript
      .filter(
        (m): m is ModelMessage & { content: string } =>
          typeof m.content === "string"
      )
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const { object } = await generateObject({
      model: smartModel,
      schema: PersonalitySchema,
      system: extractionSystemPrompt,
      prompt: `Extract the candidate's personality profile from the following interview transcript.

Interview Transcript:

${transcriptText}`,
      temperature: 0,
      maxOutputTokens: 8192,
    });

    return object;
  } catch (error) {
    console.error("Personality extraction failed:", error);
    throw new Error("Failed to extract personality.");
  }
}