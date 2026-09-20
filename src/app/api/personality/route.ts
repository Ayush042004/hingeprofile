import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import PersonalityProfile from '@/lib/db/models/PersonalityProfile';
import { createErrorResponse } from '@/lib/utils/apiResponse';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return createErrorResponse('Unauthorized', 401);
    }

    await dbConnect();

    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    const profile = await PersonalityProfile.findOne({ user: user._id });
    if (!profile) {
      return createErrorResponse(
        'No personality profile found. Complete an interview first.',
        404
      );
    }

    return NextResponse.json({ profile: profile.toJSON() });
  } catch (error) {
    return createErrorResponse('Something went wrong. Please try again.', 500, error);
  }
}