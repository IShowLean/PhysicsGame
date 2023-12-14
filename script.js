const canvas = document.querySelector('canvas')
const content = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        content.save()
        content.globalAlpha = this.opacity
        content.beginPath()
        content.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        content.fillStyle = this.color
        content.fill()
        content.closePath()
        content.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades) this.opacity -= 0.01
    }
}

class Station {
    constructor() {
        this.position = {
            x: 1100,
            y: 350
        }

        const image = new Image()
        image.src = 'images/station.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
        }
    }

    draw() {
        content.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        if (this.image) {
            this.draw()
        }
    }
}

class Player {
    constructor() {
        this.position = {
            x: 200,
            y: canvas.height / 2
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = 'images/ship.png'
        image.onload = () => {
            const scale = 0.35
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
        }
    }

    draw() {
        content.save()
        content.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        content.rotate(this.rotation)
        content.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
        content.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        content.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class Background {
    constructor(path) {
        this.backgroundImage = new Image();
        this.backgroundImage.src = path;
    }

    drawBackground() {
        if (this.backgroundImage) {
            content.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
        }
    }
}

const player = new Player()
const station = new Station()
const lowerBackground = new Background('images/lower-background.png');
const upperBackground = new Background('images/upper-background.png');
const particles = []

function createParticles() {
    for (let i = 0; i < 200; i++) {
        particles.push(new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: -0.5,
                y: 0
            },
            radius: Math.random() * 3,
            color: '#d3ffff'
        }));
    }
}

createParticles();

function animate() {
    requestAnimationFrame(animate)
    content.fillStyle = 'black'
    content.fillRect(0, 0, canvas.width, canvas.height)
    upperBackground.drawBackground();
    particles.forEach(particle => {
        if (particle.position.x + particle.radius <= 0) {
            particle.position.x = canvas.width + particle.radius;
            particle.position.y = Math.random() * canvas.height;
        }
        particle.update()
    })
    lowerBackground.drawBackground();
    station.update()
    player.update()

    if (player.position.x <= 0) {
        player.velocity.x = 0
        player.position.x = 0
    }
    else if (player.position.x + player.width >= canvas.width) {
        player.velocity.x = 0
        player.position.x = canvas.width - player.width
    }

    if (player.position.y <= 0) {
        player.velocity.y = 0
        player.position.y = 0
    }
    else if (player.position.y + player.height >= canvas.height) {
        player.velocity.y = 0
        player.position.y = canvas.height - player.height
    }
}

animate()


const keys = {};

function handleKeyDown(event) {
    keys[event.key] = true;
}

function handleKeyUp(event) {
    keys[event.key] = false;
}

addEventListener('keydown', handleKeyDown);
addEventListener('keyup', handleKeyUp);

addEventListener('keydown', () => {
    const velocityValue = 1;
    console.log(keys);
    if (keys['w'] || keys['ц'] || keys['ArrowUp']) {
        player.velocity.y -= velocityValue;
        player.rotation = 0
    }
    else if (keys['a'] || keys['ф'] || keys['ArrowLeft']) {
        player.rotation = -1.57
        player.velocity.x -= velocityValue;
    }
    else if (keys['s'] || keys['ы'] || keys['ArrowDown']) {
        player.rotation = 3.15
        player.velocity.y += velocityValue;
    }
    else if (keys['d'] || keys['в'] || keys['ArrowRight']) {
        player.rotation = 1.57
        player.velocity.x += velocityValue;
    }
    if (keys['w'] && keys['a'] || keys['ц'] && keys['ф'] || keys['ArrowUp'] && keys['ArrowLeft']) {
        player.velocity.y -= velocityValue;
        player.velocity.x -= velocityValue;
        player.rotation = -0.8
    } else if (keys['w'] && keys['d'] || keys['ц'] && keys['в'] || keys['ArrowUp'] && keys['ArrowRight']) {
        player.velocity.y -= velocityValue;
        player.velocity.x += velocityValue;
        player.rotation = 0.8
    } else if (keys['a'] && keys['s'] || keys['ф'] && keys['ы'] || keys['ArrowLeft'] && keys['ArrowDown']) {
        player.velocity.y += velocityValue;
        player.velocity.x -= velocityValue;
        player.rotation = -2.4
    } else if (keys['s'] && keys['d'] || keys['ы'] && keys['в'] || keys['ArrowDown'] && keys['ArrowRight']) {
        player.velocity.y += velocityValue;
        player.velocity.x += velocityValue;
        player.rotation = 2.4
    }
});