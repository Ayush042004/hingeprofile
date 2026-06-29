import mongoose from "mongoose"





export type PersonalityProfile = {
  id: string;
  userId: mongoose.Types.ObjectId;
  humor:{
    value: string;
    score: number;
  },
  lifestyle:{
    value: string;
    score: number;
  },
  hobbies:{
    value: string[];
    score: number;
  },
  communicationStyle:{
    value: string;
    score: number;
  },
  relationshipGoal:{
    value: string;
    score: number;
  },
  values:{
    value: string;
    score: number;
  },
  travel:{
    value: string;
    score: number;
       

  },
  food:{
    value: string;
    score: number;

  },
  Carrer:{
    value: string;
    score: number;

  },
  quirks:{
    value: string;
    score: number;

  },
  updatedAt: Date;

}

const PersonalityProfileSchema = new mongoose.Schema<PersonalityProfile>({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,

  },
  humor:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }
  },
  lifestyle:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }

  },
  hobbies:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }

  },
  communicationStyle:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }
  },
  relationshipGoal:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }
  },
  values:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }
  },
  travel:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }
  },
  food:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }
  },
  Carrer:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }
  },
  quirks:{
    value:{
      type:String,
      required:true
    },
    score:{
      type:Number,
      required:true,
      default:0
    }
  },
  updatedAt:{
    type:Date,
    required:true,
    index:true
  }

})

export const PersonalityProfileModel = mongoose.model<PersonalityProfile>("PersonalityProfile",PersonalityProfileSchema)