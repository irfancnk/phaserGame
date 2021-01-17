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
