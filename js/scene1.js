document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gradient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let animationFrameId; // For cancelling animation on transition

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);

    // Premium Color Palette Configuration
    const colors = [
        { r: 230, g: 57, b: 70 },   // Crimson Red (#e63946)
        { r: 139, g: 0, b: 0 },     // Deep Wine (#8b0000)
        { r: 255, g: 179, b: 179 }, // Soft Coral Pink (#ffb3b3)
        { r: 26, g: 26, b: 46 }     // Velvet Night Base (#1a1a2e)
    ];

    let tick = 0;

    function animateGradient() {
        // Much slower, cinematic pace
        tick += 0.0015; 

        // Clear with base deep tone
        ctx.fillStyle = `rgb(${colors[3].r}, ${colors[3].g}, ${colors[3].b})`;
        ctx.fillRect(0, 0, width, height);

        // Layer 1: Crimson Flow
        const x1 = width * 0.5 + Math.sin(tick * 1.2 + 2) * (width * 0.25);
        const y1 = height * 0.5 + Math.cos(tick * 0.8 + 1) * (height * 0.25);
        const r1 = Math.max(width, height) * 0.6;
        let g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
        g1.addColorStop(0, `rgba(${colors[0].r}, ${colors[0].g}, ${colors[0].b}, 0.8)`);
        g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        // Layer 2: Soft Highlights (Creates the premium bleeding glow)
        ctx.globalCompositeOperation = 'screen'; 
        const x2 = width * 0.4 + Math.cos(tick * 0.7) * (width * 0.3);
        const y2 = height * 0.6 + Math.sin(tick * 1.4) * (height * 0.2);
        const r2 = Math.max(width, height) * 0.5;
        let g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
        g2.addColorStop(0, `rgba(${colors[2].r}, ${colors[2].g}, ${colors[2].b}, 0.4)`);
        g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);

        // Layer 3: Deep Velvet Undertones
        ctx.globalCompositeOperation = 'multiply';
        const x3 = width * 0.6 + Math.sin(tick * 0.9) * (width * 0.2);
        const y3 = height * 0.3 + Math.cos(tick * 1.1) * (height * 0.3);
        const r3 = Math.max(width, height) * 0.7;
        let g3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, r3);
        g3.addColorStop(0, `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 0.9)`);
        g3.addColorStop(1, 'rgba(255, 255, 255, 1)');
        ctx.fillStyle = g3;
        ctx.fillRect(0, 0, width, height);

        // Reset blend mode for UI layer clarity
        ctx.globalCompositeOperation = 'source-over';

        animationFrameId = requestAnimationFrame(animateGradient);
    }

    // Start the background animation
    animateGradient();

    // Scene Transition Control
    const confirmBtn = document.getElementById('confirm-btn');
    const usernameInput = document.getElementById('username-input');
    const scene1 = document.getElementById('scene-1');
    const scene2 = document.getElementById('scene-2');

    if (confirmBtn && usernameInput) {
        confirmBtn.addEventListener('click', async () => {
            const username = usernameInput.value.trim();
            
            if (username === "") {
                alert("Please enter your name first!");
                return;
            }
            
            // Send data to Supabase
            await supabaseClient
                .from('visitors')
                .insert([{ username: username }]);
                
            window.currentUserName = username;
            
            // 1. Trigger your CSS opacity transitions immediately
            if (scene1) scene1.classList.add('hidden');
            if (scene2) scene2.classList.remove('hidden');
            
            // 2. Wait exactly 1 second (matching your CSS 1s ease-in-out transition) 
            // before turning off the canvas loop to prevent any visual stuttering.
            setTimeout(() => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            }, 1000);
        });
    }
});
