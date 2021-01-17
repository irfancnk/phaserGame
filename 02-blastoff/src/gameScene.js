class Block {
    constructor(param) {
        this.row = param.row;
        this.column = param.column;
        this.blockType = param.blockType;
        this.isEmpty = param.isEmpty;
        this.blockSprite = param.blockSprite;
    }
    getSpriteName() {
        return "solidColor" + this.blockType;
    }
    getSpriteX() {
        return gameOptions.boardOffset.x + gameOptions.blockSize * this.column;
    }
    getSpriteY() {
        return gameOptions.boardOffset.y + gameOptions.blockSize * this.row;
    }
    getSpriteFallY() {
        return (-1) * gameOptions.boardOffset.y + gameOptions.blockSize * this.row;
    }

}
























class BlastController {
    constructor(options) {
        this.gridRowCount = options.gridRowCount;
        this.gridColumnCount = options.gridColumnCount;
        this.gridItemCount = options.gridItemCount;
        this.grid = [];
        this.connectedBlockList = [];
    }

    initializeGrid() {
        let randomBlockType;
        for (let i = 0; i < this.gridRowCount; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.gridColumnCount; j++) {
                randomBlockType = Math.floor(Math.random() * this.gridItemCount) + 1;
                // randomBlockType = predefinedBoard[i][j];
                this.grid[i].push(new Block({
                    row: i,
                    column: j,
                    blockType: randomBlockType,
                    isEmpty: false,
                    sprite: null
                }));
            }
        }
    }

    isValid(row, column) {
        if (row >= 0 && column >= 0 && row < this.gridRowCount && column < this.gridColumnCount) {
            return true;
        }
        return false;
    }

    getConnectedBlockList(row, column) {
        this.connectedBlockList = [];
        this.getNeighbours(row, column, this.grid[row][column].blockType);
        return this.connectedBlockList;
    }

    getNeighbours(row, column, targetBlockType) {
        if (this.isValid(row, column)) {
            if (this.grid[row][column].blockType === targetBlockType) {
                let filteredList = this.connectedBlockList.filter(x => x.row === row && x.column === column)
                if (filteredList.length === 0) {
                    this.connectedBlockList.push(this.grid[row][column]);
                    this.getNeighbours(row + 1, column, targetBlockType);
                    this.getNeighbours(row - 1, column, targetBlockType);
                    this.getNeighbours(row, column + 1, targetBlockType);
                    this.getNeighbours(row, column - 1, targetBlockType);
                }
            }
        }
        return;
    }

    fill() {
        let swappedSprites = [];
        for (let i = this.gridRowCount - 1; i >= 0; i--) {
            for (let j = 0; j < this.gridColumnCount; j++) {
                if (!this.grid[i][j].isEmpty) {
                    let emptyBlockBelow = this.countEmptyBlockBelow(i, j)
                    if (emptyBlockBelow > 0) {
                        this.swapBlocks(
                            i,
                            j,
                            i + emptyBlockBelow,
                            j
                        );
                        swappedSprites.push({
                            block: this.grid[i + emptyBlockBelow][j],
                            deltaRow: emptyBlockBelow
                        })
                    }
                }
            }
        }
        return swappedSprites;
    }

    countEmptyBlockBelow(row, column) {
        let emptyCount = 0;
        for (let i = row; i < this.gridRowCount; i++) {
            if (this.grid[i][column].isEmpty) {
                emptyCount++;
            }
        }
        return emptyCount;
    }

    swapBlocks(row1, column1, row2, column2) {
        this.grid[row1][column1].isEmpty = true;
        this.grid[row2][column2].isEmpty = false;
        this.grid[row2][column2].blockType = this.grid[row1][column1].blockType;
        this.grid[row2][column2].blockSprite = this.grid[row1][column1].blockSprite;
    }

    fall() {
        let createdSprites = [];
        for (let i = 0; i < this.gridRowCount; i++) {
            for (let j = 0; j < this.gridColumnCount; j++) {
                if (this.grid[i][j].isEmpty) {
                    this.grid[i][j].isEmpty = false;
                    this.grid[i][j].blockType = Math.floor(Math.random() * this.gridItemCount) + 1;
                    createdSprites.push(this.grid[i][j]);
                }
            }
        }
        return createdSprites;
    }


    printGrid() {
        for (let i = 0; i < this.gridRowCount; i++) {
            let rowString = "";
            for (let j = 0; j < this.gridColumnCount; j++) {
                rowString += "|" + this.grid[i][j].isEmpty;
            }
            console.log(rowString);
        }
    }

}







































class BlastScene extends Phaser.Scene {

    constructor() {
        super("BlastScene");
        this.canPick = true;
        this.blastController = new BlastController({
            gridRowCount: 9,
            gridColumnCount: 9,
            gridItemCount: 4
        });
        this.blastController.initializeGrid();
        this.cube_collect_sound = null;
        this.cube_explode_sound = null;
    }

