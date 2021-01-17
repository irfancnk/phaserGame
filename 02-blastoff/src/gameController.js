let game;
let gameOptions = {
    blockSize: 80,
    boardOffset: {
        x: 55,
        y: 400
    },
    destroySpeed: 200,
    fallSpeed: 50
}

let predefinedBoard = [
    [1, 2, 3, 1, 2, 3, 1, 2, 3],
    [4, 4, 3, 3, 4, 4, 4, 4, 4],
    [1, 1, 1, 3, 3, 1, 1, 1, 1],
    [1, 1, 1, 1, 3, 1, 1, 1, 1],
    [1, 1, 1, 3, 3, 1, 1, 4, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 3, 1, 1, 1, 1, 4, 1],
    [1, 1, 3, 3, 1, 1, 1, 4, 1],
    [1, 1, 1, 3, 1, 2, 2, 1, 1],
];


function onLoadCallback() {
    let gameConfig = {
        width: 750,
        height: 1334,
        scene: BlastScene,
        backgroundColor: 0x222222
    }
    game = new Phaser.Game(gameConfig);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

window.onload = onLoadCallback;