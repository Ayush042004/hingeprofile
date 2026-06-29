import mongoose, { Schema, Document } from 'mongoose';

export interface IPromptLibrary extends Document {
  text: string;
  requiredTraits: string[];
  category: 'humor' | 'values' | 'lifestyle' | 'relationship' | 'fun';
  difficulty: 'easy' | 'medium' | 'hard';
  active: boolean;
}

const PromptLibrarySchema: Schema<IPromptLibrary> = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Prompt text is required'],
    unique: true,
  },
  requiredTraits: {
    type: [String],
    required: [true, 'Required traits are required'],
  },
  category: {
    type: String,
    enum: ['humor', 'values', 'lifestyle', 'relationship', 'fun'],
    required: [true, 'Category is required'],
    index: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Difficulty is required'],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const PromptLibraryModel =
  (mongoose.models.PromptLibrary as mongoose.Model<IPromptLibrary>) ||
  mongoose.model<IPromptLibrary>('PromptLibrary', PromptLibrarySchema);

export default PromptLibraryModel;
