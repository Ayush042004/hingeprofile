import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import type { ModelMessage } from 'ai';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import InterviewSession from '@/lib/db/models/InterviewSession';
import { GeneratedProfileModel } from '@/lib/db/models/GeneratedProfile';
import { PromptLibraryModel } from '@/lib/db/models/PromptLibrary';
import PersonalityProfile from '@/lib/db/models/PersonalityProfile';
import { composeProfile } from '@/lib/ai/agents/ProfileComposer';

export async function POST() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const personalityProfileDoc = await PersonalityProfile.findOne({
      user: user._id,
    });
    if (!personalityProfileDoc) {
      return NextResponse.json(
        { error: 'Complete an interview first' },
        { status: 400 }
      );
    }

    // Get latest completed session
    const session = await InterviewSession.findOne({
      user: user._id,
      status: 'completed',
    }).sort({ endedAt: -1 });

    if (!session) {
      return NextResponse.json(
        { error: 'No completed interview found' },
        { status: 400 }
      );
    }

    // Get previous version number
    const lastProfile = await GeneratedProfileModel.findOne({
      userId: user._id,
    }).sort({ version: -1 });

    const nextVersion = (lastProfile?.version || 0) + 1;

    // Get all prompts
    const allPrompts = await PromptLibraryModel.find({ active: { $ne: false } }).lean();
    const promptOptions = allPrompts.map((p) => ({
      _id: (p._id as import('mongoose').Types.ObjectId).toString(),
      prompt: p.prompt,
      category: p.category,
      tags: p.tags || [],
      tone: p.tone || 'playful',
    }));

    // Build transcript
    const transcript: ModelMessage[] = session.messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })
    );

    // Compose profile
    const composed = await composeProfile(transcript, promptOptions);

    // Archive old profiles
    await GeneratedProfileModel.updateMany(
      { userId: user._id, status: 'active' },
      { status: 'archived' }
    );

    // Save new version
    const generated = await GeneratedProfileModel.create({
      userId: user._id,
      personalityProfileId: personalityProfileDoc._id,
      bio: composed.bio,
      tagline: '',
      promptAnswers: composed.promptAnswers.map((pa) => ({
        promptId: allPrompts.find((p) => p.prompt === pa.prompt)?._id || pa.promptId,
        prompt: pa.prompt,
        category: pa.category,
        answer: pa.answer,
        copied: false,
      })),
      photoSuggestions: composed.photoSuggestions,
      style: composed.style,
      version: nextVersion,
      status: 'active',
    });

    await UserModel.findByIdAndUpdate(user._id, {
      $push: { generatedProfiles: generated._id },
    });

    return NextResponse.json({
      success: true,
      profile: generated.toJSON(),
    });
  } catch (error) {
    console.error('Profile regeneration error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate profile' },
      { status: 500 }
    );
  }
}