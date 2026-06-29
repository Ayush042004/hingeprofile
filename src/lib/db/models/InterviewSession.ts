import mongoose from 'mongoose';



export type InterviewSession = {
  id: string;
  userId: mongoose.Types.ObjectId
  status: "active" | "completed" | "abandoned";
  turnCount: number
  startedAt: Date
  endedAt?: Date

};


const InterviewSessionSchema = new mongoose.Schema<InterviewSession>({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  status:{
    type:String,
    enum:["active","completed","abandoned"],
    required:true,
    default:"active" //I dont know weather this is the right way to set defalut value as active or not 
  },
  turnCount:{
    type:Number,
    default:20,
    required:true

  },
  startedAt:{
    type:Date,
    required:true,
    default:Date.now,
    Index:true
  },
  endedAt:{
    type:Date,
    required:true
    
  }


})

export const InterviewSessionModel = mongoose.model<InterviewSession>("InterviewSession",InterviewSessionSchema);