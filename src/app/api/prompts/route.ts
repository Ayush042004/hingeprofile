import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { PromptLibraryModel } from '@/lib/db/models/PromptLibrary';

export async function GET() {
  try {
    await dbConnect();
    const prompts = await PromptLibraryModel.find({ active: { $ne: false } })
      .sort({ priority: -1, category: 1 })
      .lean();

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Prompts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}