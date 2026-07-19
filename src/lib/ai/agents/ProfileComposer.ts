import type { ModelMessage } from "ai";

import { extractPersonality } from "./PersonalityExtractor";
import { generateBio } from "./BioGenerator";
import { generatePromptAnswers } from "./AnswerGenerator";
import { advisePhotos } from "./PhotoAdvisor";
import { recommendPrompts } from "./PromptRecommender";

interface PromptOption {
  _id: string;
  prompt: string;
  category: string;
  tags: string[];
  tone: string;
}

export async function composeProfile(
  transcript: ModelMessage[],
  allPrompts: PromptOption[],
  style = "Balanced"
) {
  // Step 1: Extract personality
  const personality = await extractPersonality(transcript);

  // Step 2: Recommend prompts
  const recommendedIds = await recommendPrompts(
    personality,
    allPrompts
  );

  const promptMap = new Map(
    allPrompts.map((p) => [String(p._id), p])
  );

  const selectedPrompts = recommendedIds
    .map((id) => promptMap.get(id))
    .filter((p): p is PromptOption => p !== undefined);

  if (selectedPrompts.length !== 3) {
    throw new Error("Failed to resolve all recommended prompts.");
  }

  // Step 3: Generate remaining assets in parallel
  const [bio, promptAnswers, photoSuggestions] = await Promise.all([
    generateBio(personality),
    generatePromptAnswers(personality, selectedPrompts),
    advisePhotos(personality),
  ]);

  return {
    personality,
    bio,
    promptAnswers,
    photoSuggestions,
    style,
  };
}