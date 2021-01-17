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

countFullBelow(row, column) {
    let fullCount = 0;
    for (let i = row + 1; i < this.rows; i++) {
        if (!this.grid[i][column].isEmpty) {
            fullCount++;
        }
    }
    return fullCount;
}

swapBlocks(list) {
    for (let i = 0; i < list.length; i++) {
        this.grid[list[i].block.row + list[i].delta][list[i].block.column].sprite = list[i].block.sprite;
        this.grid[list[i].block.row + list[i].delta][list[i].block.column].isEmpty = false;
        this.grid[list[i].block.row + list[i].delta][list[i].block.column].blockType = list[i].block.blockType;
        this.grid[list[i].block.row][list[i].block.column].isEmpty = true;
    }
}


createNewBlocks() {
    let randomBlockType;
    let newBlocks = [];
    for (let j = 0; j < this.columns; j++) {
        if (this.grid[0][j].isEmpty) {
            let fullCount = this.rows - this.countFullBelow(0, j);
            for (let count = fullCount - 1; count >= 0; count--) {
                randomBlockType = Math.floor(Math.random() * this.items) + 1;
                let newBlock = new Block({
                    row: count,
                    column: j,
                    blockType: randomBlockType,
                    isEmpty: false,
                    sprite: null
                })
                newBlocks.push(newBlock);
                this.grid[count][j] = newBlock;
            }
        }
    }
    return newBlocks;
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

