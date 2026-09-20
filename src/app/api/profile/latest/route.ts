import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import { GeneratedProfileModel } from '@/lib/db/models/GeneratedProfile';
import { createErrorResponse } from '@/lib/utils/apiResponse';

/**
 * GET /api/profile/latest
 * Returns the user's most recent active generated profile without
 * triggering any new generation. Returns 404 if none exists.
 */
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

    // Find the latest active profile for this user
    const profile = await GeneratedProfileModel.findOne({
      userId: user._id,
      status: 'active',
    }).sort({ createdAt: -1 });

    if (!profile) {
      return createErrorResponse('No profile found', 404);
    }

    return NextResponse.json({ profile: profile.toJSON() });
  } catch (error) {
    return createErrorResponse('Something went wrong. Please try again.', 500, error);
  }
}
