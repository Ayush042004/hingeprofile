import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { PromptLibraryModel } from '@/lib/db/models/PromptLibrary';
import { createErrorResponse } from '@/lib/utils/apiResponse';

export async function GET() {
  try {
    await dbConnect();
    const prompts = await PromptLibraryModel.find({ active: { $ne: false } })
      .sort({ priority: -1, category: 1 })
      .lean();

    return NextResponse.json({ prompts });
  } catch (error) {
    return createErrorResponse('Something went wrong. Please try again.', 500, error);
  }
}