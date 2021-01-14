class Block {
    constructor(param) {
        this.row = param.row;
        this.column = param.column;
        this.blockType = param.blockType;
        this.isEmpty = param.isEmpty;
        this.sprite = param.sprite;
    }

    getSpriteName() {
        return "solidColor" + this.blockType;
    }

}


class GameLogic {

    constructor(obj) {
        this.rows = obj.rows;
        this.columns = obj.columns;
        this.items = obj.items;
        this.grid = [];
        this.generateBoard();
        this.connectedItemList = [];
    }

    // generates the game board
    generateBoard() {
        let predefinedBoard = [
            [1, 2, 3, 1, 2, 3, 1, 2, 3],
            [4, 4, 3, 3, 4, 4, 4, 4, 4],
            [1, 1, 1, 3, 3, 1, 1, 1, 1],
            [1, 1, 1, 1, 3, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 3, 1, 1, 1, 1, 1, 1],
            [1, 1, 3, 3, 1, 1, 1, 1, 1],
            [1, 1, 1, 3, 1, 1, 1, 1, 1],
        ]
        let randomBlockType;
        for (let i = 0; i < this.rows; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.columns; j++) {
                // randomBlockType = Math.floor(Math.random() * this.items) + 1;
                randomBlockType = predefinedBoard[i][j];
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

    validPick(row, column) {
        if (row >= 0 && column >= 0 && row < this.rows && column < this.columns) {
            return true;
        }
        return false;
    }

    getConnectedItemList(row, column) {
        this.connectedItemList = [];
        this.getNeighbours(row, column, this.grid[row][column].blockType);
        let sortableBlocks = [...this.connectedItemList];
        sortableBlocks = sortableBlocks.sort(this.compareRow);
        return sortableBlocks;
    }

    getNeighbours(row, column, targetBlockType) {
        if (this.validPick(row, column)) {
            if (this.grid[row][column].blockType === targetBlockType) {
                let filteredList = this.connectedItemList.filter(x => x.row === row && x.column === column)
                if (filteredList.length === 0) {
                    this.connectedItemList.push(this.grid[row][column]);
                    this.getNeighbours(row + 1, column, targetBlockType);
                    this.getNeighbours(row - 1, column, targetBlockType);
                    this.getNeighbours(row, column + 1, targetBlockType);
                    this.getNeighbours(row, column - 1, targetBlockType);
                }
            }
        }
        return;
    }

    compareRow(a, b) {
        if (a.row > b.row)
            return -1;
        if (a.row < b.row)
            return 1;
        return 0;
    }

    removeConnectedItems(connectedItems) {
        for (let i = 0; i < connectedItems.length; i++) {
            connectedItems[i].isEmpty = true;
        }
    }


    getFallingSpriteList() {
        let fallingSpriteList = [];
        for (let i = this.rows - 2; i >= 0; i--) {
            for (let j = 0; j < this.columns; j++) {
                if (!this.grid[i][j].isEmpty) {
                    let fullBelow = this.countFullBelow(i, j);
                    let delta = this.columns - i - fullBelow - 1;
                    if (delta > 0) {
                        fallingSpriteList.push({
                            block: this.grid[i][j],
                            delta: delta
                        })

                    }
                }
            }
        }
        return fallingSpriteList;
    }

    countEmptyBelow(row, column) {
        let emptyCount = 0;
        for (let i = row; i < this.rows; i++) {
            if (this.grid[i][column].isEmpty) {
                emptyCount++;
            }
        }
        return emptyCount;
    }

    countFullBelow(row, column) {
        let fullCount = 0;
        for (let i = row + 1; i < this.rows; i++) {
            if (!this.grid[i][column].isEmpty) {
                fullCount++;
            }
        }
        return fullCount;
    }

    swapBlocks(row1, column1, row2, column2) {
        // this.grid[row2][column2].isEmpty = false;
        // this.grid[row2][column2].blockType = this.grid[row1][column1].blockType;
        // this.grid[row2][column2].sprite.destroy();
        // this.grid[row2][column2].sprite = this.grid[row1][column1].sprite;
        // this.grid[row1][column1].isEmpty = true;
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



    // sets a custom data on the item at (row, column)
    setCustomData(row, column, customData) {
        this.gameArray[row][column].customData = customData;
    }

    // returns an object with all connected items starting at (row, column)
    listConnectedItems(row, column) {
        this.colorToLookFor = this.gameArray[row][column].value;
        this.floodFillArray = [];
        this.floodFill(row, column);
        return this.floodFillArray;
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

    // returns true if (row, column) is already in floodFillArray array
    alreadyVisited(row, column) {
        let found = false;
        for (let i = 0; i < this.floodFillArray.length; i++) {
            if (this.floodFillArray[i].row == row && this.floodFillArray[i].column == column) {
                found = true;
            }
        }
        return found;
    }


    getFallingGems() {
        let fallingGems = [];
        for (let i = this.getRows() - 1; i >= 0; i--) {
            for (let j = 0; j < this.getColumns(); j++) {
                let emptySpaces = this.emptySpacesBelow(i, j);
                if (!this.isEmpty(i, j) && emptySpaces > 0) {
                    this.swapItems(i, j, i + emptySpaces, j)
                    fallingGems.push({
                        row: i + emptySpaces,
                        column: j,
                        deltaRow: emptySpaces
                    });
                }
            }
        }
        return fallingGems;
    }

    // swap the items at (row, column) and (row2, column2)
    swapItems(row, column, row2, column2) {
        let tempObject = Object.assign(this.gameArray[row][column]);
        this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
        this.gameArray[row2][column2] = Object.assign(tempObject);
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


    // replenishes the board and returns an object with movement information
    createNewGems() {
        let result = [];
        for (let i = 0; i < this.getColumns(); i++) {
            if (this.isEmpty(0, i)) {
                let emptySpaces = this.emptySpacesBelow(0, i) + 1;
                for (let j = 0; j < emptySpaces; j++) {
                    let randomValue = Math.floor(Math.random() * this.items) + 1;
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




}

