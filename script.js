const canvas = document.getElementById('mainWindow');
const content = canvas.getContext('2d')

fuelPanelwidth = 200;
fuelPanelheight = 50;

canvas.width = innerWidth
canvas.height = innerHeight

let gameStarted = false;

const backgroundImage = new Image();
backgroundImage.src = '/images/menu.png';

backgroundImage.onload = function () {
    drawMenu();
};

const customFont = new FontFace('DTM-Sans', 'url(DTM-Sans.otf)');

customFont.load().then((loadedFont) => {
    document.fonts.add(loadedFont);
    drawMenu();
})

function drawMenu() {
    content.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    content.fillStyle = 'rgba(0, 0, 0, 0)';
    content.fillRect(0, 0, canvas.width, canvas.height);

    content.fillStyle = 'white';
    content.font = '50px DTM-Sans';

    const textWidth = content.measureText('Press Enter to start').width;
    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height * 0.8;

    content.fillText('Press Enter to start', x, y);

    content.fillStyle = 'white';
    content.font = '30px DTM-Sans';

    const textWidth2 = content.measureText('Press R to restart the level').width;
    const x2 = (canvas.width - textWidth2) / 2;
    const y2 = canvas.height * 0.85;
    content.fillText('Press R to restart the level', x2, y2);
}

