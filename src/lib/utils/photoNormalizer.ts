export interface NormalizedPhotoInfo {
  shot?: string;
  look?: string;
  setting?: string;
}

export interface RawPhotoSuggestion {
  title?: string;
  photoType?: string;
  description?: string;
  reason?: string;
  shot?: string;
  look?: string;
  setting?: string;
  caption?: string;
  required?: boolean;
}

/**
 * Removes dangling conjunctions or prepositions at the end of a truncated sentence.
 */
function cleanDanglingEnds(text: string): string {
  let cleaned = text.trim();

  // Remove trailing dangling words (case-insensitive)
  const danglingRegex = /\s+(?:like|with|or|and|that|to|a|an|the|near|in|your|my|of|for|as|is|are|complements|complements\s+your)$/i;
  while (danglingRegex.test(cleaned)) {
    cleaned = cleaned.replace(danglingRegex, '').trim();
  }

  // Remove trailing punctuation
  cleaned = cleaned.replace(/[,;:\-\s]+$/, '');
  if (cleaned && !cleaned.endsWith('.') && !cleaned.endsWith('!') && !cleaned.endsWith('?')) {
    cleaned += '.';
  }
  return cleaned;
}

/**
 * Truncates text to maxWords cleanly without cut-off fragments.
 */
function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return cleanDanglingEnds(text);
  }
  const truncated = words.slice(0, maxWords).join(' ');
  return cleanDanglingEnds(truncated);
}

/**
 * Clean up text by removing verbose AI introductory filler.
 */
function cleanSentence(str: string): string {
  let cleaned = str
    .replace(/^you(?:'re| are)\s+(?:centered in a\s+|captured in a\s+|wearing a\s+|looking\s+)?/i, '')
    .replace(/^perhaps near\s+/i, '')
    .replace(/^ensuring all focus is on you\.?/i, '')
    .replace(/^making sure the focus is on you\.?/i, '')
    .replace(/^a\s+['"]?Duchenne smile['"]?\s*/i, 'a natural smile ')
    .trim();

  if (!cleaned) return '';
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return cleaned;
}

/**
 * Normalizes photo suggestion details.
 * If shot, look, or setting are provided in input, uses them.
 * Otherwise, intelligently parses paragraph description into concise rows.
 */
export function normalizePhotoSuggestion(photo: RawPhotoSuggestion): NormalizedPhotoInfo {
  const shot = photo.shot?.trim();
  const look = photo.look?.trim();
  const setting = photo.setting?.trim();

  // If all structured fields exist, clean & bound them
  if (shot && look && setting) {
    return {
      shot: truncateWords(cleanSentence(shot), 15),
      look: truncateWords(cleanSentence(look), 12),
      setting: truncateWords(cleanSentence(setting), 12),
    };
  }

  const desc = photo.description?.trim() || '';
  if (!desc) {
    return {
      shot: shot ? truncateWords(cleanSentence(shot), 15) : undefined,
      look: look ? truncateWords(cleanSentence(look), 12) : undefined,
      setting: setting ? truncateWords(cleanSentence(setting), 12) : undefined,
    };
  }

  // Split description by sentence boundary or semicolons/commas
  const units = desc
    .split(/(?<=[.!?])\s+|;\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  let extractedShot = shot;
  let extractedLook = look;
  let extractedSetting = setting;

  const shotKeywords = /\b(shot|portrait|chest-up|waist-up|headshot|candid|close-up|camera|pose|smile|eye contact|looking|centered)\b/i;
  const lookKeywords = /\b(wearing|shirt|outfit|attire|knit|jacket|suit|top|clothes|dress|apparel|sweater|hoodie|t-shirt|style|wear)\b/i;
  const settingKeywords = /\b(background|setting|outdoors|indoors|window|wall|café|cafe|park|street|interior|daylight|rooftop|beach|nature|city|brick)\b/i;

  const remaining: string[] = [];

  for (const unit of units) {
    if (!extractedShot && shotKeywords.test(unit)) {
      extractedShot = unit;
    } else if (!extractedLook && lookKeywords.test(unit)) {
      extractedLook = unit;
    } else if (!extractedSetting && settingKeywords.test(unit)) {
      extractedSetting = unit;
    } else {
      remaining.push(unit);
    }
  }

  // Second pass: assign remaining unassigned units if still missing fields
  if (!extractedShot && remaining.length > 0) {
    extractedShot = remaining.shift();
  }
  if (!extractedLook && remaining.length > 0 && lookKeywords.test(remaining[0])) {
    extractedLook = remaining.shift();
  }
  if (!extractedSetting && remaining.length > 0) {
    extractedSetting = remaining.shift();
  }

  // Fallback: if shot is still empty, use first sentence or full description
  if (!extractedShot) {
    extractedShot = units[0] || desc;
  }

  const finalShot = extractedShot ? truncateWords(cleanSentence(extractedShot), 15) : undefined;
  const finalLook = extractedLook ? truncateWords(cleanSentence(extractedLook), 12) : undefined;
  const finalSetting = extractedSetting ? truncateWords(cleanSentence(extractedSetting), 12) : undefined;

  return {
    shot: finalShot || undefined,
    look: finalLook || undefined,
    setting: finalSetting || undefined,
  };
}
