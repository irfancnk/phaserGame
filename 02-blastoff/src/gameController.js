let game;
let gameOptions = {
    gemSize: 80,
    boardOffset: {
        x: 55,
        y: 400
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
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}


class playGame extends Phaser.Scene {

    constructor() {
        super("PlayGame");
        this.poolArray = [];
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
        this.sameGame = new SameGame({
            rows: 9,
            columns: 9,
            items: 4
        });
        this.drawField();
        this.canPick = true;
        this.input.on("pointerdown", this.tileSelect, this);
    }


    drawField() {
        for (let i = this.sameGame.getRows() - 1; i >= 0; i--) {
            for (let j = 0; j < this.sameGame.getColumns(); j++) {
                let y = gameOptions.boardOffset.y + gameOptions.gemSize * i;
                let x = gameOptions.boardOffset.x + gameOptions.gemSize * j;
                let gem = this.add.sprite(x, y, 'solidColor' + this.sameGame.getValueAt(i, j)).setScale(0.80);
                this.sameGame.setCustomData(i, j, gem);
            }
        }
    }

    tileSelect(pointer) {
        if (this.canPick) {
            let colSelectOffset = gameOptions.boardOffset.x - gameOptions.gemSize / 2;
            let rowSelectOffset = gameOptions.boardOffset.y + 8 - gameOptions.gemSize / 2;
            let row = Math.floor((pointer.y - rowSelectOffset) / gameOptions.gemSize);
            let col = Math.floor((pointer.x - colSelectOffset) / gameOptions.gemSize);
            if (this.sameGame.validPick(row, col)) {
                if (this.sameGame.countConnectedItems(row, col) >= 2) {
                    this.canPick = false;
                    let gemsToRemove = this.sameGame.listConnectedItems(row, col);
                    let destroyed = 0;
                    for (let i = 0; i < gemsToRemove.length; i++) {
                        destroyed++;
                        this.poolArray.push(this.sameGame.getCustomDataAt(gemsToRemove[i].row, gemsToRemove[i].column));
                        this.tweens.add({
                            targets: this.sameGame.getCustomDataAt(gemsToRemove[i].row, gemsToRemove[i].column),
                            alpha: 0,
                            duration: gameOptions.destroySpeed,
                            callbackScope: this,
                            onComplete: function () {
                                destroyed--;
                                if (destroyed == 0) {
                                    this.sameGame.removeConnectedItems(row, col)
                                    this.makeGemsFall();
                                }
                            }
                        });
                    }
                }
            }
        }
    }


    makeGemsFall() {
        let fallingGems = 0;
        let movements = this.sameGame.arrangeBoard();
        let replenishMovements = this.sameGame.replenishBoard();
        movements.forEach(function (movement) {
            fallingGems++;
            this.tweens.add({
                targets: this.sameGame.getCustomDataAt(movement.row, movement.column),
                y: this.sameGame.getCustomDataAt(movement.row, movement.column).y + gameOptions.gemSize * movement.deltaRow,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    fallingGems--;
                    if (fallingGems == 0) {
                        this.canPick = true
                    }
                }
            })
        }.bind(this))
        replenishMovements.forEach(function (movement) {
            fallingGems++;
            let sprite = this.poolArray.pop();
            sprite.alpha = 1;
            sprite.y = gameOptions.boardOffset.y + gameOptions.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions.gemSize / 2;
            sprite.x = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2,
                sprite.setFrame(this.sameGame.getValueAt(movement.row, movement.column));
            this.sameGame.setCustomData(movement.row, movement.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    fallingGems--;
                    if (fallingGems == 0) {
                        this.canPick = true
                    }
                }
            });
        }.bind(this))

    }
}

class SameGame {

    // constructor, simply turns obj information into class properties
    constructor(obj) {
        this.rows = obj.rows;
        this.columns = obj.columns;
        this.items = obj.items;
        this.gameArray = [];
        this.generateBoard()
    }

    // generates the game board
    generateBoard() {
        for (let i = 0; i < this.rows; i++) {
            this.gameArray.push([]);
            for (let j = 0; j < this.columns; j++) {
                this.gameArray[i][j] = {
                    value: Math.floor(Math.random() * this.items) + 1,
                    isEmpty: false,
                    row: i,
                    column: j
                }
            }
        }
    }

