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
        "I'm coding at 200 meows per minute.",
        "Everything looks perfect from up here!",
        "Can we check GitHub again?",
        "Feed me code (and tuna)!",
        "I wish I could fly like the birds!",
        "You look so cute 😽!",
        "Stop touching me 😾",
        "What are we doing today 😺?"
    ];

    let initialized = false;
    let isFeeding = false;
    let blinkingTimeout = null;

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
        catSprite.addEventListener('click', triggerRandomDialogue);

        // Setup feeding system
        setupFeedingSystem();

        // Setup scene 2 background gradient
        initKittenBackground();
    }

    // 2. Realistic Cat Blinking Loop
    function startBlinkingLoop() {
        function blink() {
            // Switch to blink image
            catSprite.src = "assets/catblink.png";

            // Revert back to open eyes after a quick 150ms snap
            setTimeout(() => {
                catSprite.src = "assets/cat1.png";
                // Schedule next blink
                blinkingTimeout = setTimeout(blink, 2900);
            }, 150);
        }

        // Start the blinking cycle
        blinkingTimeout = setTimeout(blink, 2900);
    }

    // 3. Click handler for random dialogue strings
    function triggerRandomDialogue() {
        const randomIndex = Math.floor(Math.random() * catDialogues.length);
        dialogueText.textContent = catDialogues[randomIndex];
    }

    // 4. Feeding System
    function setupFeedingSystem() {
        const feedBtn = document.querySelector('.feed-btn');
        if (!feedBtn || !catSprite) return;

        feedBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering dialogue on click

            if (isFeeding) return;
            isFeeding = true;

            // Clear the current blinking timeout
            if (blinkingTimeout) clearTimeout(blinkingTimeout);

            // Store the current sprite src to restore later
            const originalSpriteSrc = catSprite.src;

            // Change to eating sprite
            catSprite.src = 'assets/cateat.png';
            dialogueText.textContent = "Nom nom nom! 😋";

            // Restore after feeding animation
            setTimeout(() => {
                catSprite.src = originalSpriteSrc;
                dialogueText.textContent = "Thanks! That was yummy! 🐱";
                isFeeding = false;
                
                // Resume blinking loop
                startBlinkingLoop();
            }, 1500);
        });
    }

    // 5. Scene 2 Background Gradient Animation
    function initKittenBackground() {
        const canvas = document.getElementById('gradient-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Premium Soft Pastel Kitten Palette
        const palette = {
            base: { r: 255, g: 245, b: 246 }, // Pale Dreamy White Base
            c1: { r: 255, g: 214, b: 220 },   // Soft Blush Pink
            c2: { r: 244, g: 232, b: 250 },   // Light Lavender Mist
            c3: { r: 224, g: 140, b: 195 }    // Soft, Gentle Magenta
        };

        let tick = 0;

        function drawKittenFluid() {
            // Super slow, airy, whimsical movement pace
            tick += 0.0012;

            // 1. Fill base pale white layer
            ctx.fillStyle = `rgb(${palette.base.r}, ${palette.base.g}, ${palette.base.b})`;
            ctx.fillRect(0, 0, width, height);

            // 2. Layer 1: Soft Blush Pink drifting flow
            const x1 = width * 0.5 + Math.sin(tick * 1.1 + 1.5) * (width * 0.2);
            const y1 = height * 0.5 + Math.cos(tick * 0.9 + 0.5) * (height * 0.2);
            const r1 = Math.max(width, height) * 0.75;
            let g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
            g1.addColorStop(0, `rgba(${palette.c1.r}, ${palette.c1.g}, ${palette.c1.b}, 0.8)`);
            g1.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, width, height);

            // 3. Layer 2: Lavender Mist glow bleed
            ctx.globalCompositeOperation = 'multiply';
            const x2 = width * 0.3 + Math.cos(tick * 0.8) * (width * 0.25);
            const y2 = height * 0.7 + Math.sin(tick * 1.2) * (height * 0.15);
            const r2 = Math.max(width, height) * 0.6;
            let g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
            g2.addColorStop(0, `rgba(${palette.c2.r}, ${palette.c2.g}, ${palette.c2.b}, 0.6)`);
            g2.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, width, height);

            // 4. Layer 3: Soft Dreamy Magenta accents
            ctx.globalCompositeOperation = 'screen';
            const x3 = width * 0.7 + Math.sin(tick * 0.9) * (width * 0.2);
            const y3 = height * 0.2 + Math.cos(tick * 1.0) * (height * 0.2);
            const r3 = Math.max(width, height) * 0.55;
            let g3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, r3);
            g3.addColorStop(0, `rgba(${palette.c3.r}, ${palette.c3.g}, ${palette.c3.b}, 0.45)`);
            g3.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = g3;
            ctx.fillRect(0, 0, width, height);

            // Reset system blend mode so cat graphics render cleanly
            ctx.globalCompositeOperation = 'source-over';

            requestAnimationFrame(drawKittenFluid);
        }

        drawKittenFluid();
    }
}
