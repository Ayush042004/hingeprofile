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

const PhotoSuggestionItemSchema = z.object({
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
});

const PhotoSuggestionSchema = z.array(PhotoSuggestionItemSchema).length(6);

const PhotoResponseSchema = z.object({
  photos: PhotoSuggestionSchema,
});

export type PhotoSuggestion = z.infer<typeof PhotoSuggestionItemSchema>;

/**
 * Sanitizes generated text fields to remove any leaked internal monologue/reasoning notes
 * and enforce maximum length limits.
 */
function cleanFieldText(text: string | undefined, maxLen: number): string {
  if (!text) return "";

  let cleaned = text
    .replace(/^P[1-6]:\s*/gi, "")
    .replace(/\b(?:P[1-6]|A bit long|Let's adjust|Let me check|Still \d+|Too long|Rewrite|Check|OK)\b.*$/gi, "")
    .replace(/^\s*(?:P[1-6]|Let's adjust|Let me check|Still \d+)\b/gi, "")
    .trim();

  if (cleaned.length > maxLen) {
    cleaned = cleaned.slice(0, maxLen).trim();
    cleaned = cleaned.replace(/[,;:\-\s]+$/, "");
  }

  return cleaned;
}

/**
 * Returns a complete set of 6 default photo recommendations tailored to personality
 * to ensure robust operation if the AI model fails or returns incomplete items.
 */
function getFallbackPhotos(personality: ExtractedPersonality): PhotoSuggestion[] {
  const hobbies = personality.hobbies?.value || personality.interests?.value || [];
  const primaryHobby = hobbies.length > 0 ? hobbies[0] : "a favorite passion";

  return [
    {
      order: 1,
      photoType: "Portrait",
      title: "The Opener",
      shot: "Chest-up portrait in warm daylight with direct eye contact and a natural smile.",
      look: "Smart casual button-up shirt or well-fitted knit sweater.",
      setting: "Clean minimalist wall or bright indoor window setting.",
      description: "",
      reason: "",
      caption: "Hi, nice to meet you.",
      importance: 10,
      required: true,
    },
    {
      order: 2,
      photoType: "Lifestyle",
      title: "Daily Vibe",
      shot: "Relaxed mid-shot sitting at a café table in natural conversation.",
      look: "Casual jacket, denim, and a clean t-shirt.",
      setting: "Independent coffee shop or local neighborhood spot.",
      description: "",
      reason: "",
      caption: "Always down for good coffee and great conversation.",
      importance: 8,
      required: false,
    },
    {
      order: 3,
      photoType: "Friends",
      title: "Social Proof",
      shot: "Laughing with friends with candidate clearly positioned in focus.",
      look: "Stylish evening out outfit or casual jacket.",
      setting: "Outdoor patio or lively weekend gathering.",
      description: "",
      reason: "",
      caption: "The best crew.",
      importance: 7,
      required: false,
    },
    {
      order: 4,
      photoType: "Hobby",
      title: "In Your Element",
      shot: `Authentic action photo enjoying ${primaryHobby}.`,
      look: "Comfortable activity-appropriate apparel.",
      setting: "Outdoor park, studio, or active environment.",
      description: "",
      reason: "",
      caption: `Where you will find me enjoying ${primaryHobby}.`,
      importance: 8,
      required: false,
    },
    {
      order: 5,
      photoType: "Travel",
      title: "The Explorer",
      shot: "Environmental portrait looking out at a scenic view.",
      look: "Layered outdoor clothing or travel attire.",
      setting: "Scenic mountain overlook, coastline, or city view.",
      description: "",
      reason: "",
      caption: "Next trip is already being planned.",
      importance: 7,
      required: false,
    },
    {
      order: 6,
      photoType: "Other",
      title: "Unfiltered Personality",
      shot: "Playful candid moment laughing naturally off-camera.",
      look: "Cozy everyday sweater or casual hoodie.",
      setting: "Relaxed indoor lounge or park bench.",
      description: "",
      reason: "",
      caption: "Caught mid-laugh.",
      importance: 6,
      required: false,
    },
  ];
}

async function fetchPhotosFromModel(
  personality: ExtractedPersonality,
  isRetry = false
) {
  const retryInstruction = isRetry
    ? `\nCRITICAL RETRY INSTRUCTION: Your previous output failed schema validation because a field exceeded character limits or array length was not 6. Keep every field extremely compact (shot MUST be under 150 characters, hard maximum 250) and return EXACTLY 6 photos.`
    : ``;

  return generateObject({
    model: smartModel,
    schema: PhotoResponseSchema,
    system: photoSystemPrompt,
    temperature: 0.5,
    maxOutputTokens: 4000,
    prompt: `
Candidate Personality

${JSON.stringify(personality, null, 2)}
${retryInstruction}

Generate exactly 6 Hinge photo recommendations tailored to this candidate.

Requirements:
- Return a JSON object with a "photos" array containing EXACTLY 6 photo recommendations (order 1 to 6).
- Order 1: Portrait (Trust, direct eye contact, natural daylight).
- Order 2: Lifestyle (Café, bookstore, or rooftop vibe).
- Order 3: Friends (Social proof group photo, max 4 people).
- Order 4: Hobby (Authentic passion or activity).
- Order 5: Travel (Adventure or scenic background).
- Order 6: Other/Personality (Candid, funny, or playful moment).
- STRICT RULE: Do NOT list photography jargon or repeat buzzwords (like framing, composition, visual, layout, style, perspective).
- Title: 2-4 words (under 50 characters).
- Shot: Maximum 15 words (under 100 characters). Example: "Chest-up portrait with a warm, relaxed smile in natural daylight."
- Look: Maximum 10 words (under 100 characters). Example: "Casual denim jacket over a plain white t-shirt."
- Setting: Maximum 10 words (under 100 characters). Example: "Cozy coffee shop window."
- Caption: Short photo caption (under 60 characters).
`,
  });
}

export async function advisePhotos(
  personality: ExtractedPersonality
): Promise<PhotoSuggestion[]> {
  let objectResult: { photos: PhotoSuggestion[] } | null = null;

  try {
    const { object } = await fetchPhotosFromModel(personality, false);
    objectResult = object;
  } catch (firstError: unknown) {
    const errStr = String((firstError as { message?: string })?.message || firstError || "");
    const isQuotaOrAuthErr =
      errStr.includes("429") ||
      errStr.includes("RESOURCE_EXHAUSTED") ||
      errStr.includes("Quota exceeded") ||
      errStr.includes("Unauthorized") ||
      errStr.includes("API key");

    if (isQuotaOrAuthErr) {
      console.warn("Photo recommendation generation failed due to quota/auth error, using fallback set.");
      return getFallbackPhotos(personality);
    }

    console.warn(
      "Photo recommendation generation attempt 1 failed schema validation, retrying once with stricter instructions...",
      firstError
    );

    try {
      const { object } = await fetchPhotosFromModel(personality, true);
      objectResult = object;
    } catch (retryError) {
      console.warn("Photo recommendation generation attempt 2 failed schema validation, using fallback set:", retryError);
      return getFallbackPhotos(personality);
    }
  }

  const rawPhotos = objectResult?.photos || [];
  const cleanedMap = new Map<number, PhotoSuggestion>();

  for (const rawItem of rawPhotos) {
    const order = Math.round(rawItem.order);
    if (order >= 1 && order <= 6 && !cleanedMap.has(order)) {
      cleanedMap.set(order, {
        order,
        photoType: rawItem.photoType,
        title: cleanFieldText(rawItem.title, 150) || `Photo ${order}`,
        shot: cleanFieldText(rawItem.shot, 250),
        look: cleanFieldText(rawItem.look, 250),
        setting: cleanFieldText(rawItem.setting, 250),
        description: cleanFieldText(rawItem.description, 500),
        reason: cleanFieldText(rawItem.reason, 500),
        caption: cleanFieldText(rawItem.caption, 200),
        importance: rawItem.importance ?? 5,
        required: rawItem.required ?? (order === 1),
      });
    }
  }

  // Complete missing orders (1 through 6) if the model omitted any
  const fallbacks = getFallbackPhotos(personality);
  for (let order = 1; order <= 6; order++) {
    if (!cleanedMap.has(order)) {
      const fb = fallbacks.find((f) => f.order === order) || fallbacks[order - 1];
      cleanedMap.set(order, fb);
    }
  }

  return Array.from(cleanedMap.values()).sort((a, b) => a.order - b.order);
}