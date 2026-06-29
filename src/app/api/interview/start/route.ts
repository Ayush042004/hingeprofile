import { NextResponse } from 'next/server';
import {getCurrentUserId} from "@/lib/auth"
import { requireAuth } from '@/lib/auth';
import dbConnect from "@/lib/db/connect"
import  {InterviewSessionModel} from "@/lib/db/models/InterviewSession"


export async function POST() {
  const auth = await requireAuth()
  
  const { userId } = auth

  // checking of user authentication
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try{
    await dbConnect()

    const session = await InterviewSessionModel.create({
      userId,
      status: "active",
      turnCount: 0,
      startedAt: new Date()
    })

    return NextResponse.json({success:true,sessionId: session._id,},{status:201})



  }catch(error){

    console.error(error);

    return NextResponse.json({success:false,error:"failed to create interviewSession"},{status:500})
      


  }





  
}