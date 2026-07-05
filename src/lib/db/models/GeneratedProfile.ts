import mongoose, { Document } from "mongoose";

interface PromptAnswer {
  prompt: string;
  promptId: mongoose.Types.ObjectId;
  category: string;
  answer: string;
  copied: boolean;
}

interface  PhotoSuggestion {
  order: number;
  photoType:
    | "Portrait"
    | "Travel"
    | "Hobby"
    | "Friends"
    | "Pet"
    | "Food"
    | "Sports"
    | "Lifestyle"
    | "Nature"
    | "Other";
  title: string;
  description: string;
  reason: string;
  caption: string;
  importance: number;
  required: boolean;
}

export interface GeneratedProfile extends Document {
  userId: mongoose.Types.ObjectId;
  personalityProfileId: mongoose.Types.ObjectId;
  bio: string;
  tagline: string;
  promptAnswers: PromptAnswer[];
  photoSuggestions: PhotoSuggestion[];
  overallScore: number;
  style:
    | "Funny"
    | "Romantic"
    | "Witty"
    | "Adventurous"
    | "Professional"
    | "Balanced";
  version: number;
  status: "active" | "archived";
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromptAnswerSchema =
  new mongoose.Schema<PromptAnswer>(
    {
       promptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PromptLibrary",
      required: true,
    },
      prompt: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
      type: String,
      required: true,
      trim: true,
    },

      answer: {
        type: String,
        required: true,
        trim: true,
      },
       copied: {
      type: Boolean,
      default: false,
    },
    },
    {
      _id: false,
    }
  );

const PhotoSuggestionSchema =
  new mongoose.Schema<PhotoSuggestion>(
    {
      order: {
        type: Number,
        required: true,
        min: 1
      },

      photoType: {
        type: String,
        enum: [
          "Portrait",
          "Travel",
          "Hobby",
          "Friends",
          "Pet",
          "Food",
          "Sports",
          "Lifestyle",
          "Nature",
          "Other",
        ],
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true
      },

      description: {
        type: String,
        required: true,
        trim: true
      },

      reason: {
        type: String,
        required: true,
        trim: true
      },

      caption: {
        type: String,
        default: "",
        trim: true
      },

      importance: {
        type: Number,
        default: 5,
        min: 1,
        max: 10,
      },

      required: {
        type: Boolean,
        default: false,
      },
    },
    {
      _id: false,
    }
  );

const GeneratedProfileSchema =
  new mongoose.Schema<GeneratedProfile>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      personalityProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PersonalityProfile",
        required: true,
      },

      bio: {
        type: String,
        required: true,
        trim: true
      },

      tagline: {
        type: String,
        default: "",
        trim: true
      },

      promptAnswers: {
        type: [PromptAnswerSchema],
        default: [],
      },

      photoSuggestions: {
        type: [PhotoSuggestionSchema],
        default: [],
      },

      overallScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      style: {
        type: String,
        enum: [
          "Funny",
          "Romantic",
          "Witty",
          "Adventurous",
          "Professional",
          "Balanced",
        ],
        default: "Balanced",
      },

      version: {
      type: Number,
      default: 1,
    },
      isFavorite: {
        type: Boolean,
        default: false,
      },
      status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    },
    {
      timestamps: true,
    }
  );

GeneratedProfileSchema.index({
  userId: 1,
  createdAt: -1,
});
GeneratedProfileSchema.index({
  personalityProfileId: 1,
});


export const GeneratedProfileModel =
  mongoose.models.GeneratedProfile ||
  mongoose.model<GeneratedProfile>(
    "GeneratedProfile",
    GeneratedProfileSchema
  );