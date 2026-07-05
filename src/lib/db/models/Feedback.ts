import mongoose, { Document } from "mongoose";

export interface Feedback extends Document {
  userId: mongoose.Types.ObjectId;
  generatedProfileId: mongoose.Types.ObjectId;
  rating: number;
  liked: boolean;
  feedbackType:
    | "profile"
    | "bio"
    | "prompt"
    | "photos"
    | "overall";
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new mongoose.Schema<Feedback>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    generatedProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeneratedProfile",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    liked: {
      type: Boolean,
      required: true,
    },

    feedbackType: {
      type: String,
      enum: [
        "overall",
        "bio",
        "prompt",
        "photos",
        "profile",
      ],
      default: "overall",
    },

    comment: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

FeedbackSchema.index({
  userId: 1,
  createdAt: -1,
});

FeedbackSchema.index({
  generatedProfileId: 1,
});

export const FeedbackModel =
  mongoose.models.Feedback ||
  mongoose.model<Feedback>(
    "Feedback",
    FeedbackSchema
  );