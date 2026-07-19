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

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { sessionId, message } = body;

    // Validate inputs
    const idError = validateObjectId(sessionId);
    if (idError) {
      return new Response(JSON.stringify({ error: idError }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const msgError = validateMessageInput(message);
    if (msgError) {
      return new Response(JSON.stringify({ error: msgError }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await dbConnect();

    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session || session.user.toString() !== user._id.toString()) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (session.status !== 'active') {
      return new Response(JSON.stringify({ error: 'Session is not active' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
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

    // Score confidence
    const confidence = await scoreConfidence(coreMessages);
    session.confidence = confidence;

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
    console.error('Interview message error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}