// ==========================================================
// Cute Cat Chat System
// Part 1 / 4
// UI Initialization + Helpers
// ==========================================================

{
    // ------------------------------------------------------
    // DOM REFERENCES
    // ------------------------------------------------------

    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');

    const chatOverlay = document.getElementById('chat-overlay');
    const chatActiveCatSprite = document.getElementById('chat-active-cat-sprite');

    const chatMessagesBox = document.getElementById('chat-messages-box');

    const chatTextInput = document.getElementById('chat-text-input');

    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMicBtn = document.getElementById('chat-mic-btn');

    // ------------------------------------------------------
    // CHAT SETTINGS
    // Easy place to customize later
    // ------------------------------------------------------

    const CHAT_CONFIG = {

        maxMessageLength: 250,

        autoScroll: true,

        saveChatHistory: true,

        thinkingDelay: {
            min: 500,
            max: 1200
        },

        thinkingMessages: [

            "Thinking...",

            "Cleaning my whiskers...",

            "Watching birds...",

            "Sharpening my claws...",

            "Sniffing around...",

            "Looking through memories...",

            "Stretching before answering...",

            "Chasing invisible bugs..."
        ]

    };

    // ------------------------------------------------------
    // RUNTIME VARIABLES
    // ------------------------------------------------------

    let recognition = null;
    let isRecording = false;

    // ------------------------------------------------------
    // OPEN CHAT
    // ------------------------------------------------------

    openChatBtn.addEventListener("click", () => {

        window.catInteractionEnabled = false;

        const currentCatSpriteSrc =
            document.getElementById("cat-sprite").src;

        chatActiveCatSprite.src = currentCatSpriteSrc;

        chatOverlay.classList.remove("hidden");

        chatOverlay.style.opacity = "0";

        setTimeout(() => {

            chatOverlay.style.opacity = "1";

        }, 10);

    });

    // ------------------------------------------------------
    // CLOSE CHAT
    // ------------------------------------------------------

    closeChatBtn.addEventListener("click", () => {

        chatOverlay.style.opacity = "0";

        setTimeout(() => {

            chatOverlay.classList.add("hidden");

            window.catInteractionEnabled = true;

            if (typeof window.startBlinkingLoop === "function") {

                window.startBlinkingLoop();

            }

            if (typeof window.returnToScene2 === "function") {

                window.returnToScene2();

            }

        }, 400);

    });

    // ------------------------------------------------------
    // VOICE INPUT
    // ------------------------------------------------------

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (SpeechRecognition) {

        recognition = new SpeechRecognition();

        recognition.lang = "en-US";

        recognition.continuous = false;

        recognition.onstart = () => {

            isRecording = true;

            chatMicBtn.classList.add("recording-active");

            chatTextInput.placeholder = "Listening closely...";

        };

        recognition.onresult = (event) => {

            chatTextInput.value =
                event.results[0][0].transcript;

        };

        recognition.onerror = cleanupMicState;

        recognition.onend = cleanupMicState;

        chatMicBtn.addEventListener("click", (e) => {

            e.stopPropagation();

            if (isRecording) {

                recognition.stop();

            } else {

                recognition.start();

            }

        });

    } else {

        chatMicBtn.style.display = "none";

    }

    function cleanupMicState() {

        isRecording = false;

        chatMicBtn.classList.remove("recording-active");

        chatTextInput.placeholder =
            "Whisper something to the cat...";

    }

    // ------------------------------------------------------
    // CHAT HELPERS
    // ------------------------------------------------------

    function appendMessageBubble(text, sender) {

        const bubble = document.createElement("div");

        bubble.classList.add(
            sender === "user"
                ? "user-bubble"
                : "ai-bubble"
        );

        bubble.textContent = text;

        chatMessagesBox.appendChild(bubble);

        if (CHAT_CONFIG.autoScroll) {

            chatMessagesBox.scrollTop =
                chatMessagesBox.scrollHeight;

        }

    }

    function appendThinkingBubble() {

        const bubble = document.createElement("div");

        bubble.classList.add(
            "ai-bubble",
            "system-bubble"
        );

        bubble.textContent =
            CHAT_CONFIG.thinkingMessages[
                Math.floor(
                    Math.random() *
                    CHAT_CONFIG.thinkingMessages.length
                )
            ];

        chatMessagesBox.appendChild(bubble);

        if (CHAT_CONFIG.autoScroll) {

            chatMessagesBox.scrollTop =
                chatMessagesBox.scrollHeight;

        }

        return bubble;

    }

// ------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------

    function removeThinkingBubble(bubble) {

        if (bubble && bubble.parentNode) {
            bubble.remove();
        }

    }

    function getCurrentUsername() {

        return (
            window.currentUserName ||
            localStorage.getItem("savedUserName") ||
            "Human"
        );

    }

    function detectCurrentCat() {

        const catSrc = chatActiveCatSprite.src.toLowerCase();

        if (catSrc.includes("witchcat")) return "witch";

        if (catSrc.includes("frostcat")) return "frost";

        if (catSrc.includes("japanesecat")) return "Japanese";

        if (catSrc.includes("goldencat")) return "Golden";

        return "orange";

    }

    async function saveChatMessage(username, catType, role, content) {

        if (!CHAT_CONFIG.saveChatHistory) return;

        if (!window.supabase?.from) {

            console.warn("Supabase not available.");

            return;

        }

        try {

            await window.supabase
                .from("cat_chat_history")
                .insert([
                    {
                        username,
                        cat_type: catType,
                        role,
                        content
                    }
                ]);

        } catch (err) {

            console.error("Failed to save chat:", err);

        }

    }

    function randomThinkingDelay() {

        const { min, max } = CHAT_CONFIG.thinkingDelay;

        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;

    }

    function wait(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));

    }

    // ------------------------------------------------------
    // CHAT EVENTS
    // ------------------------------------------------------

    chatSendBtn.addEventListener(
        "click",
        handleMessageSending
    );

    chatTextInput.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {

            handleMessageSending();

        }

    });

    // ------------------------------------------------------
    // MAIN MESSAGE HANDLER
    // Gemini has been completely removed.
    // Replies are now generated locally by CatBrain.
    // ------------------------------------------------------

    async function handleMessageSending() {

        const text = chatTextInput.value.trim();

        if (!text) return;

        if (text.length > CHAT_CONFIG.maxMessageLength) {

            appendMessageBubble(
                "Meow! That's a really long message. Try making it a little shorter.",
                "model"
            );

            return;

        }

        chatTextInput.value = "";

        appendMessageBubble(text, "user");

        const username = getCurrentUsername();

        const activeCat = detectCurrentCat();

        await saveChatMessage(
            username,
            activeCat,
            "user",
            text
        );

        const thinkingBubble =
            appendThinkingBubble();

        await wait(randomThinkingDelay());

        // --------------------------------------------------
        // CatBrain Hook
        // catbrain.js will provide this object.
        // --------------------------------------------------

        let reply;

        if (
            window.CatBrain &&
            typeof window.CatBrain.generateReply === "function"
        ) {

            reply =
                window.CatBrain.generateReply(
                    text,
                    activeCat
                );

        } else {

            reply =
                "Meow... My brain hasn't been loaded yet.";

        }

        removeThinkingBubble(thinkingBubble);
        // --------------------------------------------------
        // Display the reply
        // --------------------------------------------------

        appendMessageBubble(reply, "model");

        // --------------------------------------------------
        // Save Cat reply to Supabase
        // (Failure here should NEVER stop the chat.)
        // --------------------------------------------------

        await saveChatMessage(
            username,
            activeCat,
            "model",
            reply
        );

        // --------------------------------------------------
        // Future Extension Hooks
        // Uncomment and build these whenever you want.
        // --------------------------------------------------

        /*
        window.CatBrain.learn(text);

        window.CatBrain.updateMemory(
            username,
            text
        );

        window.CatBrain.detectEmotion(text);

        window.CatBrain.generateVoice(reply);

        window.CatBrain.generateImage(text);

        window.CatBrain.saveTopicHistory();
        */

    }

    // ------------------------------------------------------
    // PUBLIC DEBUG HELPERS
    // These are optional and useful while developing.
    // ------------------------------------------------------

    window.CatChat = {

        version: "1.0",

        config: CHAT_CONFIG,

        getCurrentCat: detectCurrentCat,

        getCurrentUsername: getCurrentUsername,

        appendMessage: appendMessageBubble,

        appendThinking: appendThinkingBubble,

        saveMessage: saveChatMessage

    };
    // ------------------------------------------------------
    // INITIALIZATION
    // Runs once when catchat.js loads.
    // Future startup logic can be added here.
    // ------------------------------------------------------

    (function initializeCatChat() {

        console.log("🐱 Cat Chat initialized.");

        // Future examples:
        // window.CatBrain.loadMemory();
        // window.CatBrain.preloadKnowledge();
        // window.CatBrain.warmup();

    })();

} // ===================== End of catchat.js =====================
