import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import type { ModelMessage } from 'ai';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import InterviewSession from '@/lib/db/models/InterviewSession';
import { conductInterview } from '@/lib/ai/agents/InterviewAgent';
import { scoreConfidence } from '@/lib/ai/confidence';
import { pickNextQuestionTopic } from '@/lib/ai/questionEngine';
import { validateMessageInput, validateObjectId } from '@/lib/utils/validators';
import { checkRateLimit } from '@/lib/utils/rateLimiter';
import { createErrorResponse } from '@/lib/utils/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { sessionId, message } = body;

    // Validate inputs
    const idError = validateObjectId(sessionId);
    if (idError) {
      return createErrorResponse(idError, 400);
    }

    const msgError = validateMessageInput(message);
    if (msgError) {
      return createErrorResponse(msgError, 400);
    }

    await dbConnect();

    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    // Rate Limiting: max 10 message requests per minute per user
    const rateLimit = await checkRateLimit(`rate_msg_${user._id}`, 10, 60);
    if (!rateLimit.allowed) {
      return createErrorResponse(
        'Too many requests. Please try again shortly.',
        429
      );
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session || session.user.toString() !== user._id.toString()) {
      return createErrorResponse('Session not found', 404);
    }

    if (session.status !== 'active') {
      return createErrorResponse('Session is not active', 400);
    }

    // Append user message
    session.messages.push({
      role: 'user' as const,
      content: message.trim(),
      createdAt: new Date(),
    });

    // Build CoreMessage array for AI
    const coreMessages: ModelMessage[] = session.messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })
    );

    // Calculate user message count
    const userMessageCount = session.messages.filter(
      (m: { role: string }) => m.role === 'user'
    ).length;

    // Only run confidence scoring approximately every 4 user messages (e.g., messages 4, 8, 12, 16...)
    const shouldScoreConfidence =
      userMessageCount > 0 && userMessageCount % 4 === 0;

    let confidence = session.confidence;
    if (shouldScoreConfidence) {
      const scoredConfidence = await scoreConfidence(
        coreMessages,
        session.confidence
      );
      if (scoredConfidence !== null) {
        confidence = scoredConfidence;
        session.confidence = confidence;
      }
    }

    // Pick next topic
    const nextTopic = pickNextQuestionTopic(confidence);
    const isComplete = nextTopic === null;

    session.completedQuestions += 1;
    if (nextTopic) session.currentTopic = nextTopic;

    await session.save();

    // Stream AI response
    const result = await conductInterview({
      messages: coreMessages,
      nextTopic,
    });

    // Create a transform stream that captures the full response
    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const textStream = result.textStream;
          for await (const chunk of textStream) {
            fullResponse += chunk;
            // Send chunk in Vercel AI SDK format
            controller.enqueue(
              encoder.encode(`0:${JSON.stringify(chunk)}\n`)
            );
          }

          // Save assistant message if not empty
          if (fullResponse.trim()) {
            session.messages.push({
              role: 'assistant' as const,
              content: fullResponse,
              createdAt: new Date(),
            });
            await session.save();
          }

          // Send metadata at the end
          const metadata = {
            topic: nextTopic || session.currentTopic,
            progress: {
              completedQuestions: session.completedQuestions,
              totalQuestions: session.totalQuestions,
              currentTopic: nextTopic || session.currentTopic,
              confidence,
              isComplete,
            },
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(metadata)}\n`)
          );

          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return createErrorResponse('Something went wrong. Please try again.', 500, error);
  }
}