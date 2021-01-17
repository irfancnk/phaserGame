// class Block {
//     constructor(param) {
//         this.row = param.row;
//         this.column = param.column;
//         this.blockType = param.blockType;
//         this.isEmpty = param.isEmpty;
//         this.sprite = param.sprite;
//     }

//     getSpriteName() {
//         return "solidColor" + this.blockType;
//     }

//     getSpriteCoordinates() {
//         return [gameOptions.boardOffset.x + gameOptions.gemSize * this.column, gameOptions.boardOffset.y + gameOptions.gemSize * this.row]
//     }
// }


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
            [1, 1, 1, 1, 1, 1, 1, 4, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 3, 1, 1, 1, 1, 4, 1],
            [1, 1, 3, 3, 1, 1, 1, 4, 1],
            [1, 1, 1, 3, 1, 2, 2, 1, 1],
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






}

