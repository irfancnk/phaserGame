

class PhaserController {
    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
            preload : this.preload,
            create : this.create,
            update : this.update
        });
    }

    preload() {
        this.game.load.image('background', 'assets/sky.jpg');
        this.game.add.spritesheet('background', 'assets/sky.jpg', 32, 32);

    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.add.sprite(0, 0, 'background');
    }

    update() {

    }


}
