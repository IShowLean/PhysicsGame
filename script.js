const canvas = document.querySelector('canvas')
const content = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

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

        this.rotation = 0
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'images/space.jpg';

        const image = new Image()
        image.src = 'images/ship.png'
        image.onload = () => {
            const scale = 0.35
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
        }
    }

    drawBackground() {
        if (this.backgroundImage) {
            content.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
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

const player = new Player()
const station = new Station()

function animate() {
    requestAnimationFrame(animate)
    player.drawBackground();
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

addEventListener('keydown', ({ key }) => {
    const velocityValue = 5
    switch (key) {
        case 'w':
            player.velocity.y -= velocityValue
            player.rotation = 0
            player.rotation = 0
            break;
        case 'a':
            player.velocity.x -= velocityValue
            player.rotation = -1.6
            break;
        case 's':
            player.velocity.y += velocityValue
            player.rotation = 3.15
            break;
        case 'd':
            player.velocity.x += velocityValue
            player.rotation = 1.6
            break;
    }
})