import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import dbConnect from '@/lib/db/connect';
import InterviewSessionModel from '@/lib/db/models/InterviewSession';
import { InterviewAgent } from '@/lib/ai/agents/InterviewAgent';
import { CoreMessage } from 'ai';

export async function POST(req: Request) {
  const authResult = await requireAuth();
  const { userId } = authResult;

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { sessionId, content } = body;

    if (!sessionId || !content) {
      return NextResponse.json(
        { success: false, error: 'Session ID and message content are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Verify session exists and belongs to the authenticated user
    const session = await InterviewSessionModel.findOne({ _id: sessionId, user: userId });
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    if (session.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'This interview session is no longer active' },
        { status: 400 }
      );
    }

    // 2. Save the user message immediately
    session.messages.push({
      role: 'user',
      content,
      createdAt: new Date(),
    });
    await session.save();

    // 3. Build the message history for the AI (CoreMessage format)
    const coreMessages: CoreMessage[] = session.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 4. Call the InterviewAgent — returns a StreamTextResult (not a Response)
    const targetTopic = session.currentTopic ?? 'introduction';
    const result = InterviewAgent(coreMessages, targetTopic);

    // 5. Stream the response back to the client.
    //    onFinish fires only after streaming completes successfully — ideal for DB writes.
    return result.toUIMessageStreamResponse({
      onFinish: async ({ text }) => {
        try {
          // Save the assistant reply and increment completedQuestions only after
          // the AI successfully finishes. This prevents count drift on failures.
          await InterviewSessionModel.updateOne(
            { _id: sessionId },
            {
              $push: {
                messages: {
                  role: 'assistant',
                  content: text,
                  createdAt: new Date(),
                },
              },
              $inc: { completedQuestions: 1 },
            }
          );
        } catch (err) {
          console.error('Failed to save assistant message after stream:', err);
        }
      },
    });
  } catch (error) {
    console.error('Error in interview message route:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
