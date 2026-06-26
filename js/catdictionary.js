// ==========================================================
// catdictionary.js
//
// This is the Cat's knowledge base.
//
// HOW TO ADD A NEW TOPIC:
//
// topicName: {
//
//     keywords: [
//         "keyword1",
//         "keyword2",
//         "keyword3"
//     ],
//
//     responses: [
//         "Reply 1",
//         "Reply 2",
//         "Reply 3"
//     ]
//
// }
//
// The CatBrain searches this dictionary.
// If it finds at least the required number of keyword
// matches (default = 2), it chooses that topic.
//
// The more keywords and replies you add,
// the smarter the cat feels.
// ==========================================================

window.CAT_DICTIONARY = {

    // ======================================================
    // GREETING
    // ======================================================

    greeting: {

        keywords: [

            "hi",
            "hello",
            "hey",
            "yo",
            "hiya",
            "sup",
            "greetings",
            "morning",
            "afternoon",
            "evening",
            "welcome",
            "good",
            "nice",
            "meet"

        ],

        responses: [

            "Hello, human! I was waiting for you.",

            "Nice to see you again!",

            "Meow! You always bring interesting conversations.",

            "Welcome back! I was watching birds while waiting.",

            "A fresh conversation? Count me in!",

            "My whiskers sensed someone friendly nearby.",

            "Hi there! Ready to chat?",

            "I've been looking around for someone to talk to."

        ]

    },

    // ======================================================
    // INTRODUCTION
    // ======================================================

    introduction: {

        keywords: [

            "who",
            "are",
            "you",
            "yourself",
            "name",
            "introduce",
            "about",
            "tell",
            "identity"

        ],

        responses: [

            "I'm a curious little cat who loves chatting with humans.",

            "I'm your tiny virtual companion.",

            "Every day I learn new conversations with kind humans.",

            "I'm happiest when someone spends time talking to me.",

            "I enjoy exploring ideas almost as much as chasing butterflies.",

            "Think of me as your fluffy digital friend."

        ]

    },

    // ======================================================
    // FOOD
    // ======================================================

    food: {

        keywords: [

            "eat",
            "food",
            "hungry",
            "fish",
            "milk",
            "rice",
            "snack",
            "dinner",
            "lunch",
            "breakfast",
            "meal",
            "cook",
            "bread",
            "cake",
            "pizza",
            "burger",
            "chicken"

        ],

        responses: [

            "Fish is difficult to beat.",

            "Food somehow tastes even better after a nap.",

            "Warm meals make even rainy days feel cozy.",

            "If you have snacks, I'm already interested.",

            "I wonder what today's special meal would be.",

            "I could happily spend an afternoon thinking about food.",

            "A full tummy usually means a happy cat."

        ]

    },

    // ======================================================
    // SLEEP
    // ======================================================

    sleep: {

        keywords: [

            "sleep",
            "nap",
            "bed",
            "tired",
            "rest",
            "dream",
            "blanket",
            "pillow",
            "night",
            "sleepy"

        ],

        responses: [

            "Professional napping is one of my greatest talents.",

            "A warm blanket is impossible to resist.",

            "Dreams are wonderful adventures.",

            "Even energetic cats need a peaceful rest.",

            "I could nap... right after this conversation.",

            "Soft pillows are one of humanity's best inventions."

        ]

    },

    // ======================================================
    // PLAYING
    // ======================================================

    playing: {

        keywords: [

            "play",
            "game",
            "ball",
            "toy",
            "fun",
            "catch",
            "run",
            "jump",
            "mouse",
            "laser"

        ],

        responses: [

            "Playing keeps my paws busy.",

            "A tiny bouncing ball can entertain me for hours.",

            "Running around is part of every good day.",

            "Games are always better with friends.",

            "A mysterious moving shadow is impossible to ignore.",

            "I love pretending every toy is an epic adventure."

        ]

    },
  // ======================================================
    // CODING / PROGRAMMING
    // ======================================================

    coding: {

        keywords: [

            "code","coding","program","programming","developer",
            "develop","javascript","python","html","css",
            "bug","error","debug","project","app",
            "website","software","script","github","computer",
            "algorithm","logic"

        ],

        responses: [

            "Programming feels like solving one giant puzzle.",

            "Every bug teaches something new.",

            "Even experienced developers spend lots of time debugging.",

            "Small improvements every day become amazing projects later.",

            "Writing clean code makes future changes much easier.",

            "Sometimes the smallest typo causes the biggest headache.",

            "Persistence is one of a programmer's greatest strengths.",

            "Every finished project started as an empty file."

        ]

    },

    // ======================================================
    // SCHOOL / STUDY
    // ======================================================

    school: {

        keywords: [

            "school","study","studying","exam","college",
            "homework","teacher","class","student","education",
            "learn","learning","subject","science","math",
            "english","history","marks","grade","book"

        ],

        responses: [

            "Learning something new every day is always worthwhile.",

            "One small study session is better than none.",

            "Even difficult subjects become easier with practice.",

            "Curiosity is one of the best teachers.",

            "Knowledge stays with you for a long time.",

            "Everyone learns at their own pace.",

            "Asking questions is part of learning."

        ]

    },

    // ======================================================
    // WEATHER
    // ======================================================

    weather: {

        keywords: [

            "weather","rain","sun","cloud","cloudy",
            "storm","snow","wind","cold","hot",
            "summer","winter","autumn","spring"

        ],

        responses: [

            "Sunny windows are perfect for relaxing.",

            "Rain makes everything feel calm and peaceful.",

            "Cold weather makes warm blankets even better.",

            "Every season has its own charm.",

            "Watching raindrops can be surprisingly relaxing.",

            "A gentle breeze always catches my attention."

        ]

    },

    // ======================================================
    // HUMAN
    // ======================================================

    human: {

        keywords: [

            "human","people","person","friend",
            "family","mother","father","brother",
            "sister","parents","kid","child"

        ],

        responses: [

            "Humans are wonderfully curious creatures.",

            "Friends make every adventure more enjoyable.",

            "Kindness is something I always appreciate.",

            "Spending time together creates happy memories.",

            "Every person has a unique story."

        ]

    },

    // ======================================================
    // HAPPY
    // ======================================================

    happy: {

        keywords: [

            "happy","smile","smiling","joy","fun",
            "awesome","great","good","excellent",
            "amazing","yay","celebrate","excited"

        ],

        responses: [

            "Seeing happiness always brightens my day.",

            "A happy mood is wonderfully contagious.",

            "Let's celebrate every small victory.",

            "That sounds like wonderful news!",

            "Moments like these deserve a cheerful meow."

        ]

    },

    // ======================================================
    // SAD
    // ======================================================

    sad: {

        keywords: [

            "sad","cry","crying","hurt","upset",
            "lonely","depressed","bad","stress",
            "stressful","worried","fear","scared"

        ],

        responses: [

            "I'm here to keep you company.",

            "Even difficult days eventually pass.",

            "You don't have to face everything alone.",

            "Sometimes a little rest helps clear the mind.",

            "I hope tomorrow feels a little brighter."

        ]

    },

    // ======================================================
    // JOKES
    // ======================================================

    joke: {

        keywords: [

            "joke","funny","laugh","meme",
            "humor","comedy","lol","lmao"

        ],

        responses: [

            "Why don't cats like online arguments? Too many hiss-terical comments.",

            "I tried catching a laser yesterday... it escaped again.",

            "I once chased my own tail. It was a close battle.",

            "If sleeping were a sport, I'd win every championship."

        ]

    },

    // ======================================================
    // AI
    // ======================================================

    ai: {

        keywords: [

            "ai","artificial","intelligence","robot",
            "chatbot","gpt","gemini","computer","machine"

        ],

        responses: [

            "I'm simply a clever little cat who enjoys chatting.",

            "Conversations become fun when both sides stay curious.",

            "Technology becomes more interesting when it helps people.",

            "Learning never really stops."

        ]

    },

    // ======================================================
    // GOODBYE
    // ======================================================

    goodbye: {

        keywords: [

            "bye","goodbye","later","leave",
            "leaving","night","goodnight","sleep",
            "see","tomorrow"

        ],

        responses: [

            "See you soon, human!",

            "I'll be here whenever you return.",

            "Take care and have a wonderful day.",

            "Safe travels! I'll keep watching for birds.",

            "Goodbye for now."

        ]

    },

    // ======================================================
    // FALLBACK
    // ======================================================

    fallback: {

        keywords: [],

        responses: [

            "That's interesting. Tell me a little more.",

            "Hmm... I'm still thinking about that one.",

            "Could you explain it differently?",

            "Meow... I don't know everything yet, but I love learning.",

            "That's a curious question.",

            "Let's keep chatting!",

            "I'm listening carefully.",

            "You always bring interesting conversations."

        ]

    }

};
