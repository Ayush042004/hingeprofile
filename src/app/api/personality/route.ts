import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import PersonalityProfile from '@/lib/db/models/PersonalityProfile';

export async function GET() {
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

    const profile = await PersonalityProfile.findOne({ user: user._id });
    if (!profile) {
      return NextResponse.json(
        { error: 'No personality profile found. Complete an interview first.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile: profile.toJSON() });
  } catch (error) {
    console.error('Personality fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personality profile' },
      { status: 500 }
    );
  }
}