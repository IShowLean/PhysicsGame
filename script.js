const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth)
const DEFAULT_HEIGHT = 1080
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT

const config = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);


function preload() {
    this.load.image('station', 'station.png');
    this.load.image('ship', 'ship.png');
    this.load.image('space', 'space.jpg');
}

function create() {
    this.add.image(0, 0, 'space').setOrigin(0, 0);
    this.add.image(1300, 500, 'station').setScale(0.2);
    this.add.image(400, 300, 'ship').setScale(0.5);

    player = this.physics.add.sprite(100, 450, 'ship');
    cursors = this.input.keyboard.createCursorKeys();
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

}

function update() {

}

function dockSpaceship() {
}
