// ==========================================================
// catbrain.js
// Local AI Engine for Cute Cat Animation
//
// Responsibilities:
// - Normalize user messages
// - Detect topics
// - Select reply category
// - Apply cat personality
// - Generate final reply
//
// This file NEVER touches the UI.
// It only returns strings.
//
// Future additions:
// - Emotion detection
// - Conversation memory
// - Context awareness
// - Multi-topic replies
// ==========================================================

(function () {

    "use strict";

    // ------------------------------------------------------
    // Main Brain Object
    // ------------------------------------------------------

    const CatBrain = {};

    // ------------------------------------------------------
    // Internal State
    // ------------------------------------------------------

    CatBrain.memory = {

        previousTopics: [],

        previousReplies: [],

        recentMessages: []

    };

    // ------------------------------------------------------
    // Settings
    // ------------------------------------------------------

    CatBrain.settings = {

        minimumKeywordMatches: 2,

        maximumMemory: 20,

        randomizeReplies: true

    };

    // ------------------------------------------------------
    // Normalize User Message
    // ------------------------------------------------------

    CatBrain.normalize = function (message) {

        return message
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    };

    // ------------------------------------------------------
    // Split Message into Words
    // ------------------------------------------------------

    CatBrain.tokenize = function (message) {

        return CatBrain
            .normalize(message)
            .split(" ")
            .filter(Boolean);

    };

    // ------------------------------------------------------
    // Count keyword matches
    // ------------------------------------------------------

    CatBrain.countKeywordMatches = function (tokens, keywords) {

        let matches = 0;

        keywords.forEach(keyword => {

            if (tokens.includes(keyword.toLowerCase())) {

                matches++;

            }

        });

        return matches;

    };

    // ------------------------------------------------------
    // Detect Topic
    // Uses CAT_DICTIONARY from catdictionary.js
    // ------------------------------------------------------

    CatBrain.detectTopic = function (message) {

        const tokens = CatBrain.tokenize(message);

        let bestTopic = "fallback";

        let highestScore = 0;

        for (const topic in window.CAT_DICTIONARY) {

            const category =
                window.CAT_DICTIONARY[topic];

            const score =
                CatBrain.countKeywordMatches(
                    tokens,
                    category.keywords
                );

            if (
                score >= CatBrain.settings.minimumKeywordMatches &&
                score > highestScore
            ) {

                highestScore = score;

                bestTopic = topic;

            }

        }

        return bestTopic;

    };

    // ------------------------------------------------------
    // Pick Random Reply
    // ------------------------------------------------------

    CatBrain.pickRandomReply = function (array) {

        if (!array || array.length === 0) {

            return "Meow.";

        }

        return array[
            Math.floor(
                Math.random() * array.length
            )
        ];

    };
  // ------------------------------------------------------
    // Prevent repeating the exact same reply
    // ------------------------------------------------------

    CatBrain.isRecentReply = function (reply) {

        return CatBrain.memory.previousReplies.includes(reply);

    };

    CatBrain.rememberReply = function (reply) {

        CatBrain.memory.previousReplies.push(reply);

        if (
            CatBrain.memory.previousReplies.length >
            CatBrain.settings.maximumMemory
        ) {

            CatBrain.memory.previousReplies.shift();

        }

    };

    // ------------------------------------------------------
    // Remember user message
    // ------------------------------------------------------

    CatBrain.rememberMessage = function (message) {

        CatBrain.memory.recentMessages.push(message);

        if (
            CatBrain.memory.recentMessages.length >
            CatBrain.settings.maximumMemory
        ) {

            CatBrain.memory.recentMessages.shift();

        }

    };

    // ------------------------------------------------------
    // Remember detected topic
    // ------------------------------------------------------

    CatBrain.rememberTopic = function (topic) {

        CatBrain.memory.previousTopics.push(topic);

        if (
            CatBrain.memory.previousTopics.length >
            CatBrain.settings.maximumMemory
        ) {

            CatBrain.memory.previousTopics.shift();

        }

    };

    // ------------------------------------------------------
    // Personality Formatting
    // CAT_PERSONALITIES comes from
    // catpersonalities.js
    // ------------------------------------------------------

    CatBrain.applyPersonality = function (
        reply,
        catType
    ) {

        const personality =
            window.CAT_PERSONALITIES?.[catType];

        if (!personality) {

            return reply;

        }

        const intro =
            CatBrain.pickRandomReply(
                personality.intros || [""]
            );

        const ending =
            CatBrain.pickRandomReply(
                personality.endings || [""]
            );

        return `${intro} ${reply} ${ending}`.trim();

    };

    // ------------------------------------------------------
    // Get Reply Pool
    // ------------------------------------------------------

    CatBrain.getReplyPool = function (topic) {

        const category =
            window.CAT_DICTIONARY?.[topic];

        if (
            category &&
            Array.isArray(category.responses)
        ) {

            return category.responses;

        }

        return (
            window.CAT_DICTIONARY?.fallback
                ?.responses ||
            ["Meow."]
        );

    };

    // ------------------------------------------------------
    // Choose a reply
    // Avoid repeating recent ones when possible
    // ------------------------------------------------------

    CatBrain.selectReply = function (topic) {

        const pool =
            CatBrain.getReplyPool(topic);

        if (pool.length === 1) {

            return pool[0];

        }

        let attempts = 0;

        while (attempts < 10) {

            const candidate =
                CatBrain.pickRandomReply(pool);

            if (
                !CatBrain.isRecentReply(candidate)
            ) {

                CatBrain.rememberReply(candidate);

                return candidate;

            }

            attempts++;

        }

        const fallback =
            CatBrain.pickRandomReply(pool);

        CatBrain.rememberReply(fallback);

        return fallback;

    };
  // ------------------------------------------------------
    // Main Reply Generator
    // This is the ONLY function catchat.js calls.
    // ------------------------------------------------------

    CatBrain.generateReply = function (
        message,
        catType = "orange"
    ) {

        // Remember user's message
        CatBrain.rememberMessage(message);

        // Detect conversation topic
        const topic =
            CatBrain.detectTopic(message);

        // Save topic to memory
        CatBrain.rememberTopic(topic);

        // Select a suitable reply
        let reply =
            CatBrain.selectReply(topic);

        // Apply the selected cat's personality
        reply =
            CatBrain.applyPersonality(
                reply,
                catType
            );

        return reply;

    };

    // ------------------------------------------------------
    // Public Utility Methods
    // These make future upgrades easy.
    // ------------------------------------------------------

    CatBrain.getMemory = function () {

        return {

            previousTopics: [
                ...CatBrain.memory.previousTopics
            ],

            previousReplies: [
                ...CatBrain.memory.previousReplies
            ],

            recentMessages: [
                ...CatBrain.memory.recentMessages
            ]

        };

    };

    CatBrain.clearMemory = function () {

        CatBrain.memory.previousTopics = [];

        CatBrain.memory.previousReplies = [];

        CatBrain.memory.recentMessages = [];

    };

    CatBrain.getVersion = function () {

        return "1.0.0";

    };

    // ------------------------------------------------------
    // Future Hooks
    // (Implement whenever you want)
    // ------------------------------------------------------

    CatBrain.detectEmotion = function (message) {

        // Future:
        // Return "happy", "sad", "angry",
        // "excited", "confused", etc.

        return "neutral";

    };

    CatBrain.learnWord = function (
        topic,
        keyword
    ) {

        // Future:
        // Add new keywords dynamically.

    };

    CatBrain.learnReply = function (
        topic,
        reply
    ) {

        // Future:
        // Add replies while the game is running.

    };

    CatBrain.exportMemory = function () {

        return JSON.stringify(
            CatBrain.memory,
            null,
            2
        );

    };

    // ------------------------------------------------------
    // Expose globally
    // ------------------------------------------------------

    window.CatBrain = CatBrain;

})();
