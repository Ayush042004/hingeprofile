import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import type { ModelMessage } from 'ai';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import InterviewSession from '@/lib/db/models/InterviewSession';
import PersonalityProfile from '@/lib/db/models/PersonalityProfile';
import { extractPersonality } from '@/lib/ai/agents/PersonalityExtractor';
import { validateObjectId } from '@/lib/utils/validators';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await req.json();

    const idError = validateObjectId(sessionId);
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session || session.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Mark session complete
    session.status = 'completed';
    session.endedAt = new Date();
    await session.save();

    // Build transcript for extraction
    const transcript: ModelMessage[] = session.messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })
    );

    // Extract personality
    const extracted = await extractPersonality(transcript);

    // Calculate category confidence averages from the extracted data
    const calcAvg = (...vals: number[]) =>
      Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);

    const personalityConf = calcAvg(
      extracted.personality.introversion.confidence,
      extracted.personality.confidence.confidence,
      extracted.personality.humor.confidence,
      extracted.personality.communicationStyle.confidence,
      extracted.personality.energyLevel.confidence
    );

    const lifestyleConf = calcAvg(
      extracted.lifestyle.fitness.confidence,
      extracted.lifestyle.traveller.confidence,
      extracted.lifestyle.petOwner.confidence,
      extracted.lifestyle.smoker.confidence,
      extracted.lifestyle.drinker.confidence,
      extracted.lifestyle.workLifeBalance.confidence
    );

    const travelConf = calcAvg(
      extracted.travel.likesTravel.confidence,
      extracted.travel.favoriteDestination.confidence,
      extracted.travel.travelStyle.confidence
    );

    const relationshipConf = calcAvg(
      extracted.relationship.goal.confidence,
      extracted.relationship.loveLanguage.confidence,
      extracted.relationship.lookingFor.confidence,
      extracted.relationship.dealBreakers.confidence
    );

    const careerConf = calcAvg(
      extracted.career.occupation.confidence,
      extracted.career.education.confidence,
      extracted.career.ambition.confidence
    );

    const interestsConf = extracted.interests.confidence;
    const overallConf = calcAvg(
      personalityConf,
      lifestyleConf,
      interestsConf,
      travelConf,
      relationshipConf,
      careerConf
    );

    // Upsert personality profile
    const profile = await PersonalityProfile.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        ...extracted,
        confidence: {
          overall: overallConf,
          personality: personalityConf,
          lifestyle: lifestyleConf,
          interests: interestsConf,
          travel: travelConf,
          relationship: relationshipConf,
          career: careerConf,
        },
        lastInterview: session._id,
      },
      { upsert: true, new: true }
    );

    // Update user references
    await UserModel.findByIdAndUpdate(user._id, {
      personalityProfile: profile._id,
      onboardingCompleted: true,
    });

    return NextResponse.json({
      success: true,
      personalityProfileId: profile._id.toString(),
    });
  } catch (error) {
    console.error('Interview end error:', error);
    return NextResponse.json(
      { error: 'Failed to end interview' },
      { status: 500 }
    );
  }
}