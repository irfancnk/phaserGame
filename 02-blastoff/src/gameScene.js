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
        let currentX, currentY;
        for (let i = this.gameLogic.rows - 1; i >= 0; i--) {
            currentY = gameOptions.boardOffset.y + gameOptions.gemSize * i;
            for (let j = 0; j < this.gameLogic.columns; j++) {
                currentX = gameOptions.boardOffset.x + gameOptions.gemSize * j;
                let gem = this.add.sprite(currentX, currentY, this.gameLogic.grid[i][j].getSpriteName()).setScale(0.80);
                this.gameLogic.grid[i][j].sprite = gem;
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
                let connectedItems = this.gameLogic.getConnectedItemList(row, col);
                if (connectedItems.length >= 2) {
                    this.canPick = false;
                    let totalDestroyed = 0;
                    for (let i = 0; i < connectedItems.length; i++) {
                        totalDestroyed++;
                        this.tweens.add({
                            targets: connectedItems[i].sprite,
                            alpha: 0,
                            duration: gameOptions.destroySpeed,
                            callbackScope: this,
                            onComplete: function () {
                                totalDestroyed--;
                                if (totalDestroyed == 0) {
                                    this.gameLogic.removeConnectedItems(connectedItems)
                                    this.makeGemsFall(connectedItems);
                                }
                            }
                        });
                    }
                }
            } else {
                console.log("Invalid Pick");
            }
        }
    }

    makeGemsFall(connectedItems) {
        this.fallInGameGems()
        // this.fallNewGems()
    }

    fallInGameGems() {
        let fallingItemCount = 0;
        let fallingSpriteList = this.gameLogic.getFallingSpriteList();
        for (let i = 0; i < fallingSpriteList.length; i++) {
            fallingItemCount++;
            this.tweens.add({
                targets: fallingSpriteList[i].block.sprite,
                y: fallingSpriteList[i].block.sprite.y + gameOptions.gemSize * fallingSpriteList[i].delta,
                duration: gameOptions.fallSpeed * fallingSpriteList[i].delta,
                callbackScope: this,
                onComplete: function () {
                    fallingItemCount--;
                    if (fallingItemCount == 0) {
                        this.canPick = true
                    }
                }
            });
        }

        // for (let i = 0; i < fallingSpriteList.length; i++) {
        //     fallingItemCount++;
        //     this.tweens.add({
        //         targets: fallingSpriteList[i].sprite,
        //         y: fallingSpriteList[i].sprite.y + gameOptions.gemSize * fallingSpriteList[i].delta,
        //         duration: gameOptions.fallSpeed * fallingSpriteList[i].delta,
        //         callbackScope: this,
        //         onComplete: function () {
        //             fallingItemCount--;
        //             if (fallingItemCount == 0) {
        //                 this.canPick = true
        //             }
        //         }
        //     });
        // }
        // console.log(this.gameLogic.grid);


        // let fallingGemsList = this.gameLogic.getFallingGems();
        // for (let i = 0; i < fallingGemsList.length; i++) {
        //     const currentFallingGem = fallingGemsList[i];
        //     const currentTarget = this.gameLogic.getCustomDataAt(currentFallingGem.row, currentFallingGem.column);
        //     fallingGems++;
        //     this.tweens.add({
        //         targets: currentTarget,
        //         y: currentTarget.y + gameOptions.gemSize * currentFallingGem.deltaRow,
        //         duration: gameOptions.fallSpeed * currentFallingGem.deltaRow,
        //         callbackScope: this,
        //         onComplete: function () {
        //             fallingGems--;
        //             if (fallingGems == 0) {
        //                 this.canPick = true
        //             }
        //         }
        //     });
        // }
        // if (fallingGemsList.length === 0) {
        //     this.canPick = true;
        // }
    }








































    compareRow(a, b) {
        if (a.row > b.row)
            return -1;
        if (a.row < b.row)
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
        newGemsList = newGemsList.sort(this.compareRow)
        for (let i = 0; i < newGemsList.length; i++) {
            newGem++;
            let y = 20
            let x = gameOptions.boardOffset.x + gameOptions.gemSize * newGemsList[i].column;
            let number = Math.floor(Math.random() * 4) + 1
            let gem = this.add.sprite(x, y, 'solidColor' + number).setScale(0.80);
            this.tweens.add({
                targets: gem,
                y: gameOptions.boardOffset.y + gameOptions.gemSize * newGemsList[i].row,
                duration: gameOptions.fallSpeed * newGemsList[i].deltaRow,
                callbackScope: this,
                onComplete: function () {
                    newGem--;
                    if (newGem == 0) {
                        this.canPick = true
                    }
                }
            });
        }
        if (newGemsList.length === 0) {
            this.canPick = true;
        }


    }

}
