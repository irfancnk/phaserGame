class BlastController {
    constructor(options) {
        this.gridRowCount = options.gridRowCount;
        this.gridColumnCount = options.gridColumnCount;
        this.gridItemCount = options.gridItemCount;
        this.moves = options.moves;
        this.goals = options.goals;
        this.grid = [];
        this.connectedBlockList = [];
    }

    initializeGrid() {
        let randomBlockType;
        for (let i = 0; i < this.gridRowCount; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.gridColumnCount; j++) {
                randomBlockType = boardConfiguration[i][j];
                // UNCOMMENT FOLLOWING LINE FOR RANDOMIZED INITIALIZATION
                // randomBlockType = Math.floor(Math.random() * this.gridItemCount) + 1;
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


    makeMove(callback) {
        this.moves -= 1;
        callback(this.moves);
    }

    checkGoals(callback, connectedBlockList) {
        let hit = this.goals.filter(x => x.type === connectedBlockList[0].blockType);
        if (hit.length > 0) {
            hit[0].amount = Math.max(0, hit[0].amount - connectedBlockList.length);
            callback(connectedBlockList[0].blockType, hit[0].amount);
        }
    }

    
}
