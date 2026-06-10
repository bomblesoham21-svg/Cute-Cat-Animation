// --- 1. Realistic Fluid Gradient Ripple Setup ---
const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Handle window resizing seamlessly
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

let tick = 0;

function animateGradient() {
    tick += 0.005; // Controls the speed of the ripples/blending

    // Create a dynamic radial gradient moving in a subtle infinite loop
    const x1 = width / 2 + Math.sin(tick * 1.5) * (width * 0.2);
    const y1 = height / 2 + Math.cos(tick * 2) * (height * 0.2);
    const r1 = Math.min(width, height) * 0.4 + Math.sin(tick) * 50;

    const x2 = width / 2 + Math.cos(tick * 0.8) * (width * 0.3);
    const y2 = height / 2 + Math.sin(tick * 1.2) * (height * 0.3);
    const r2 = Math.min(width, height) * 0.8;

    const gradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);

    // Color stops blending Red and White beautifully
    gradient.addColorStop(0, '#fff5f5');       // Soft White-Red
    gradient.addColorStop(0.3, '#ffb3b3');     // Pastel Red
    gradient.addColorStop(0.6, '#e63946');     // Vibrant Core Red
    gradient.addColorStop(1, '#8b0000');       // Deep Crimson for contrast

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    requestAnimationFrame(animateGradient);
}

// Start the animation loop
animateGradient();


// --- 2. Scene Transition Logic ---
const confirmBtn = document.getElementById('confirm-btn');
const usernameInput = document.getElementById('username-input');
const scene1 = document.getElementById('scene-1');
const scene2 = document.getElementById('scene-2');

confirmBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter your name first!");
        return;
    }

    // Save username globally so scene2.js or cat.js can use it later
    window.currentUserName = username;

    // Smoothly fade out Scene 1 and prepare Scene 2
    scene1.classList.add('hidden');
    
    // Wait 1000ms (matches CSS transition duration) then reveal Scene 2
    setTimeout(() => {
        scene2.classList.remove('hidden');
        console.log("Switched to Scene 2. User name:", window.currentUserName);
        
        // OPTIONAL: Call an initialization function from scene2.js here if needed
    }, 1000);
});

