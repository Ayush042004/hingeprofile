import mongoose, { Schema, Document } from "mongoose";

// We are embedding messages in the interview session model directly as per upstream design.
export interface Message {
  role: "assistant" | "user";
  content: string;
  createdAt: Date;
}

export interface InterviewSession extends Document {
  user: mongoose.Types.ObjectId;
  status: "active" | "completed" | "abandoned";
  messages: Message[];
  confidence: {
    humor: number;
    personality: number;
    lifestyle: number;
    hobbies: number;
    communication: number;
    relationships: number;
    career: number;
    travel: number;
    food: number;
    overall: number;
  };
  completedQuestions: number;
  totalQuestions: number;
  currentTopic: string;
  startedAt: Date;
  endedAt?: Date;
}

const MessageSchema = new mongoose.Schema<Message>(
  {
    role: {
      type: String,
      enum: ["assistant", "user"],
      required: true,
      default: "assistant",
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    _id: false, // Do not create a separate _id for each embedded message
  }
);

const InterviewSessionSchema = new mongoose.Schema<InterviewSession>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    confidence: {
      humor: { type: Number, default: 0, min: 0, max: 100 },
      personality: { type: Number, default: 0, min: 0, max: 100 },
      lifestyle: { type: Number, default: 0, min: 0, max: 100 },
      hobbies: { type: Number, default: 0, min: 0, max: 100 },
      communication: { type: Number, default: 0, min: 0, max: 100 },
      relationships: { type: Number, default: 0, min: 0, max: 100 },
      career: { type: Number, default: 0, min: 0, max: 100 },
      travel: { type: Number, default: 0, min: 0, max: 100 },
      food: { type: Number, default: 0, min: 0, max: 100 },
      overall: { type: Number, default: 0, min: 0, max: 100 },
    },
    completedQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      default: 20,
      min: 1,
    },
    currentTopic: {
      type: String,
      default: "introduction",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

InterviewSessionSchema.index({
  user: 1,
  status: 1,
});

const InterviewSessionModel =
  (mongoose.models.InterviewSession as mongoose.Model<InterviewSession>) ||
  mongoose.model<InterviewSession>("InterviewSession", InterviewSessionSchema);

export default InterviewSessionModel;