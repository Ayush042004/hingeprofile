import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from './db/connect';
import UserModel from './db/models/User';

export async function getAuthenticatedUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  await dbConnect();
  const user = await UserModel.findOne({ clerkId });
  return user;
}
