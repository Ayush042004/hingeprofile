import mongoose from 'mongoose';


export type GeneratedProfile = {
  id: string;
  userId:mongoose.Types.ObjectId
  bio:String,
  tagline:String,
  prompts:{
    question:String,
    answer:String
  }[],

  photoSuggestions:{
    id:String
  }[],

  version:Number,
  createdAt:Date
  

};
const PromptSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const PhotoSuggestionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const GeneratedProfileSchemaDefinition = new mongoose.Schema<GeneratedProfile>({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },

  bio:{
    type:String,
    required:true
  },

  tagline:{
    type:String,
    required:true
  },

  prompts:{
    type: [PromptSchema],
    default: [],

  },
  photoSuggestions: {
      type: [PhotoSuggestionSchema],
      default: [],
    },

  version: {
    type: Number,
    default: 1,
  },

  createdAt:{
    type:Date,
    required:true
  }



})

export const GeneratedProfileSchema = mongoose.model< GeneratedProfile>("GeneratedProfile", GeneratedProfileSchemaDefinition);

