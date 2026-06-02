class Avatar {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.scale = 1;
        this.state = 'idle'; // idle, walking, talking, thinking
        this.animationFrame = 0;
        this.direction = 1; // 1 for right, -1 for left
        this.isAnimating = false;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context state
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.scale(this.direction, 1);

        // Draw based on state
        switch (this.state) {
            case 'idle':
                this.drawIdle();
                break;
            case 'walking':
                this.drawWalking();
                break;
            case 'talking':
                this.drawTalking();
                break;
            case 'thinking':
                this.drawThinking();
                break;
            default:
                this.drawIdle();
        }

        this.ctx.restore();
    }

    drawIdle() {
        const bob = Math.sin(this.animationFrame * 0.05) * 3;
        
        // Head
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.beginPath();
        this.ctx.arc(0, -30 + bob, 25, 0, Math.PI * 2);
        this.ctx.fill();

        // Eyes
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(-8, -32 + bob, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(8, -32 + bob, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Mouth - smile
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, -25 + bob, 8, 0, Math.PI);
        this.ctx.stroke();

        // Body
        this.ctx.fillStyle = '#667eea';
        this.ctx.fillRect(-15, -5 + bob, 30, 35);

        // Arms
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.fillRect(-20, -2 + bob, 10, 12);
        this.ctx.fillRect(10, -2 + bob, 10, 12);

        // Legs
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(-10, 32 + bob, 8, 15);
        this.ctx.fillRect(2, 32 + bob, 8, 15);

        // Feet
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.fillRect(-10, 47 + bob, 8, 5);
        this.ctx.fillRect(2, 47 + bob, 8, 5);
    }

    drawWalking() {
        const legSwing = Math.sin(this.animationFrame * 0.1) * 15;
        const bob = Math.abs(Math.sin(this.animationFrame * 0.05)) * 3;
        const armSwing = Math.sin(this.animationFrame * 0.1) * 10;

        // Head
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.beginPath();
        this.ctx.arc(0, -30 + bob, 25, 0, Math.PI * 2);
        this.ctx.fill();

        // Eyes - excited
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(-8, -32 + bob, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(8, -32 + bob, 5, 0, Math.PI * 2);
        this.ctx.fill();

        // Mouth - big smile
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, -24 + bob, 10, 0, Math.PI);
        this.ctx.stroke();

        // Body
        this.ctx.fillStyle = '#667eea';
        this.ctx.fillRect(-15, -5 + bob, 30, 35);

        // Arms - swinging
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.save();
        this.ctx.translate(-20, 5 + bob);
        this.ctx.rotate((armSwing * Math.PI) / 180);
        this.ctx.fillRect(0, 0, 10, 12);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(20, 5 + bob);
        this.ctx.rotate((-armSwing * Math.PI) / 180);
        this.ctx.fillRect(-10, 0, 10, 12);
        this.ctx.restore();

        // Legs - walking motion
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(-10, 32 + bob + legSwing / 2, 8, 15);
        this.ctx.fillRect(2, 32 + bob - legSwing / 2, 8, 15);

        // Feet
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.fillRect(-10, 47 + bob + legSwing / 2, 8, 5);
        this.ctx.fillRect(2, 47 + bob - legSwing / 2, 8, 5);
    }

    drawTalking() {
        const mouthOpen = Math.sin(this.animationFrame * 0.15) * 6;
        const bob = Math.sin(this.animationFrame * 0.05) * 3;

        // Head
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.beginPath();
        this.ctx.arc(0, -30 + bob, 25, 0, Math.PI * 2);
        this.ctx.fill();

        // Eyes - looking at you
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(-8, -32 + bob, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(8, -32 + bob, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Mouth - talking animation
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(-6, -22 + bob, 12, 4 + Math.abs(mouthOpen));

        // Body
        this.ctx.fillStyle = '#667eea';
        this.ctx.fillRect(-15, -5 + bob, 30, 35);

        // Arms - gesturing
        this.ctx.fillStyle = '#FFD1A3';
        const gesture = Math.sin(this.animationFrame * 0.1) * 10;
        this.ctx.fillRect(-20 + gesture, -2 + bob, 10, 12);
        this.ctx.fillRect(10 - gesture, -2 + bob, 10, 12);

        // Legs
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(-10, 32 + bob, 8, 15);
        this.ctx.fillRect(2, 32 + bob, 8, 15);

        // Feet
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.fillRect(-10, 47 + bob, 8, 5);
        this.ctx.fillRect(2, 47 + bob, 8, 5);
    }

    drawThinking() {
        const bob = Math.sin(this.animationFrame * 0.05) * 3;
        const tilt = Math.sin(this.animationFrame * 0.08) * 5;

        // Head - tilted
        this.ctx.save();
        this.ctx.translate(0, -30 + bob);
        this.ctx.rotate((tilt * Math.PI) / 180);
        
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
        this.ctx.fill();

        // Eyes - thinking
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(-8, -2, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(8, -2, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Mouth - thinking
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 5, 6, Math.PI, 0);
        this.ctx.stroke();
        
        this.ctx.restore();

        // Body
        this.ctx.fillStyle = '#667eea';
        this.ctx.fillRect(-15, -5 + bob, 30, 35);

        // Arm - hand on chin
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.fillRect(-20, -2 + bob, 10, 12);
        this.ctx.beginPath();
        this.ctx.arc(-20, 10 + bob, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillRect(10, -2 + bob, 10, 12);

        // Legs
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(-10, 32 + bob, 8, 15);
        this.ctx.fillRect(2, 32 + bob, 8, 15);

        // Feet
        this.ctx.fillStyle = '#FFD1A3';
        this.ctx.fillRect(-10, 47 + bob, 8, 5);
        this.ctx.fillRect(2, 47 + bob, 8, 5);

        // Thinking bubble
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(-50, -50, 15, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(-60, -35, 8, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(-45, -25, 5, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    setState(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.animationFrame = 0;
        }
    }

    animate() {
        this.animationFrame++;
        this.draw();
        
        if (this.isAnimating) {
            requestAnimationFrame(() => this.animate());
        }
    }

    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }

    stopAnimation() {
        this.isAnimating = false;
    }

    walk(duration = 2000) {
        this.setState('walking');
        this.startAnimation();
        
        setTimeout(() => {
            this.setState('idle');
        }, duration);
    }

    talk(duration = 3000) {
        this.setState('talking');
        this.startAnimation();
        
        setTimeout(() => {
            this.setState('idle');
        }, duration);
    }

    think(duration = 2000) {
        this.setState('thinking');
        this.startAnimation();
        
        setTimeout(() => {
            this.setState('idle');
        }, duration);
    }

    toggleDirection() {
        this.direction *= -1;
    }
}