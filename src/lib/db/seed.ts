import dbConnect from "./connect";
import { PromptLibraryModel } from "./models/PromptLibrary";
 
/**
 * Full merged Hinge-style prompt library.
 * - `category` groups prompts the same way Hinge's own prompt picker does.
 * - `requiredTraits` maps to PersonalityProfile trait fields (humor, lifestyle,
 *   hobbies, communication, relationships, career, travel, food, values).
 *   PromptRecommender.ts scores a prompt by counting how many of these traits
 *   have a confidence score >= 70 in the user's profile.
 * - `tags` are free-form labels used for search/filtering in the admin UI
 *   and for lightweight keyword matching, independent of requiredTraits.
 * - `priority` (1-10) is a static strength score for the prompt itself —
 *   independent of the user's profile. Classic, high-performing prompts
 *   ("Dating me is like...") sit near 10; weaker/less-engaging prompts sit
 *   lower (down to 3). PromptRecommender.ts should blend this with the
 *   trait-match score so it naturally favors stronger prompts when two
 *   prompts tie on trait coverage.
 * - `tone` buckets the prompt's vibe so the recommender/UI can filter or
 *   diversify results: "playful" | "sarcastic" | "chaotic" (funny/light
 *   prompts) or "emotional" | "thoughtful" (deep/sincere prompts).
 * - Two prompts are seeded with `active: false` — they're duplicates that
 *   show up in more than one Hinge category, kept once to avoid double-serving
 *   the same prompt text to a user.
 */
 
