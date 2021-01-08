let game;
let gameOptions = {
    gemSize: 100,
    boardOffset: {
        x: 100,
        y: 50
    },
    destroySpeed: 200,
    fallSpeed: 100
}
var tiles = {};

function onLoadCallback() {
    let gameConfig = {
        width: 750,
        height: 1334,
        scene: playGame,
        backgroundColor: 0x222222
    }
    game = new Phaser.Game(gameConfig);
}


class playGame extends Phaser.Scene {
    
    constructor() {
        super("PlayGame");
    }

    preload() {
        this.load.image('background', 'assets/background.jpg');       
        this.load.image('solidColor1', 'assets/solidColor1.png');
        this.load.image('solidColor2', 'assets/solidColor2.png');
        this.load.image('solidColor3', 'assets/solidColor3.png');
        this.load.image('solidColor4', 'assets/solidColor4.png');
        this.load.image('solidColorParticle1', 'assets/solidColorParticle1.png');
        this.load.image('solidColorParticle2', 'assets/solidColorParticle2.png');
    }
    create() {
        this.add.image(375, 667, 'background');
        for (let i = 9; i > 0; i--) {
            for (let j = 0; j < 9; j++) {
                let y = 320 + 80 * i;
                let x = 55 + 80 * j;
                if (tiles[i] === undefined) {
                    tiles[i] = {};
                }
                tiles[i][j] = this.add.sprite(x, y, 'solidColor' + Math.floor((Math.random() * 4) + 1)).setScale(0.80);
            }
        }
        this.input.on("pointerdown", this.tileSelect, this);
    }

    tileSelect(pointer) {
        if (pointer.x >= 15 && pointer.x <= 735 && pointer.y >= 350 && pointer.y <= 1090) {
            let currentX = Math.floor((pointer.x - 15) / 80);
            let currentY = Math.floor((pointer.y - 350) / 80) + 1;
            console.log(currentX, currentY);
            tiles[currentY][currentX].visible = false;
        }
    }

}


window.onload = onLoadCallback;