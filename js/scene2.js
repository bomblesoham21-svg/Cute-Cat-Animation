// Wrap code in a block scope to prevent global variable pollution
{
    const catSprite = document.getElementById('cat-sprite');
    const dialogueText = document.getElementById('dialogue-text');
    const scene2 = document.getElementById('scene-2');

    // Array of random pixel-style kitten quotes
    const catDialogues = [
        "Meow! What are we building today?",
        "Purr... that tickles!",
        "Did you bring any treats?",
        "Error 404: Catnap interrupted.",
        "I’m coding at 200 meows per minute.",
        "Everything looks perfect from up here!",
        "Can we check GitHub again?",
        "Feed me code (and tuna)!",
        "I wish I could fly like the birds!",
        "You look so cute 😽!",
        "Stop touching me 😾",
        "What are we doing today 😺?"
    ];

    let initialized = false;

    // 1. Monitor when Scene 2 reveals itself to trigger initial greeting
    const observer = new MutationObserver(() => {
        if (!scene2.classList.contains('hidden') && !initialized) {
            initialized = true;
            startScene2();
        }
    });

    observer.observe(scene2, { attributes: true, attributeFilter: ['class'] });

    function startScene2() {
        // Fetch the username saved from Scene 1
        const name = window.currentUserName || "Human";
        
        // Initial customized greeting
        dialogueText.textContent = `Hello, ${name}! Welcome to my world! 🐾`;

        // Start the realistic eye-blinking loop
        startBlinkingLoop();

        // Attach click behavior for random text generation
        catSprite.parentElement.addEventListener('click', triggerRandomDialogue);
    }

    // 2. Realistic Cat Blinking Loop
    function startBlinkingLoop() {
        setInterval(() => {
            // Switch to blink image
            catSprite.src = "assets/catblink.png";

            // Revert back to open eyes after a quick 150ms snap
            setTimeout(() => {
                catSprite.src = "assets/cat1.png";
            }, 150);

        }, 2900); // Blinks roughly every 2.9 seconds
    }

    // 3. Click handler for random dialogue strings
    function triggerRandomDialogue() {
        const randomIndex = Math.floor(Math.random() * catDialogues.length);
        dialogueText.textContent = catDialogues[randomIndex];
    }
}

