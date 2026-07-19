const MIN_LENGTH = 1;
const MAX_LENGTH = 2000;

/**
 * Validates a chat message from the user.
 * Returns an error string or `null` if valid.
 */
export function validateMessageInput(content: unknown): string | null {
  if (typeof content !== 'string') {
    return 'Message must be a string.';
  }

  const trimmed = content.trim();

  if (trimmed.length < MIN_LENGTH) {
    return 'Message cannot be empty.';
  }

  if (trimmed.length > MAX_LENGTH) {
    return `Message is too long (max ${MAX_LENGTH} characters).`;
  }

  return null;
}

/**
 * Validates a MongoDB ObjectId string.
 */
export function validateObjectId(id: unknown): string | null {
  if (typeof id !== 'string') return 'ID must be a string.';
  if (!/^[a-f\d]{24}$/i.test(id)) return 'Invalid ID format.';
  return null;
}