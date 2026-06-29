import mongoose, {Schema,Document} from "mongoose";

export interface User extends Document {
    clerkId: string,
    username: string,
    email: string,
    imageUrl: string,
    onboardingCompleted: boolean;
    generatedProfiles: Schema.Types.ObjectId[];
    interviewSessions: Schema.Types.ObjectId[];
    personalityProfile?: Schema.Types.ObjectId;
    timestamp: {
        createdAt: Date;
        updatedAt: Date;
    }

}

const UserSchema: Schema<User> = new mongoose.Schema({
    clerkId: {
        type: String,
        required: [true, 'Clerk ID is required'],
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
      type: String,   
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address'], //instea of regex if we can use zod validation that would be ideal for both backend and frontend
    },
    imageUrl: {
        type: String,
        default: ""
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    },
    generatedProfiles: [{
        type: Schema.Types.ObjectId,
        ref: 'GeneratedProfile'
    }],
    interviewSessions: [{

        type: Schema.Types.ObjectId,
        ref: 'InterviewSession'
    }],
    personalityProfile: {
        type: Schema.Types.ObjectId,
        ref: 'PersonalityProfile',
        default: null
    }
}, { timestamps: true });

const UserModel = (mongoose.models.User as mongoose.Model<User>) ||
                  mongoose.model<User>('User',UserSchema);
export default UserModel;
