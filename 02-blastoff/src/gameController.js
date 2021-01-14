let game;
let gameOptions = {
    gemSize: 80,
    boardOffset: {
        x: 55,
        y: 400
    },
    destroySpeed: 200,
    fallSpeed: 50
}


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