import mongoose from 'mongoose';


export type Message = {
  id: string;
  sessionId: mongoose.Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  topicHint?: string;
  createdAt: Date;
};


const MessageSchema = new mongoose.Schema<Message>({
  sessionId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"InterviewSession",
    required:true,
  },
  role:{
    type:String,
    enum:["user","assistant"],
    required:true,
    default:"user" //check it 
  },
  content:{
    type:String,
    required:true
  },
  topicHint:{
    type:String
  },
  createdAt:{
    type:Date,
    required:true,
    default:Date.now,
    Index:true
  }
})