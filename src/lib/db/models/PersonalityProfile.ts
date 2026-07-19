import mongoose, { Document, Schema } from "mongoose";

interface AITrait<T> {
  value: T;
  confidence: number;
} // Represents a trait with a value and a confidence level ai making how sure it is about the value of the trait

export interface PersonalityProfile extends Document {
  user: mongoose.Types.ObjectId;

  personality: {
    introversion: AITrait<number>;
    confidence: AITrait<number>;
    humor: AITrait<string>;
    communicationStyle: AITrait<string>;
    energyLevel:  AITrait<string>;
  };

  lifestyle: {
    fitness: AITrait<boolean>;
    traveller: AITrait<boolean>;
    petOwner: AITrait<boolean>;
    smoker: AITrait<boolean>;
    drinker: AITrait<boolean>;
    workLifeBalance: AITrait<string>;
  };

  interests: AITrait<string[]>;

  hobbies: AITrait<string[]>;

  favoriteMovies: AITrait<string[]>;

  favoriteMusic: AITrait<string[]>;

  favoriteFoods: AITrait<string[]>;

  favoriteBooks: AITrait<string[]>;

  travel: {
    likesTravel: AITrait<boolean>;
    favoriteDestination: AITrait<string>;
    travelStyle: AITrait<string>;
  };

  relationship: {
    goal: AITrait<string>;
    loveLanguage:  AITrait<string>;
    lookingFor: AITrait<string>;
    dealBreakers: AITrait<string[]>;
  };

  career: {
    occupation: AITrait<string>;
    education: AITrait<string>;
    ambition: AITrait<string>;
  };

  promptTraits: {
    funny: boolean;
    romantic: boolean;
    adventurous: boolean;
    intellectual: boolean;
    creative: boolean;
    foodie: boolean;
    geeky: boolean;
  };

  confidence: {
    overall: number;
    personality: number;
    lifestyle: number;
    interests: number;
    travel: number;
    relationship: number;
    career: number;
  };

  lastInterview: mongoose.Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

const aiTrait = (type: any, defaultValue: any) => ({
  value: {
    type,
    default: defaultValue,
  },

  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

const PersonalityProfileSchema = new Schema<PersonalityProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    personality: {
      introversion: aiTrait(Number, 50),

      confidence: aiTrait(Number, 50),

      humor: aiTrait(String, ""),

      communicationStyle: aiTrait(String, ""),

      energyLevel: aiTrait(String, ""),
    },

    lifestyle: {
      fitness: aiTrait(Boolean, false),

      traveller: aiTrait(Boolean, false),

      petOwner: aiTrait(Boolean, false),

      smoker: aiTrait(Boolean, false),

      drinker: aiTrait(Boolean, false),

      workLifeBalance: aiTrait(String, ""),
    },

    interests: aiTrait([String], []),

    hobbies: aiTrait([String], []),

    favoriteMovies: aiTrait([String], []),

    favoriteMusic: aiTrait([String], []),

    favoriteFoods: aiTrait([String], []),

    favoriteBooks: aiTrait([String], []),

    travel: {
      likesTravel: aiTrait(Boolean, false),

      favoriteDestination: aiTrait(String, ""),

      travelStyle: aiTrait(String, ""),
    },

    relationship: {
      goal: aiTrait(String, ""),

      loveLanguage: aiTrait(String, ""),

      lookingFor: aiTrait(String, ""),

      dealBreakers: aiTrait([String], []),
    },

    career: {
      occupation: aiTrait(String, ""),

      education: aiTrait(String, ""),

      ambition: aiTrait(String, ""),
    },
//prompttraits are boolean values indicating whether the user has this trait
//these are tags used to generate prompts for the user
    promptTraits: {
      funny: {
        type: Boolean,
        default: false,
      },

      romantic: {
        type: Boolean,
        default: false,
      },

      adventurous: {
        type: Boolean,
        default: false,
      },

      intellectual: {
        type: Boolean,
        default: false,
      },

      creative: {
        type: Boolean,
        default: false,
      },

      foodie: {
        type: Boolean,
        default: false,
      },

      geeky: {
        type: Boolean,
        default: false,
      },
    },
//confidence values are numbers between 0 and 100 indicating how confident the ai is in its assessment of the user's traits
//this is overall confidence, and confidence for each category of traits
    confidence: {
      overall: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      personality: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      lifestyle: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      interests: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      travel: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      relationship: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      career: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    lastInterview: {
      type: Schema.Types.ObjectId,
      ref: "InterviewSession",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PersonalityProfile =
  mongoose.models.PersonalityProfile ||
  mongoose.model<PersonalityProfile>(
    "PersonalityProfile",
    PersonalityProfileSchema
  );

export default PersonalityProfile;