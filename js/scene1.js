document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gradient-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    // Force immediate sizing
    resize();
    window.addEventListener('resize', resize);

    let tick = 0;

    function animateGradient() {
        tick += 0.005;

        // Dynamic fluid mathematical coordinates
        const x1 = width / 2 + Math.sin(tick * 1.5) * (width * 0.2);
        const y1 = height / 2 + Math.cos(tick * 2) * (height * 0.2);
        const r1 = Math.min(width, height) * 0.4 + Math.sin(tick) * 50;

        const x2 = width / 2 + Math.cos(tick * 0.8) * (width * 0.3);
        const y2 = height / 2 + Math.sin(tick * 1.2) * (height * 0.3);
        const r2 = Math.min(width, height) * 0.8;

        const gradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);

        gradient.addColorStop(0, '#fff5f5');       
        gradient.addColorStop(0.3, '#ffb3b3');     
        gradient.addColorStop(0.6, '#e63946');     
        gradient.addColorStop(1, '#8b0000');       

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        requestAnimationFrame(animateGradient);
    }

    animateGradient();

    // Scene Transition Logic
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

        window.currentUserName = username;
        scene1.classList.add('hidden');
        
        setTimeout(() => {
            scene2.classList.remove('hidden');
        }, 1000);
    });
});
