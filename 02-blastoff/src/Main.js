window.onload = function onLoadCallback() {
    let gameConfig = {
        width: 750,
        height: 1334,
        scene: BlastScene,
        backgroundColor: 0x222222,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 4000
                }
            }
        }
    }
    game = new Phaser.Game(gameConfig);
    windowController = new WindowController();
    window.focus()
    windowController.resize();
    window.addEventListener("resize", windowController.resize, false);
}