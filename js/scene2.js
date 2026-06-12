// Wrap code in a block scope to prevent global variable pollution
{
    const catSprite = document.getElementById('cat-sprite');
    const dialogueText = document.getElementById('dialogue-text');
    const scene2 = document.getElementById('scene-2');
    const petCountEl = document.getElementById('pet-count');
    const feedCountEl = document.getElementById('feed-count');

    // NEW: Asset configuration mapping for both cat options
    const catAssets = {
        orange: { prefix: 'cat1', folder: 'cat1' },
        witch: { prefix: 'cat2', folder: 'witchcat' }
    };
    let currentCat = 'orange'; // Default active track

    // Helper to dynamically get image paths based on active cat variant
    function getCatAsset(type) {
        const cat = catAssets[currentCat];
        return `assets/${cat.folder}/${cat.prefix}${type}.png`;
    }

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
        "You look so cute {name} 😽!",
        "Stop touching me {name} 😾",
        "{name},what are we doing today 😺?"
    ];

    // Counters
    let petCount = 0;
    let feedCount = 0;
    let initialized = false;
    let isFeeding = false;
    let blinkingTimeout = null;
    let happyTimeout = null;

    // 1. Monitor when Scene 2 reveals itself to trigger initial greeting
    const observer = new MutationObserver(() => {
        if (!scene2.classList.contains('hidden') && !initialized) {
            initialized = true;
            startScene2();
        }
    });

    observer.observe(scene2, { attributes: true, attributeFilter: ['class'] });

    function startScene2() {
        const name = window.currentUserName || localStorage.getItem('savedUserName') || "Human";
        
        if (name !== "Human") {
            localStorage.setItem('savedUserName', name);
        }
        
        dialogueText.textContent = `Hello, ${name}! Welcome to my world! 🐾`;

        startBlinkingLoop();
        catSprite.addEventListener('click', onCatPet);
        setupFeedingSystem();
        setupCatSelectionSystem(); // NEW: Fire selector setup
        initKittenBackground();
    }

    // 2. Pet the cat - shows happy image and increments pet count
    function onCatPet() {
        petCount++;
        petCountEl.textContent = petCount;

        if (happyTimeout) clearTimeout(happyTimeout);
        if (blinkingTimeout) clearTimeout(blinkingTimeout);

        // MODIFIED: Uses dynamic pathing
        catSprite.src = getCatAsset('happy');

        const name = window.currentUserName || localStorage.getItem('savedUserName') || "Human";
        const randomIndex = Math.floor(Math.random() * catDialogues.length);
        let chosenDialogue = catDialogues[randomIndex];
        chosenDialogue = chosenDialogue.replace("{name}", name);
        dialogueText.textContent = chosenDialogue;

        happyTimeout = setTimeout(() => {
            // MODIFIED: Uses dynamic pathing base (empty string yields 'cat1.png' or 'cat2.png')
            catSprite.src = getCatAsset('');
            startBlinkingLoop();
        }, 800);
    }

    // 3. Realistic Cat Blinking Loop
    function startBlinkingLoop() {
        function blink() {
            // MODIFIED: Uses dynamic pathing
            catSprite.src = getCatAsset('blink');

            setTimeout(() => {
                // MODIFIED: Uses dynamic pathing base
                catSprite.src = getCatAsset('');
                blinkingTimeout = setTimeout(blink, 2900);
            }, 150);
        }
        blinkingTimeout = setTimeout(blink, 2900);
    }

    // 4. Feeding System
    function setupFeedingSystem() {
        const feedBtn = document.querySelector('.feed-btn');
        if (!feedBtn || !catSprite) return;

        feedBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 

            if (isFeeding) return;
            isFeeding = true;

            feedCount++;
            feedCountEl.textContent = feedCount;

            if (blinkingTimeout) clearTimeout(blinkingTimeout);
            if (happyTimeout) clearTimeout(happyTimeout);

            // MODIFIED: Uses dynamic pathing
            catSprite.src = getCatAsset('eat');
            dialogueText.textContent = "Nom nom nom! 😋";

            // after feeding animation
            setTimeout(() => {
                // MODIFIED: Uses dynamic pathing base
                catSprite.src = getCatAsset('');
                dialogueText.textContent = "Thanks! That was yummy! 🐱";
                isFeeding = false;
                
                startBlinkingLoop();
            }, 1500);
        });
    }

    // 5. NEW: Cat Selection Menu Engine
    function setupCatSelectionSystem() {
        const selectBtn = document.getElementById('select-cat-btn');
        const dropdown = document.getElementById('cat-dropdown');

        // Toggle drop up display
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        // Dynamic change processor
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                currentCat = item.getAttribute('data-cat');
                
                // Instantly update current sprite frame base
                catSprite.src = getCatAsset('');
                
                // Close menu
                dropdown.classList.add('hidden');

                // Hard reset loop syncs to prevent graphic conflicts 
                if (blinkingTimeout) clearTimeout(blinkingTimeout);
                if (happyTimeout) clearTimeout(happyTimeout);
                isFeeding = false;
                startBlinkingLoop();
            });
        });

        // Universal close hook if user clicks away
        document.addEventListener('click', () => dropdown.classList.add('hidden'));
    }
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