    // returns the number of board rows
    getRows() {
        return this.rows;
    }

    // returns the number of board columns
    getColumns() {
        return this.columns;
    }

    // returns true if the item at (row, column) is empty
    isEmpty(row, column) {
        return this.gameArray[row][column].isEmpty;
    }

    // returns the value of the item at (row, column), or false if it's not a valid pick
    getValueAt(row, column) {
        if (!this.validPick(row, column)) {
            return false;
        }
        return this.gameArray[row][column].value;
    }

    // returns the custom data of the item at (row, column)
    getCustomDataAt(row, column) {
        return this.gameArray[row][column].customData;
    }

    // returns true if the item at (row, column) is a valid pick
    validPick(row, column) {
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }

    // sets a custom data on the item at (row, column)
    setCustomData(row, column, customData) {
        this.gameArray[row][column].customData = customData;
    }

    // returns an object with all connected items starting at (row, column)
    listConnectedItems(row, column) {
        if (!this.validPick(row, column) || this.gameArray[row][column].isEmpty) {
            return;
        }
        this.colorToLookFor = this.gameArray[row][column].value;
        this.floodFillArray = [];
        this.floodFill(row, column);
        return this.floodFillArray;
    }

    // returns the number of connected items starting at (row, column)
    countConnectedItems(row, column) {
        return this.listConnectedItems(row, column).length;
    }

    // removes all connected items starting at (row, column)
    removeConnectedItems(row, column) {
        let items = this.listConnectedItems(row, column);
        items.forEach(function (item) {
            this.gameArray[item.row][item.column].isEmpty = true;
        }.bind(this))
    }

    // flood fill routine
    floodFill(row, column) {
        if (!this.validPick(row, column) || this.gameArray[row][column].isEmpty) {
            return;
        }
        if (this.gameArray[row][column].value == this.colorToLookFor && !this.alreadyVisited(row, column)) {
            this.floodFillArray.push({
                row: row,
                column: column
            });
            this.floodFill(row + 1, column);
            this.floodFill(row - 1, column);
            this.floodFill(row, column + 1);
            this.floodFill(row, column - 1);
        }
    }

    // arranges the board, making items fall down. Returns an object with movement information
    arrangeBoard() {
        let result = []
        for (let i = this.getRows() - 1; i >= 0; i--) {
            for (let j = 0; j < this.getColumns(); j++) {
                let emptySpaces = this.emptySpacesBelow(i, j);
                if (!this.isEmpty(i, j) && emptySpaces > 0) {
                    this.swapItems(i, j, i + emptySpaces, j)
                    result.push({
                        row: i + emptySpaces,
                        column: j,
                        deltaRow: emptySpaces
                    });
                }
            }
        }
        return result;
    }

    // replenishes the board and returns an object with movement information
    replenishBoard() {
        let result = [];
        for (let i = 0; i < this.getColumns(); i++) {
            if (this.isEmpty(0, i)) {
                let emptySpaces = this.emptySpacesBelow(0, i) + 1;
                for (let j = 0; j < emptySpaces; j++) {
                    let randomValue = Math.floor(Math.random() * this.items);
                    result.push({
                        row: j,
                        column: i,
                        deltaRow: emptySpaces
                    });
                    this.gameArray[j][i].value = randomValue;
                    this.gameArray[j][i].isEmpty = false;
                }
            }
        }
        return result;
    }

    // returns the amount of empty spaces below the item at (row, column)
    emptySpacesBelow(row, column) {
        let result = 0;
        if (row != this.getRows()) {
            for (let i = row + 1; i < this.getRows(); i++) {
                if (this.isEmpty(i, column)) {
                    result++;
                }
            }
        }
        return result;
    }

    // swap the items at (row, column) and (row2, column2)
    swapItems(row, column, row2, column2) {
        let tempObject = Object.assign(this.gameArray[row][column]);
        this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
        this.gameArray[row2][column2] = Object.assign(tempObject);
    }

    // returns true if (row, column) is already in floodFillArray array
    alreadyVisited(row, column) {
        let found = false;
        this.floodFillArray.forEach(function (item) {
            if (item.row == row && item.column == column) {
                found = true;
            }
        });
        return found;
    }

}






window.onload = onLoadCallback;