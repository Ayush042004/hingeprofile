import { NextResponse } from 'next/server';

/**
 * Creates a sanitized, safe API error response.
 * Server logs contain the full error trace, while client receives ONLY a safe generic message.
 *
 * @param message Safe user-facing error message
 * @param status HTTP Status Code (400, 401, 403, 429, 500, 503)
 * @param details Internal error details (logged server-side only)
 */
export function createErrorResponse(
  message: string,
  status = 500,
  details?: unknown
) {
  if (details) {
    console.error(`[API Error ${status}]: ${message}`, details);
  } else {
    console.error(`[API Error ${status}]: ${message}`);
  }

  return NextResponse.json(
    {
      success: false,
      message,
      error: message, // Backward compatibility for existing store/UI
    },
    { status }
  );
}
