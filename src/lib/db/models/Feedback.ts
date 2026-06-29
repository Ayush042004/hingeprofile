import mongoose from 'mongoose';

export type Feedback = {
  id: string;
  userId: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  rating: number;
  section: 'overall' | 'bio' | 'prompt' | 'photos';
  promptId?: mongoose.Types.ObjectId;
  comment?: string;
  createdAt: Date;
};

const FeedbackSchema = new mongoose.Schema<Feedback>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GeneratedProfile',
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  section: {
    type: String,
    enum: ['overall', 'bio', 'prompt', 'photos'],
    required: true,
  },
  promptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PromptLibrary',
    default: null, // only set when section = 'prompt'
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
});

export const FeedbackModel =
  (mongoose.models.Feedback as mongoose.Model<Feedback>) ||
  mongoose.model<Feedback>('Feedback', FeedbackSchema);
