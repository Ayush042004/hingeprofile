import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';
import { GeneratedProfileModel } from '@/lib/db/models/GeneratedProfile';
import { validateObjectId } from '@/lib/utils/validators';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const idError = validateObjectId(id);
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = await GeneratedProfileModel.findById(id);
    if (!profile || profile.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: profile.toJSON() });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}