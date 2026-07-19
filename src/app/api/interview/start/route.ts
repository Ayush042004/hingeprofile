import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import InterviewSession from '@/lib/db/models/InterviewSession';
import { getOpeningQuestion } from '@/lib/ai/agents/InterviewAgent';

export async function POST() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find or create user
    let user = await UserModel.findOne({ clerkId });
    if (!user) {
      user = await UserModel.create({
        clerkId,
        username: `user_${clerkId.slice(-6)}`,
        email: `${clerkId}@placeholder.com`,
      });
    }

    // Check for existing active session
    const existing = await InterviewSession.findOne({
      user: user._id,
      status: 'active',
    });

    if (existing) {
      const lastMsg = existing.messages[existing.messages.length - 1];
      return NextResponse.json({
        sessionId: existing._id.toString(),
        message: lastMsg?.content || 'Welcome back! Let\'s continue our conversation.',
        topic: existing.currentTopic,
        progress: {
          completedQuestions: existing.completedQuestions,
          totalQuestions: existing.totalQuestions,
          currentTopic: existing.currentTopic,
          confidence: existing.confidence,
          isComplete: false,
        },
      });
    }

    // Generate opening question
    const opening = await getOpeningQuestion();

    // Create new session
    const session = await InterviewSession.create({
      user: user._id,
      status: 'active',
      messages: [
        {
          role: 'assistant',
          content: opening.message,
          createdAt: new Date(),
        },
      ],
      currentTopic: opening.topic,
      completedQuestions: 0,
    });

    // Link session to user
    await UserModel.findByIdAndUpdate(user._id, {
      $push: { interviewSessions: session._id },
    });

    return NextResponse.json({
      sessionId: session._id.toString(),
      message: opening.message,
      topic: opening.topic,
      progress: {
        completedQuestions: 0,
        totalQuestions: session.totalQuestions,
        currentTopic: opening.topic,
        confidence: session.confidence,
        isComplete: false,
      },
    });
  } catch (error) {
    console.error('Interview start error:', error);
    return NextResponse.json(
      { error: 'Failed to start interview' },
      { status: 500 }
    );
  }
}