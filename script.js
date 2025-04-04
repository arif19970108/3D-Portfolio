const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

// Create Snowflake
class Snowflake {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;  // Snowflake size
        this.speedX = 0;  // Snowflakes fall vertically
        this.speedY = Math.random() * 1 + 0.5;  // Vertical speed
        this.color = 'rgba(255, 255, 255, 0.7)';  // Snowflakes are white
    }

    update() {
        this.y += this.speedY;
        if (this.y > canvas.height) {
            this.y = 0;  // Reset snowflake position
            this.x = Math.random() * canvas.width;  // Random x position
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create Raindrop
class Raindrop {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;  // Raindrop size
        this.speedX = 0;  // Raindrops fall vertically
        this.speedY = Math.random() * 4 + 2;  // Rain speed
        this.color = 'rgba(173, 216, 230, 0.7)';  // Light blue for rain
    }

    update() {
        this.y += this.speedY;
        if (this.y > canvas.height) {
            this.y = 0;  // Reset raindrop position
            this.x = Math.random() * canvas.width;  // Random x position
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size * 3);  // Rectangular raindrop
        ctx.fill();
    }
}

// Create Spark with Aurora Effect
class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;  // Spark size
        this.speedX = Math.random() * 5 - 2.5;  // Random spark direction
        this.speedY = Math.random() * 5 - 2.5;
        this.color = this.getAuroraColor();  // Aurora-like color
        this.life = 50;  // Lifespan of the spark
    }

    // Function to generate random Aurora-like colors (green, purple, blue)
    getAuroraColor() {
        const colors = [
            'rgba(0, 255, 255, 0.9)', // Cyan/Greenish
            'rgba(75, 0, 130, 0.9)',  // Purple
            'rgba(0, 255, 127, 0.9)'  // Light Green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size *= 0.96;  // Shrink the spark
        this.life--;
        if (this.life <= 0) {
            return true;  // Remove spark if life ends
        }
        return false;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


// Create particles on mouse movement
canvas.addEventListener('mousemove', (e) => {
    const numberOfParticles = 10;  // Number of sparks per mouse movement
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Spark(e.x, e.y));
    }
});

// Animate particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas for fresh animation

    // Handle snowflakes
    for (let i = 0; i < particlesArray.length; i++) {
        if (particlesArray[i] instanceof Snowflake) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
    }

    // Handle raindrops
    for (let i = 0; i < particlesArray.length; i++) {
        if (particlesArray[i] instanceof Raindrop) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
    }

    // Handle sparks (from mouse movement)
    for (let i = 0; i < particlesArray.length; i++) {
        if (particlesArray[i] instanceof Spark) {
            if (particlesArray[i].update()) {
                particlesArray.splice(i, 1);  // Remove expired spark
                i--;
            } else {
                particlesArray[i].draw();
            }
        }
    }

    // Add new snowflakes and raindrops
    if (particlesArray.length < 500) {  // Limit the number of particles
        particlesArray.push(new Snowflake(Math.random() * canvas.width, 0));
        particlesArray.push(new Raindrop(Math.random() * canvas.width, 0));
    }

    requestAnimationFrame(animateParticles);  // Recursively animate particles
}

animateParticles();
