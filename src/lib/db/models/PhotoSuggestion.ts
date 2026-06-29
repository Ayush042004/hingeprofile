export type PhotoSuggestion = {
  id: string;
  profileId: mongoose.Types.ObjectId;
  type: 'headshot' | 'workout' | 'travel' | 'pet' | 'restaurant' | 'hobby' | 'cozy';
  caption: string;
  order: number;
  traitSource?: string;
};

const PhotoSuggestionSchema = new mongoose.Schema<PhotoSuggestion>({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GeneratedProfile',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['headshot', 'workout', 'travel', 'pet', 'restaurant', 'hobby', 'cozy'],
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  traitSource: {
    type: String,
  },
});

export const PhotoSuggestionModel =
  (mongoose.models.PhotoSuggestion as mongoose.Model<PhotoSuggestion>) ||
  mongoose.model<PhotoSuggestion>('PhotoSuggestion', PhotoSuggestionSchema);