function startGame() {
    gameStarted = true;
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

            this.scale = 0.15
            const image = new Image()
            image.src = 'images/station.png'
            image.onload = () => {
                this.image = image
                this.width = image.width * this.scale
                this.height = image.height * this.scale
            }

            this.dockingPoint = {
                x: 20,
                y: image.height * this.scale / 2 + 9
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

    class Planet {
        constructor() {
            this.position = {
                x: 800,
                y: 200
            }

            this.scale = 1.5
            this.rotation = 45
            const image = new Image()
            image.src = 'images/planet.png'
            image.onload = () => {
                this.image = image
                this.width = image.width * this.scale
                this.height = image.height * this.scale
            }
        }

        draw() {
            content.save();
            content.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
            content.rotate(this.rotation);
            content.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            content.restore();
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

            this.scale = 0.35
            const image = new Image()
            image.src = 'images/ship.png'
            image.onload = () => {
                this.image = image
                this.width = image.width * this.scale
                this.height = image.height * this.scale
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

        drawBackground(x, y) {
            if (this.backgroundImage) {
                content.drawImage(this.backgroundImage, x, y, canvas.width, canvas.height);
            }
        }
    }

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

    const customFont = new FontFace('DTM-Sans', 'url(./DTM-Sans.otf)');
    customFont.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
    })

    function drawFuelPanel() {
        const borderWidth = 2;
        const margin = 2
        content.fillStyle = 'rgba(0, 0, 0, 0.4)';
        content.fillRect(margin, margin, fuelPanelwidth, fuelPanelheight);

        content.strokeStyle = 'white';
        content.lineWidth = borderWidth;
        content.strokeRect(margin, margin, fuelPanelwidth, fuelPanelheight);

        content.fillStyle = 'white';
        content.font = '25px DTM-Sans';

        const textWidth = content.measureText(`Fuel: ${fuel}`).width;
        const x = (fuelPanelwidth - textWidth) / 2;
        const y = (fuelPanelheight + 20) / 2;
        content.fillText(`Fuel: ${fuel}`, x, y);
    }

    function arePointsColliding(player, station) {
        console.log(Math.abs(player.position.x - station.dockingPoint.x));
        console.log(Math.abs(player.position.y - station.dockingPoint.y));
        const yCollision = (328 <= Math.abs(player.position.y - station.dockingPoint.y) && Math.abs(player.position.y - station.dockingPoint.y) <= 338)
        const xCollision = (1078 <= Math.abs(player.position.x - station.dockingPoint.x) && Math.abs(player.position.x - station.dockingPoint.x) <= 1088)
        return xCollision && yCollision;
    }

    let fuel = 50;
    const player = new Player()
    const station = new Station()
    const lowerBackground1 = new Background('images/lower-background.png');
    const lowerBackground2 = new Background('images/lower-background.png');
    const planet = new Planet()
    const upperBackground = new Background('images/upper-background.png');
    const particles = []
    let blockControl = false;

    createParticles();

    let x = 0
    let x2 = canvas.width
    let backgroundSpeed = 2

    function animate() {
        requestAnimationFrame(animate)
        content.fillStyle = 'black'
        content.fillRect(0, 0, canvas.width, canvas.height)
        upperBackground.drawBackground(0, 0);
        particles.forEach(particle => {
            if (particle.position.x + particle.radius <= 0) {
                particle.position.x = canvas.width + particle.radius;
                particle.position.y = Math.random() * canvas.height;
            }
            particle.update()
        })

        lowerBackground1.drawBackground(x, 0);
        if (x < -canvas.width) x = canvas.width + x2 - backgroundSpeed
        else x -= backgroundSpeed

        lowerBackground2.drawBackground(x2, 0);
        if (x2 < -canvas.width) x2 = canvas.width + x - backgroundSpeed
        else x2 -= backgroundSpeed

        station.update()
        planet.update()
        player.update()
        drawFuelPanel()

        if (fuel <= 0) {
            blockControl = true;
            fuel = 0
        }

        if (arePointsColliding(player, station, 80)) {
            player.velocity.x = 0
            player.velocity.y = 0
        }

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

        planet.position.x -= 0.1
        if (planet.position.x < -200) planet.position.x = 2000
    }

    animate()

    addEventListener('keydown', () => {
        const velocityValue = 1;
        if (keys['R'] || keys['r'] || keys['К'] || keys['к']) {
            fuel = 50
            player.position.x = 200
            player.position.y = canvas.height / 2
            player.velocity.x = 0
            player.velocity.y = 0
            player.rotation = 0
            blockControl = false;
        }
        if (blockControl) return
        if (keys['w'] || keys['ц'] || keys['ArrowUp'] || keys['W'] || keys['Ц']) {
            player.velocity.y -= velocityValue;
            player.rotation = 0
            fuel -= velocityValue
        }
        else if (keys['a'] || keys['ф'] || keys['ArrowLeft'] || keys['A'] || keys['Ф']) {
            player.rotation = -1.57
            player.velocity.x -= velocityValue;
            fuel -= velocityValue
        }
        else if (keys['s'] || keys['ы'] || keys['ArrowDown'] || keys['S'] || keys['Ы']) {
            player.rotation = 3.15
            player.velocity.y += velocityValue;
            fuel -= velocityValue
        }
        else if (keys['d'] || keys['в'] || keys['ArrowRight'] || keys['D'] || keys['В']) {
            player.rotation = 1.57
            player.velocity.x += velocityValue;
            fuel -= velocityValue
        }
        if (keys['w'] && keys['a'] || keys['ц'] && keys['ф'] || keys['ArrowUp'] && keys['ArrowLeft'] || keys['W'] && keys['A'] || keys['Ц'] && keys['Ф']) {
            player.velocity.y -= velocityValue;
            player.velocity.x -= velocityValue;
            player.rotation = -0.8
            fuel -= velocityValue
        } else if (keys['w'] && keys['d'] || keys['ц'] && keys['в'] || keys['ArrowUp'] && keys['ArrowRight'] || keys['W'] && keys['D'] || keys['Ц'] && keys['В']) {
            player.velocity.y -= velocityValue;
            player.velocity.x += velocityValue;
            player.rotation = 0.8
            fuel -= velocityValue
        } else if (keys['a'] && keys['s'] || keys['ф'] && keys['ы'] || keys['ArrowLeft'] && keys['ArrowDown'] || keys['A'] && keys['S'] || keys['Ф'] && keys['Ы']) {
            player.velocity.y += velocityValue;
            player.velocity.x -= velocityValue;
            player.rotation = -2.4
            fuel -= velocityValue
        } else if (keys['s'] && keys['d'] || keys['ы'] && keys['в'] || keys['ArrowDown'] && keys['ArrowRight'] || keys['S'] && keys['D'] || keys['Ы'] && keys['В']) {
            player.velocity.y += velocityValue;
            player.velocity.x += velocityValue;
            player.rotation = 2.4
            fuel -= velocityValue
        }
    });
}

drawMenu();

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

    if (!gameStarted) {
        if (keys['Enter']) {
            startGame();
        }
    }

});
