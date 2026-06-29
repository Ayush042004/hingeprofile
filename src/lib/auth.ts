import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}


export async function requireAuth(): Promise<
  { userId: string; error?: never } |
  { userId?: never; error: NextResponse }
> {
  const { userId } = await auth();

  

  if (!userId) {
    return {
      error: NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  return { userId };
}
