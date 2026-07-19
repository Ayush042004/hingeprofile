/**
 * Parses a Server-Sent Events (SSE) stream from the interview API
 * and yields each text chunk as it arrives.
 */
export async function* parseSSEStream(
  response: Response
): AsyncGenerator<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      // SSE data lines start with "data: "
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        yield data;
      }
      // Vercel AI SDK text stream protocol — plain text lines
      else if (line.startsWith('0:')) {
        try {
          const text = JSON.parse(line.slice(2));
          if (typeof text === 'string') yield text;
        } catch {
          // not JSON, yield raw
          yield line.slice(2);
        }
      }
    }
  }
}

/**
 * Simple helper that concatenates a stream into a full string.
 */
export async function consumeStream(response: Response): Promise<string> {
  let result = '';
  for await (const chunk of parseSSEStream(response)) {
    result += chunk;
  }
  return result;
}