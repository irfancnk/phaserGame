class BlastScene extends Phaser.Scene {

    constructor() {
        super("BlastScene");
        this.gameLogic = new GameLogic({
            rows: 9,
            columns: 9,
            items: 4
        });
        this.poolArray = [];
        this.canPick = true;
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
        this.drawField();
        this.input.on("pointerdown", this.tileSelect, this);
    }


    drawField() {
        for (let i = this.gameLogic.getRows() - 1; i >= 0; i--) {
            for (let j = 0; j < this.gameLogic.getColumns(); j++) {
                let y = gameOptions.boardOffset.y + gameOptions.gemSize * i;
                let x = gameOptions.boardOffset.x + gameOptions.gemSize * j;
                let gem = this.add.sprite(x, y, 'solidColor' + this.gameLogic.getValueAt(i, j)).setScale(0.80);
                this.gameLogic.setCustomData(i, j, gem);
            }
        }
    }

    tileSelect(pointer) {
        if (this.canPick) {
            let colSelectOffset = gameOptions.boardOffset.x - gameOptions.gemSize / 2;
            let rowSelectOffset = gameOptions.boardOffset.y + 8 - gameOptions.gemSize / 2;
            let row = Math.floor((pointer.y - rowSelectOffset) / gameOptions.gemSize);
            let col = Math.floor((pointer.x - colSelectOffset) / gameOptions.gemSize);
            if (this.gameLogic.validPick(row, col)) {
                let connectedItems = this.gameLogic.listConnectedItems(row, col);
                if (connectedItems.length >= 2) {
                    this.canPick = false;
                    let destroyed = 0;
                    for (let i = 0; i < connectedItems.length; i++) {
                        destroyed++;
                        let customData = this.gameLogic.getCustomDataAt(connectedItems[i].row, connectedItems[i].column);
                        this.poolArray.push(customData);
                        this.tweens.add({
                            targets: customData,
                            alpha: 0,
                            duration: gameOptions.destroySpeed,
                            callbackScope: this,
                            onComplete: function () {
                                destroyed--;
                                if (destroyed == 0) {
                                    this.gameLogic.removeConnectedItems([...connectedItems])
                                    this.makeGemsFall();
                                }
                            }
                        });
                    }
                }
            }
        }
    }


    fallInGameGems() {
        let fallingGems = 0;
        let fallingGemsList = this.gameLogic.getFallingGems();
        for (let i = 0; i < fallingGemsList.length; i++) {
            const currentFallingGem = fallingGemsList[i];
            const currentTarget = this.gameLogic.getCustomDataAt(currentFallingGem.row, currentFallingGem.column);
            fallingGems++;
            this.tweens.add({
                targets: currentTarget,
                y: currentTarget.y + gameOptions.gemSize * currentFallingGem.deltaRow,
                duration: gameOptions.fallSpeed * currentFallingGem.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    fallingGems--;
                    if (fallingGems == 0) {
                        this.canPick = true
                    }
                }
            });
        }
        if (fallingGemsList.length === 0) {
            this.canPick = true;
        }
    }

    compareRow(a, b) {
        if (a.row < b.row)
            return -1;
        if (a.row > b.row)
            return 1;
        return 0;
    }
    compareColumn(a, b) {
        if (a.column < b.column)
            return -1;
        if (a.column > b.column)
            return 1;
        return 0;
    }


    compareY(a, b) {
        if (a.y < b.y)
            return -1;
        if (a.y > b.y)
            return 1;
        return 0;
    }
    compareX(a, b) {
        if (a.x < b.x)
            return -1;
        if (a.x > b.x)
            return 1;
        return 0;
    }


    fallNewGems() {
        this.canPick = false;
        let newGem = 0;
        let newGemsList = this.gameLogic.createNewGems();
        console.log(newGemsList);
        // newGemsList = newGemsList.sort(this.compareRow)
        // for (let i = 0; i < newGemsList.length; i++) {
        //     newGem++;
        //     const currentNewGem = newGemsList[i];
        //     let sprite = this.poolArray.pop();
        //     sprite.alpha = 1;
        //     sprite.y = gameOptions.boardOffset.y - 50 + gameOptions.gemSize * (currentNewGem.row - currentNewGem.deltaRow + 1) - gameOptions.gemSize / 2;
        //     sprite.setTexture('solidColor' + this.gameLogic.getValueAt(currentNewGem.row, currentNewGem.column));
        //     this.tweens.add({
        //         targets: sprite,
        //         y: gameOptions.boardOffset.y + gameOptions.gemSize * currentNewGem.row,
        //         duration: gameOptions.fallSpeed * currentNewGem.deltaRow,
        //         callbackScope: this,
        //         onComplete: function () {
        //             newGem--;
        //             if (newGem == 0) {
        //                 this.canPick = true
        //             }
        //         }
        //     });
        // }
        if (newGemsList.length === 0) {
            this.canPick = true;
        }


    }




    makeGemsFall() {
        this.fallInGameGems()
        this.fallNewGems()
    }
}
