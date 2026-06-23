// Wrap code in a block scope to prevent global variable pollution
{
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatOverlay = document.getElementById('chat-overlay');
    const chatActiveCatSprite = document.getElementById('chat-active-cat-sprite');
    const chatMessagesBox = document.getElementById('chat-messages-box');
    const chatTextInput = document.getElementById('chat-text-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMicBtn = document.getElementById('chat-mic-btn');

    let recognition = null;
    let isRecording = false;

    // 1. INITIALIZE TRANSITION TO CHAT MODE
    openChatBtn.addEventListener('click', () => {
        // Freeze scene2.js blinking loops and event click actions
        window.catInteractionEnabled = false;

        // Get the active cat character from scene2.js scope state
        // We look at the image source currently showing on the main scene 2 canvas
        const currentCatSpriteSrc = document.getElementById('cat-sprite').src;
        
        // Match the exact sprite frame over to the chat window stage
        chatActiveCatSprite.src = currentCatSpriteSrc;

        // Smoothly fade-in/reveal the premium dark grainy chat window layout
        chatOverlay.classList.remove('hidden');
        chatOverlay.style.opacity = '0';
        setTimeout(() => {
            chatOverlay.style.opacity = '1';
        }, 10);
    });

    // 2. EXIT CHAT MODE & HAND BACK CONTROL TO SCENE 2
    closeChatBtn.addEventListener('click', () => {
        chatOverlay.style.opacity = '0';
        
        setTimeout(() => {
            chatOverlay.classList.add('hidden');
            
            // Unfreeze scene2.js interactions and reboot the natural blinking loop
            window.catInteractionEnabled = true;
            
            // Re-sync the core game sprite just in case changes happened
            const currentCatType = document.getElementById('cat-sprite').src;
            if (typeof window.startBlinkingLoop === 'function') {
                window.startBlinkingLoop();
            }
        }, 400); // Matches the CSS transition delay duration smoothly
    });

    // 3. VOICE INPUT SYSTEM (SPEECH TO TEXT)
    // Checks native web-audio recognition availability in modern browsers
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop listening automatically when user stops speaking
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isRecording = true;
            chatMicBtn.classList.add('recording-active');
            chatTextInput.placeholder = "Listening closely...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatTextInput.value = transcript; // Injects spoken phrase straight to input box
        };

        recognition.onerror = () => {
            cleanupMicState();
        };

        recognition.onend = () => {
            cleanupMicState();
        };

        chatMicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isRecording) {
                recognition.start();
            } else {
                recognition.stop();
            }
        });
    } else {
        // Hide microphone if browser doesn't natively support SpeechRecognition
        chatMicBtn.style.display = 'none';
    }

    function cleanupMicState() {
        isRecording = false;
        chatMicBtn.classList.remove('recording-active');
        chatTextInput.placeholder = "Whisper something to the cat...";
    }

    // 4. CHAT LOG APPENDER HELPERS
    function appendMessageBubble(text, sender) {
        const bubble = document.createElement('div');
        bubble.classList.add(sender === 'user' ? 'user-bubble' : 'ai-bubble');
        bubble.textContent = text;
        chatMessagesBox.appendChild(bubble);
        
        // Keep view pinned to bottom on fresh additions
        chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
    }

    // 5. MESSAGE TRANSMISSION DISPATCHER
    chatSendBtn.addEventListener('click', handleMessageSending);
    chatTextInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleMessageSending();
    });

    async function handleMessageSending() {
        const text = chatTextInput.value.trim();
        if (!text) return;

        // Clear input element immediately for snappy feel
        chatTextInput.value = '';

        // Render user speech locally
        appendMessageBubble(text, 'user');

        // Extract username and current profile tracking context
        const currentName = window.currentUserName || localStorage.getItem('savedUserName') || "Human";
        
        // Dynamically detect which layout profile is active by tracking standard path structures
        let activeCatKey = "orange";
        const catSrc = chatActiveCatSprite.src;
        if (catSrc.includes('witchcat')) activeCatKey = "witch";
        else if (catSrc.includes('frostcat')) activeCatKey = "frost";
        else if (catSrc.includes('Japanesecat')) activeCatKey = "Japanese";
        else if (catSrc.includes('Goldencat')) activeCatKey = "Golden";

        // Placeholder logic to show system processing state
        const loadingIndicator = document.createElement('div');
        loadingIndicator.classList.add('ai-bubble', 'system-bubble');
        loadingIndicator.textContent = "Cat is thinking...";
        chatMessagesBox.appendChild(loadingIndicator);

        try {
            // STEP 4A: Save User message to Supabase
            // (Assuming your supabase client is globally initialized in supabase.js as `window.supabase`)
            if (window.supabase) {
                await window.supabase.from('cat_chat_history').insert([
                    { username: currentName, cat_type: activeCatKey, role: 'user', content: text }
                ]);
            }

            // STEP 4B: Call Vercel Serverless Function (Gemini Route)
            // Replace '/api/gemini-chat' with your relative Vercel deployment route later
            const response = await fetch('/api/gemini-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: currentName,
                    catType: activeCatKey,
                    message: text
                })
            });

            const data = await response.json();
            
            // Wipe out loading text state 
            loadingIndicator.remove();

            if (data.reply) {
                appendMessageBubble(data.reply, 'model');

                // STEP 4C: Save AI Response reply back to Supabase
                if (window.supabase) {
                    await window.supabase.from('cat_chat_history').insert([
                        { username: currentName, cat_type: activeCatKey, role: 'model', content: data.reply }
                    ]);
                }
            } else {
                appendMessageBubble("Meow... I couldn't reach my brain wires. Try again?", 'model');
            }

        } catch (error) {
            loadingIndicator.remove();
            appendMessageBubble("Error linking up... Meow! 😿", 'model');
            console.error("Transmission error:", error);
        }
    }
}
