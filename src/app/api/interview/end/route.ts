import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import dbConnect from '@/lib/db/connect';
import { InterviewSessionModel } from '@/lib/db/models/InterviewSession';

export async function POST(req: Request) {
  const authResult = await requireAuth();
  const { userId } = authResult;

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID is required' }, { status: 400 });
    }

    await dbConnect();

    
    const session = await InterviewSessionModel.findOne({ _id: sessionId, userId });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    
    session.status = 'completed';
    session.endedAt = new Date();
    await session.save();

    return NextResponse.json({ success: true, message: 'Interview session ended successfully' });
  } catch (error) {
    console.error('Error ending interview session:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
