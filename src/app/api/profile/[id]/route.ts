import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import { GeneratedProfileModel } from '@/lib/db/models/GeneratedProfile';
import { validateObjectId } from '@/lib/utils/validators';
import { createErrorResponse } from '@/lib/utils/apiResponse';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    const idError = validateObjectId(id);
    if (idError) {
      return createErrorResponse(idError, 400);
    }

    await dbConnect();

    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    const profile = await GeneratedProfileModel.findById(id);
    if (!profile || profile.userId.toString() !== user._id.toString()) {
      return createErrorResponse('Profile not found', 404);
    }

    return NextResponse.json({ profile: profile.toJSON() });
  } catch (error) {
    return createErrorResponse('Something went wrong. Please try again.', 500, error);
  }
}