import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import dbConnect from '@/lib/db/connect';
import { InterviewSessionModel } from '@/lib/db/models/InterviewSession';
import { MessageModel } from '@/lib/db/models/Message';

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

    
    const session = await InterviewSessionModel.findOne({ _id: sessionId, userId });
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    if (session.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'This interview session is no longer active' },
        { status: 400 }
      );
    }

    
    const userMessage = await MessageModel.create({
      sessionId,
      role: 'user',
      content,
      createdAt: new Date(),
    });

    
    session.turnCount = (session.turnCount || 0) + 1;
    await session.save();

    
    //we have to write a mockReplyText when we will be using vercel AI SDK or any other AI SDK 

    
    const assistantMessage = await MessageModel.create({
      sessionId,
      role: 'assistant',
      //content: mockReplyText,
      topicHint: 'hobbies',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    console.error('Error in interview message route:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