const prompts = [
 
  // ---------------------------------------------------------------------
  // HUMOR (31)
  // ---------------------------------------------------------------------
 
  {
    prompt: "Dating me is like...",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["funny", "conversation"],
    priority: 10,
    tone: "playful",
  },
 
  {
    prompt: "The way to win me over is...",
    category: "humor",
    requiredTraits: ["humor", "relationships"],
    tags: ["funny", "flirty"],
    priority: 10,
    tone: "sarcastic",
  },
 
  {
    prompt: "I'm weirdly attracted to...",
    category: "humor",
    requiredTraits: ["humor"],
    tags: ["funny", "quirky"],
    priority: 10,
    tone: "chaotic",
  },
 
  {
    prompt: "My most controversial opinion is...",
    category: "humor",
    requiredTraits: ["humor", "values"],
    tags: ["funny", "debate"],
    priority: 10,
    tone: "playful",
  },
 
  {
    prompt: "I go crazy for...",
    category: "humor",
    requiredTraits: ["humor", "food"],
    tags: ["funny", "quirky"],
    priority: 8,
    tone: "sarcastic",
  },
 
  {
    prompt: "The key to my heart is...",
    category: "humor",
    requiredTraits: ["humor", "relationships"],
    tags: ["funny", "flirty"],
    priority: 8,
    tone: "chaotic",
  },
 
  {
    prompt: "I'll pick the topic if you start the conversation...",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["funny", "conversation-starter"],
    priority: 8,
    tone: "playful",
  },
 
  {
    prompt: "My simple pleasures...",
    category: "humor",
    requiredTraits: ["humor", "lifestyle"],
    tags: ["funny", "lighthearted"],
    priority: 8,
    tone: "sarcastic",
  },
 
  {
    prompt: "Two truths and a lie...",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["funny", "game"],
    priority: 9,
    tone: "chaotic",
  },
 
  {
    prompt: "I know the best spot in town for...",
    category: "humor",
    requiredTraits: ["humor", "lifestyle"],
    tags: ["funny", "local"],
    priority: 9,
    tone: "playful",
  },
 
  {
    prompt: "Change my mind about...",
    category: "humor",
    requiredTraits: ["humor", "values"],
    tags: ["funny", "debate"],
    priority: 7,
    tone: "sarcastic",
  },
 
  {
    prompt: "I'm convinced that...",
    category: "humor",
    requiredTraits: ["humor", "values"],
    tags: ["funny", "opinion"],
    priority: 8,
    tone: "chaotic",
  },
 
  {
    prompt: "The most spontaneous thing I've done is...",
    category: "humor",
    requiredTraits: ["humor", "hobbies"],
    tags: ["funny", "adventure"],
    priority: 6,
    tone: "playful",
  },
 
  {
    prompt: "A shower thought I recently had...",
    category: "humor",
    requiredTraits: ["humor"],
    tags: ["funny", "random"],
    priority: 6,
    tone: "sarcastic",
  },
 
  {
    prompt: "My love language is...",
    category: "humor",
    requiredTraits: ["humor", "relationships"],
    tags: ["funny", "flirty"],
    priority: 7,
    tone: "chaotic",
  },
 
  {
    prompt: "I geek out on...",
    category: "humor",
    requiredTraits: ["humor", "hobbies"],
    tags: ["funny", "nerdy"],
    priority: 7,
    tone: "playful",
  },
 
  {
    prompt: "My friends would describe me as...",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["funny", "personality"],
    priority: 5,
    tone: "sarcastic",
  },
 
  {
    prompt: "Unusual skills...",
    category: "humor",
    requiredTraits: ["humor", "hobbies"],
    tags: ["funny", "quirky"],
    priority: 7,
    tone: "chaotic",
  },
 
  {
    prompt: "I'll never shut up about...",
    category: "humor",
    requiredTraits: ["humor", "hobbies"],
    tags: ["funny", "passion"],
    priority: 6,
    tone: "playful",
  },
 
  {
    prompt: "This year, I really want to...",
    category: "humor",
    requiredTraits: ["humor", "career"],
    tags: ["funny", "goals"],
    priority: 5,
    tone: "sarcastic",
  },
 
  {
    prompt: "I'm a regular at...",
    category: "humor",
    requiredTraits: ["humor", "lifestyle"],
    tags: ["funny", "local"],
    priority: 5,
    tone: "chaotic",
  },
 
  {
    prompt: "Never have I ever...",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["funny", "game"],
    priority: 5,
    tone: "playful",
  },
 
  {
    prompt: "Worst idea I've ever had...",
    category: "humor",
    requiredTraits: ["humor"],
    tags: ["funny", "story"],
    priority: 6,
    tone: "sarcastic",
  },
 
  {
    prompt: "I'm looking for someone who can beat me at...",
    category: "humor",
    requiredTraits: ["humor", "hobbies"],
    tags: ["funny", "competitive"],
    priority: 5,
    tone: "chaotic",
  },
 
  {
    prompt: "My most irrational fear...",
    category: "humor",
    requiredTraits: ["humor"],
    tags: ["funny", "quirky"],
    priority: 4,
    tone: "playful",
  },
 
  {
    prompt: "I'll bet you can't...",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["funny", "challenge"],
    priority: 4,
    tone: "sarcastic",
  },
 
  {
    prompt: "Green flags I look for...",
    category: "humor",
    requiredTraits: ["humor", "values"],
    tags: ["funny", "dating"],
    priority: 5,
    tone: "chaotic",
  },
 
  {
    prompt: "A life goal of mine...",
    category: "humor",
    requiredTraits: ["humor", "career"],
    tags: ["funny", "goals"],
    priority: 4,
    tone: "playful",
  },
 
  {
    prompt: "The nerdiest thing about me is...",
    category: "humor",
    requiredTraits: ["humor", "hobbies"],
    tags: ["funny", "nerdy"],
    priority: 2,
    tone: "sarcastic",
  },
 
  {
    prompt: "I promise I'm normal, except...",
    category: "humor",
    requiredTraits: ["humor"],
    tags: ["funny", "quirky"],
    priority: 2,
    tone: "chaotic",
  },
 
  {
    prompt: "Sunday mornings are for...",
    category: "humor",
    requiredTraits: ["humor", "lifestyle"],
    tags: ["funny", "lifestyle"],
    priority: 4,
    tone: "playful",
  },
 
  // ---------------------------------------------------------------------
  // LIFESTYLE (25)
  // ---------------------------------------------------------------------
 
  {
    prompt: "My greatest strength...",
    category: "lifestyle",
    requiredTraits: ["career", "communication"],
    tags: ["personality", "self"],
    priority: 10,
    tone: "playful",
  },
 
  {
    prompt: "A typical Sunday...",
    category: "lifestyle",
    requiredTraits: ["lifestyle"],
    tags: ["routine", "everyday"],
    priority: 9,
    tone: "thoughtful",
  },
 
  {
    prompt: "I take pride in...",
    category: "lifestyle",
    requiredTraits: ["career", "values"],
    tags: ["personality", "self"],
    priority: 10,
    tone: "playful",
  },
 
  {
    prompt: "My favorite way to spend a weekend...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "hobbies"],
    tags: ["routine", "leisure"],
    priority: 10,
    tone: "thoughtful",
  },
 
  {
    prompt: "The one thing I can't live without...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "values"],
    tags: ["essentials"],
    priority: 9,
    tone: "playful",
  },
 
  {
    prompt: "I spend most of my money on...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "career"],
    tags: ["spending", "priorities"],
    priority: 9,
    tone: "thoughtful",
  },
 
  {
    prompt: "My ideal Friday night...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "hobbies"],
    tags: ["nightlife", "leisure"],
    priority: 8,
    tone: "playful",
  },
 
  {
    prompt: "My go-to karaoke song...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "hobbies"],
    tags: ["music", "fun"],
    priority: 7,
    tone: "thoughtful",
  },
 
  {
    prompt: "The most delicious meal I've ever had...",
    category: "lifestyle",
    requiredTraits: ["food"],
    tags: ["food", "memories"],
    priority: 7,
    tone: "playful",
  },
 
  {
    prompt: "I could eat this every day for the rest of my life...",
    category: "lifestyle",
    requiredTraits: ["food"],
    tags: ["food"],
    priority: 8,
    tone: "thoughtful",
  },
 
  {
    prompt: "My favorite restaurant is...",
    category: "lifestyle",
    requiredTraits: ["food", "lifestyle"],
    tags: ["food", "local"],
    priority: 7,
    tone: "playful",
  },
 
  {
    prompt: "I make the best...",
    category: "lifestyle",
    requiredTraits: ["food", "hobbies"],
    tags: ["food", "cooking"],
    priority: 7,
    tone: "thoughtful",
  },
 
  {
    prompt: "My cooking specialty is...",
    category: "lifestyle",
    requiredTraits: ["food", "hobbies"],
    tags: ["food", "cooking"],
    priority: 6,
    tone: "playful",
  },
 
  {
    prompt: "My daily routine involves...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "career"],
    tags: ["routine", "everyday"],
    priority: 5,
    tone: "thoughtful",
  },
 
  {
    prompt: "I'm most productive when...",
    category: "lifestyle",
    requiredTraits: ["career"],
    tags: ["work", "habits"],
    priority: 6,
    tone: "playful",
  },
 
  {
    prompt: "My biggest hustle right now...",
    category: "lifestyle",
    requiredTraits: ["career"],
    tags: ["work", "goals"],
    priority: 5,
    tone: "thoughtful",
  },
 
  {
    prompt: "The career I'd pursue in another life...",
    category: "lifestyle",
    requiredTraits: ["career"],
    tags: ["career", "dreams"],
    priority: 4,
    tone: "playful",
  },
 
  {
    prompt: "I get way too competitive about...",
    category: "lifestyle",
    requiredTraits: ["hobbies", "lifestyle"],
    tags: ["personality", "competitive"],
    priority: 6,
    tone: "thoughtful",
  },
 
  {
    prompt: "My favorite quality in a person...",
    category: "lifestyle",
    requiredTraits: ["values", "relationships"],
    tags: ["values", "dating"],
    priority: 6,
    tone: "playful",
  },
 
  {
    prompt: "Together we could...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "hobbies", "travel"],
    tags: ["adventure"],
    priority: 4,
    tone: "thoughtful",
  },
 
  {
    prompt: "I've recently discovered...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "hobbies"],
    tags: ["discovery", "new"],
    priority: 3,
    tone: "playful",
  },
 
  {
    prompt: "My morning routine...",
    category: "lifestyle",
    requiredTraits: ["lifestyle"],
    tags: ["routine", "everyday"],
    priority: 4,
    tone: "thoughtful",
  },
 
  {
    prompt: "I'm currently obsessed with...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "hobbies"],
    tags: ["current", "interests"],
    priority: 4,
    tone: "playful",
  },
 
  {
    prompt: "The last playlist I made was about...",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "hobbies"],
    tags: ["music"],
    priority: 3,
    tone: "thoughtful",
  },
 
  {
    prompt: "My favorite Sunday ritual...",
    category: "lifestyle",
    requiredTraits: ["lifestyle"],
    tags: ["routine", "leisure"],
    priority: 2,
    tone: "playful",
  },
 
  // ---------------------------------------------------------------------
  // FUN / CONVERSATION STARTERS (18)
  // ---------------------------------------------------------------------
 
  {
    prompt: "Two truths and a lie...",
    category: "fun",
    requiredTraits: ["humor", "communication"],
    tags: ["game", "conversation-starter"],
    priority: 10,
    tone: "playful",
    active: false, // ye duplicate hai
  },
 
  {
    prompt: "Let's debate this topic...",
    category: "fun",
    requiredTraits: ["communication", "values"],
    tags: ["debate", "conversation-starter"],
    priority: 10,
    tone: "chaotic",
  },
 
  {
    prompt: "Teach me something about...",
    category: "fun",
    requiredTraits: ["communication", "hobbies"],
    tags: ["conversation-starter", "learning"],
    priority: 8,
    tone: "sarcastic",
  },
 
  {
    prompt: "Send me a postcard from...",
    category: "fun",
    requiredTraits: ["travel", "communication"],
    tags: ["travel", "playful"],
    priority: 10,
    tone: "playful",
  },
 
  {
    prompt: "Together, we could...",
    category: "fun",
    requiredTraits: ["lifestyle", "hobbies", "travel"],
    tags: ["adventure"],
    priority: 7,
    tone: "chaotic",
    active: false, // ye ek aur duplicate hai
  },
 
  {
    prompt: "Let's make sure we're compatible on the big things...",
    category: "fun",
    requiredTraits: ["values", "communication"],
    tags: ["compatibility", "values"],
    priority: 7,
    tone: "sarcastic",
  },
 
  {
    prompt: "Match made in heaven if...",
    category: "fun",
    requiredTraits: ["relationships", "communication"],
    tags: ["compatibility", "flirty"],
    priority: 7,
    tone: "playful",
  },
 
  {
    prompt: "I bet you can't guess my...",
    category: "fun",
    requiredTraits: ["humor", "communication"],
    tags: ["game", "conversation-starter"],
    priority: 6,
    tone: "chaotic",
  },
 
  {
    prompt: "Pitch me on why we'd get along...",
    category: "fun",
    requiredTraits: ["communication", "humor"],
    tags: ["conversation-starter"],
    priority: 7,
    tone: "sarcastic",
  },
 
  {
    prompt: "Tell me about the best trip you've been on...",
    category: "fun",
    requiredTraits: ["travel"],
    tags: ["travel", "story"],
    priority: 6,
    tone: "playful",
  },
 
  {
    prompt: "The next place on my travel bucket list...",
    category: "fun",
    requiredTraits: ["travel"],
    tags: ["travel", "goals"],
    priority: 7,
    tone: "chaotic",
  },
 
  {
    prompt: "I want someone to explore with...",
    category: "fun",
    requiredTraits: ["travel", "hobbies"],
    tags: ["travel", "adventure"],
    priority: 5,
    tone: "sarcastic",
  },
 
  {
    prompt: "Ask me anything about...",
    category: "fun",
    requiredTraits: ["communication"],
    tags: ["conversation-starter"],
    priority: 4,
    tone: "playful",
  },
 
  {
    prompt: "Fact about me that surprises people...",
    category: "fun",
    requiredTraits: ["humor", "communication"],
    tags: ["conversation-starter", "surprise"],
    priority: 6,
    tone: "chaotic",
  },
 
  {
    prompt: "This or that: mountains or beach...",
    category: "fun",
    requiredTraits: ["travel", "hobbies"],
    tags: ["game", "preferences"],
    priority: 3,
    tone: "sarcastic",
  },
 
  {
    prompt: "Together, we'd have the best debate about...",
    category: "fun",
    requiredTraits: ["communication", "values"],
    tags: ["debate", "conversation-starter"],
    priority: 3,
    tone: "playful",
  },
 
  {
    prompt: "Weirdest place I've fallen asleep...",
    category: "fun",
    requiredTraits: ["humor", "travel"],
    tags: ["story", "funny"],
    priority: 2,
    tone: "chaotic",
  },
 
  {
    prompt: "The story I tell at every party...",
    category: "fun",
    requiredTraits: ["humor", "communication"],
    tags: ["story", "funny"],
    priority: 4,
    tone: "sarcastic",
  },
 
  // ---------------------------------------------------------------------
  // RELATIONSHIP (16)
  // ---------------------------------------------------------------------
 
  {
    prompt: "I'm looking for...",
    category: "relationship",
    requiredTraits: ["relationships", "values"],
    tags: ["dating", "intentions"],
    priority: 9,
    tone: "emotional",
  },
 
  {
    prompt: "The dating history that gets brought up on every first date...",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["dating", "story"],
    priority: 9,
    tone: "thoughtful",
  },
 
  {
    prompt: "I want someone who...",
    category: "relationship",
    requiredTraits: ["relationships", "values"],
    tags: ["dating", "compatibility"],
    priority: 10,
    tone: "emotional",
  },
 
  {
    prompt: "My love language is...",
    category: "relationship",
    requiredTraits: ["relationships"],
    tags: ["love-language", "dating"],
    priority: 9,
    tone: "thoughtful",
    active: false, // ye bhi duplicate hai
  },
 
  {
    prompt: "Green flags I look for in a partner...",
    category: "relationship",
    requiredTraits: ["relationships", "values"],
    tags: ["green-flags", "dating"],
    priority: 7,
    tone: "emotional",
  },
 
  {
    prompt: "First round is on me if...",
    category: "relationship",
    requiredTraits: ["relationships", "humor"],
    tags: ["flirty", "date-idea"],
    priority: 9,
    tone: "thoughtful",
  },
 
  {
    prompt: "I know I've found the one when...",
    category: "relationship",
    requiredTraits: ["relationships", "values"],
    tags: ["dating", "intentions"],
    priority: 7,
    tone: "emotional",
  },
 
  {
    prompt: "The way to make me really happy...",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["flirty", "compatibility"],
    priority: 6,
    tone: "thoughtful",
  },
 
  {
    prompt: "My ideal first date...",
    category: "relationship",
    requiredTraits: ["relationships", "hobbies"],
    tags: ["date-idea"],
    priority: 6,
    tone: "emotional",
  },
 
  {
    prompt: "I want a partner who's better than me at...",
    category: "relationship",
    requiredTraits: ["relationships", "hobbies"],
    tags: ["compatibility"],
    priority: 5,
    tone: "thoughtful",
  },
 
  {
    prompt: "Fastest way to my heart...",
    category: "relationship",
    requiredTraits: ["relationships", "humor"],
    tags: ["flirty"],
    priority: 6,
    tone: "emotional",
  },
 
  {
    prompt: "I'll know it's time to introduce you to my friends when...",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["dating", "milestones"],
    priority: 6,
    tone: "thoughtful",
  },
 
  {
    prompt: "Our relationship would look like...",
    category: "relationship",
    requiredTraits: ["relationships", "lifestyle"],
    tags: ["compatibility"],
    priority: 4,
    tone: "emotional",
  },
 
  {
    prompt: "My biggest date fail...",
    category: "relationship",
    requiredTraits: ["relationships", "humor"],
    tags: ["dating", "story"],
    priority: 4,
    tone: "thoughtful",
  },
 
  {
    prompt: "I'm the type of partner who...",
    category: "relationship",
    requiredTraits: ["relationships", "values"],
    tags: ["dating", "compatibility"],
    priority: 2,
    tone: "emotional",
  },
 
  {
    prompt: "A relationship dealbreaker for me...",
    category: "relationship",
    requiredTraits: ["relationships", "values"],
    tags: ["dating", "boundaries"],
    priority: 3,
    tone: "thoughtful",
  },
 
  // ---------------------------------------------------------------------
  // VALUES (12)
  // ---------------------------------------------------------------------
 
  {
    prompt: "The most important thing I'm looking for...",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["values", "intentions"],
    priority: 9,
    tone: "thoughtful",
  },
 
  {
    prompt: "I'm passionate about...",
    category: "values",
    requiredTraits: ["values", "career"],
    tags: ["passion", "purpose"],
    priority: 8,
    tone: "emotional",
  },
 
  {
    prompt: "Something I'll never compromise on...",
    category: "values",
    requiredTraits: ["values"],
    tags: ["boundaries", "non-negotiables"],
    priority: 9,
    tone: "thoughtful",
  },
 
  {
    prompt: "A cause I care deeply about...",
    category: "values",
    requiredTraits: ["values"],
    tags: ["purpose", "community"],
    priority: 9,
    tone: "emotional",
  },
 
  {
    prompt: "The best advice I've ever received...",
    category: "values",
    requiredTraits: ["values", "career"],
    tags: ["wisdom", "growth"],
    priority: 6,
    tone: "thoughtful",
  },
 
  {
    prompt: "I believe...",
    category: "values",
    requiredTraits: ["values"],
    tags: ["beliefs"],
    priority: 6,
    tone: "emotional",
  },
 
  {
    prompt: "What I value most in a friendship...",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["friendship", "values"],
    priority: 6,
    tone: "thoughtful",
  },
 
  {
    prompt: "My personal growth journey has taught me...",
    category: "values",
    requiredTraits: ["values", "career"],
    tags: ["growth", "reflection"],
    priority: 5,
    tone: "emotional",
  },
 
  {
    prompt: "The family tradition I most want to carry on...",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["family", "tradition"],
    priority: 5,
    tone: "thoughtful",
  },
 
  {
    prompt: "I feel most myself when...",
    category: "values",
    requiredTraits: ["values", "lifestyle"],
    tags: ["authenticity", "reflection"],
    priority: 5,
    tone: "emotional",
  },
 
  {
    prompt: "Something I'm still figuring out...",
    category: "values",
    requiredTraits: ["values"],
    tags: ["growth", "honesty"],
    priority: 4,
    tone: "thoughtful",
  },
 
  {
    prompt: "What community means to me...",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["community", "purpose"],
    priority: 3,
    tone: "emotional",
  },

  // yaha se naye waale prompt add hue hain

  {
    prompt: "A quick rant about",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "A random fact I love is",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "An award my family would give me",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "Do you agree or disagree that",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "Don't hate me if I",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "I'll give you the set up, you guess the punchline",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "If loving this is wrong, I don't want to be right",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "My best Dad Joke",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "My best celebrity impression",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "Try to guess this about me",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "What if I told you that",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "You’d never know it, but I",
    category: "humor",
    requiredTraits: ["humor", "communication"],
    tags: ["humor"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "All I ask is that you",
    category: "fun",
    requiredTraits: ["communication"],
    tags: ["conversation"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "I could stay up all night talking about",
    category: "fun",
    requiredTraits: ["communication"],
    tags: ["conversation"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "I wish more people knew",
    category: "fun",
    requiredTraits: ["communication"],
    tags: ["conversation"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "The one thing I'd love to know about you is",
    category: "fun",
    requiredTraits: ["communication"],
    tags: ["conversation"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "The one thing you should know about me is",
    category: "fun",
    requiredTraits: ["communication"],
    tags: ["conversation"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "You should leave a comment if",
    category: "fun",
    requiredTraits: ["communication"],
    tags: ["conversation"],
    priority: 8,
    tone: "playful",
  },

  {
    prompt: "I feel proudest of who I am when",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "I'm in my element when",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "My happy place",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "My last journal entry was about",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "My self-care routine is",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "My therapist would say I",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "One thing I'll never do again",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "Something my pet thinks about me",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "Therapy recently taught me",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "Where I go when I want to feel a little more like myself",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "communication"],
    tags: ["personality"],
    priority: 7,
    tone: "thoughtful",
  },

  {
    prompt: "It’s not a vacation unless",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "hobbies"],
    tags: ["lifestyle"],
    priority: 7,
    tone: "playful",
  },

  {
    prompt: "What I order for the table",
    category: "lifestyle",
    requiredTraits: ["lifestyle", "hobbies"],
    tags: ["lifestyle"],
    priority: 7,
    tone: "playful",
  },

  {
    prompt: "I feel most supported when",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "I'll brag about you to my friends if",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "I'll fall for you if",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "Let's make sure we're on the same page about",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "My BFF's take on why you should date me",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "Something that's non-negotiable for me is",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "The best way to ask me out is by",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "We'll get along if",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "We're the same type of weird if",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "You should *not* go out with me if",
    category: "relationship",
    requiredTraits: ["relationships", "communication"],
    tags: ["relationships"],
    priority: 9,
    tone: "emotional",
  },

  {
    prompt: "In my friend group, I’m the one who",
    category: "relationship",
    requiredTraits: ["relationships", "values"],
    tags: ["friends-family"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "My chosen family is the best at",
    category: "relationship",
    requiredTraits: ["relationships", "values"],
    tags: ["friends-family"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "The kindest thing someone has ever done for me",
    category: "relationship",
    requiredTraits: ["relationships", "values"],
    tags: ["friends-family"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "Apparently, my life's soundtrack is",
    category: "lifestyle",
    requiredTraits: ["hobbies", "lifestyle"],
    tags: ["music"],
    priority: 7,
    tone: "playful",
  },

  {
    prompt: "Before we meet, you should listen to",
    category: "lifestyle",
    requiredTraits: ["hobbies", "lifestyle"],
    tags: ["music"],
    priority: 7,
    tone: "playful",
  },

  {
    prompt: "Guess the song",
    category: "lifestyle",
    requiredTraits: ["hobbies", "lifestyle"],
    tags: ["music"],
    priority: 7,
    tone: "playful",
  },

  {
    prompt: "Proof I have musical talent",
    category: "lifestyle",
    requiredTraits: ["hobbies", "lifestyle"],
    tags: ["music"],
    priority: 7,
    tone: "playful",
  },

  {
    prompt: "Best travel story",
    category: "lifestyle",
    requiredTraits: ["travel", "hobbies"],
    tags: ["travel"],
    priority: 7,
    tone: "playful",
  },

  {
    prompt: "Biggest risk I've taken",
    category: "lifestyle",
    requiredTraits: ["travel", "hobbies"],
    tags: ["travel"],
    priority: 7,
    tone: "playful",
  },

  {
    prompt: "Give me travel tips for",
    category: "lifestyle",
    requiredTraits: ["travel", "hobbies"],
    tags: ["travel"],
    priority: 7,
    tone: "playful",
  },

  {
    prompt: "Gender euphoria looks like",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["identity-community"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "How to pronounce my name",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["identity-community"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "I connect to my community by",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["identity-community"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "It feels affirming when others",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["identity-community"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "My favorite LGBTQIA+ book is",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["identity-community"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "My favorite LGBTQIA+-owned places",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["identity-community"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "My favorite off-brand LGBTQIA+ icon is",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["identity-community"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "The first time I knew I was gay was",
    category: "values",
    requiredTraits: ["values", "relationships"],
    tags: ["identity-community"],
    priority: 6,
    tone: "thoughtful",
  },

  {
    prompt: "My favorite line from a movie",
    category: "fun",
    requiredTraits: ["hobbies", "communication"],
    tags: ["creative"],
    priority: 6,
    tone: "playful",
  },

  {
    prompt: "Saying \"Hi!\" in as many languages I know",
    category: "fun",
    requiredTraits: ["hobbies", "communication"],
    tags: ["creative"],
    priority: 6,
    tone: "playful",
  },

  {
    prompt: "I wish I could tell the younger version of myself",
    category: "values",
    requiredTraits: ["career", "values"],
    tags: ["goals-growth"],
    priority: 7,
    tone: "thoughtful",
  },
];
async function seedPrompts() {
  try {
    await dbConnect();
    console.log("Connected to the database.");
    await PromptLibraryModel.deleteMany({});
    await PromptLibraryModel.insertMany(prompts);
    console.log("Prompts seeded successfully.");
  } catch (error) {
    console.error("Error seeding prompts:", error);
  } finally {
    process.exit(0);
  }
}
seedPrompts();