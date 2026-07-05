import mongoose, { Document } from "mongoose";

export interface PromptLibrary extends Document {
  prompt: string;
  category: string;
  requiredTraits: string[];
  tags: string[];
  active: boolean;
  priority: number;
  tone: "playful" | "sarcastic" | "chaotic" | "emotional" | "thoughtful";
}

const PromptLibrarySchema =
  new mongoose.Schema<PromptLibrary>(
    {
      prompt: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      category: {
        type: String,
        required: true,
        lowercase: true,
      },

      requiredTraits: [
        {
          type: String,
          lowercase: true,
        },
      ],

      tags: [
        {
          type: String,
          lowercase: true,
        },
      ],
      priority: {
        type: Number,
        default: 0,
      },
      tone: {
        type: String,
        enum: ["playful", "sarcastic", "chaotic", "emotional", "thoughtful"],
      },

      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

PromptLibrarySchema.index({
  category: 1,
});

PromptLibrarySchema.index({
  requiredTraits: 1,
});

export const PromptLibraryModel =
  mongoose.models.PromptLibrary ||
  mongoose.model<PromptLibrary>(
    "PromptLibrary",
    PromptLibrarySchema
  );