    preload() {
        this.load.image('background', 'assets/images/background.jpg');
        this.load.image('solidColor1', 'assets/images/solidColor1.png');
        this.load.image('solidColor2', 'assets/images/solidColor2.png');
        this.load.image('solidColor3', 'assets/images/solidColor3.png');
        this.load.image('solidColor4', 'assets/images/solidColor4.png');
        this.load.image('solidColorParticle1', 'assets/images/solidColorParticle1.png');
        this.load.image('solidColorParticle2', 'assets/images/solidColorParticle2.png');
        this.load.audio('cube_collect', 'assets/audio/cube_collect.wav');
        this.load.audio('cube_explode', 'assets/audio/cube_explode.wav');
    }

    create() {
        this.add.image(375, 667, 'background');
        this.cube_collect_sound = this.sound.add('cube_collect');
        this.cube_explode_sound = this.sound.add('cube_explode');
        this.drawField();
        this.input.on("pointerdown", this.blockSelect, this);
    }


    drawField() {
        let currentBlock = null;
        for (let i = this.blastController.gridRowCount - 1; i >= 0; i--) {
            for (let j = 0; j < this.blastController.gridColumnCount; j++) {
                currentBlock = this.blastController.grid[i][j];
                currentBlock.blockSprite = this.add.sprite(currentBlock.getSpriteX(), currentBlock.getSpriteY(), currentBlock.getSpriteName()).setScale(0.80);
            }
        }
    }

    blockSelect(pointer) {
        if (this.canPick) {
            let { row, column } = this.getPointerRowColumn(pointer);
            if (this.blastController.isValid(row, column)) {
                let connectedBlockList = this.blastController.getConnectedBlockList(row, column);
                if (connectedBlockList.length > 1) {
                    let totalDestroyed = 0;
                    this.cube_explode_sound.play();
                    for (let i = 0; i < connectedBlockList.length; i++) {
                        totalDestroyed++;
                        this.tweens.add({
                            targets: connectedBlockList[i].blockSprite,
                            alpha: 0,
                            duration: gameOptions.destroySpeed,
                            callbackScope: this,
                            onComplete: function () {
                                totalDestroyed--;
                                if (totalDestroyed == 0) {
                                    this.destroySprites(connectedBlockList);
                                    this.fill();
                                }
                            }
                        });
                    }
                }
            }
        }
    }

    getPointerRowColumn(pointer) {
        let columnSelectOffset = gameOptions.boardOffset.x - gameOptions.blockSize / 2;
        let column = Math.floor((pointer.x - columnSelectOffset) / gameOptions.blockSize);
        let rowSelectOffset = gameOptions.boardOffset.y + 8 - gameOptions.blockSize / 2;
        let row = Math.floor((pointer.y - rowSelectOffset) / gameOptions.blockSize);
        return { row, column };
    }

    destroySprites(connectedBlockList) {
        for (let i = 0; i < connectedBlockList.length; i++) {
            connectedBlockList[i].blockSprite.destroy();
            connectedBlockList[i].isEmpty = true;
        }
    }

    fill() {
        let swappedSprites = this.blastController.fill();
        this.fall(swappedSprites);
    }

    compareRow(a, b) {
        if (a.row > b.row)
            return -1;
        if (a.row < b.row)
            return 1;
        return 0;
    }

    fall(swappedSprites) {
        let createdSprites = [];
        let createdBlocks = this.blastController.fall().sort(this.compareRow);

        for (let i = 0; i < createdBlocks.length; i++) {
            let currentBlock = createdBlocks[i];
            currentBlock.blockSprite = this.add.sprite(currentBlock.getSpriteX(), currentBlock.getSpriteFallY(), currentBlock.getSpriteName()).setScale(0.80);
            createdSprites.push(currentBlock);
        }
        for (let i = 0; i < swappedSprites.length; i++) {
            this.tweens.add({
                targets: swappedSprites[i].block.blockSprite,
                y: swappedSprites[i].block.getSpriteY(),
                duration: gameOptions.fallSpeed * swappedSprites[i].deltaRow,
                callbackScope: this
            });
        }
        for (let i = 0; i < createdSprites.length; i++) {
            let deltaDistance = (-1) * createdSprites[i].getSpriteFallY() - createdSprites[i].getSpriteY();
            deltaDistance = Math.abs(Math.ceil(deltaDistance / gameOptions.blockSize));
            this.tweens.add({
                targets: createdSprites[i].blockSprite,
                y: createdSprites[i].getSpriteY(),
                duration: gameOptions.fallSpeed * 6,
                callbackScope: this,
                onComplete: function () {
                    this.canPick = true;
                }
            });
        }
    }

}
