import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import dbConnect from '@/lib/db/connect';
import InterviewSessionModel from '@/lib/db/models/InterviewSession';

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

    // 2. Add user message to the embedded messages array
    const userMessage = {
      role: 'user' as const,
      content,
      createdAt: new Date(),
    };
    session.messages.push(userMessage);

    // 3. Increment completed questions/turns
    session.completedQuestions = (session.completedQuestions || 0) + 1;

    // 4. Generate assistant response
    // TODO: Connect this to the actual InterviewAgent / Vercel AI SDK streaming once implemented.
    // For now, we return a mock response and push it to the session.
    const mockReplyText = `Thanks for sharing that! Let's talk more about your hobbies. What's something you could spend hours doing without getting bored?`;
    
    const assistantMessage = {
      role: 'assistant' as const,
      content: mockReplyText,
      createdAt: new Date(),
    };
    session.messages.push(assistantMessage);

    // Update current topic (example logic)
    session.currentTopic = 'hobbies';

    // Save the updated session document
    await session.save();

    return NextResponse.json({
      success: true,
      userMessage,
      assistantMessage,
      completedQuestions: session.completedQuestions,
      totalQuestions: session.totalQuestions,
    });
  } catch (error) {
    console.error('Error in interview message route:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
