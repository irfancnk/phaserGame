
try {
    const rulesBtn = document.getElementById('rules-btn');
    const closeBtn = document.getElementById('close-btn');
    // Rules and close event handlers
    rulesBtn.addEventListener('click', () => rules.classList.add('show'));
    closeBtn.addEventListener('click', () => rules.classList.remove('show'));
} catch (e) {
    // NOT NODE ENV
}


const threeLetterWords = ["AGE", "AIR", "AND", "APP", "BAG", "BOY"];
const fourLetterWords = ["GIRL", "BABY", "STAR", "ARMY", "COOL", "CODE"];
const fiveLetterWords = ["BOARD", "APPLE", "TIGER", "WORLD", "BLACK"];


class WordGameController {

    constructor() {
        this.grid = [];
        this.wordList = [];
        this.gridSize = 0;
        this.boardWordList = [];
        this.leftWordList = [];
        this.initializeGame();
    }


    createEmptyGrid() {
        for (var i = 0; i < this.gridSize; i++) {
            this.grid.push([]);
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i].push(".");
            }
        }
    }

    initializeGame() {
        this.generateRandomWords();
        // Sort all the words by length, descending.
        this.sortWords();
        // Clone chosen words to not placed array.
        this.leftWordList = [...this.wordList];
        // Choose a grid size with safety factor of 6.
        this.gridSize = this.wordList[0].length * 6;
        // Create empty grid on desired size.
        this.createEmptyGrid();
        // Take the first word and place it on the board.
        let currentTargetWordIndex = 0;
        let currentTargetWord = this.leftWordList[currentTargetWordIndex];
        let isPlaced = this.leftToRightInsert(currentTargetWord, this.gridSize / 2 - currentTargetWord.length, this.gridSize / 2, 0);
        let loopCount = 0;
        let concatResult = false;
        // Continue placing until all words are inserted.
        while(this.leftWordList.length !== 0 && currentTargetWordIndex < this.leftWordList.length ) {
            isPlaced = false;
            currentTargetWord = this.leftWordList[currentTargetWordIndex];
            for (var i = 0; i < this.boardWordList.length; i++) {
                let currentBoardWord = this.boardWordList[i];
                concatResult = this.tryConcat(currentTargetWord, currentBoardWord);
                if (concatResult) {
                    break;
                }
            }
            if (!concatResult) {
                currentTargetWordIndex += 1;
            } else {
                currentTargetWordIndex += 0;
            }
        }
        this.cropGrid();
        return true;
    }

    cropGrid() {
        let croppedGrid = [];
        let topY = this.gridSize, botY = 0;
        let leftX = this.gridSize, rightX = 0;
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] !== ".") {
                    if (j < leftX) {
                        leftX = j;
                    }
                    if (j > rightX) {
                        rightX = j;
                    }
                    if (i < topY) {
                        topY = i;
                    }
                    if (i > botY) {
                        botY = i;
                    }
                }
            }
        }
        for (var i = topY; i <= botY; i++) {
            var newArray = [];
            for (var j = leftX; j <= rightX; j++) {
                newArray.push(this.grid[i][j]);
            }
            croppedGrid.push(newArray);
        }
        this.grid = croppedGrid;
    }


    tryConcat(currentTargetWord, currentBoardWord) {
        let intersectionList = this.getUniqueIntersectionList(currentBoardWord.word, currentTargetWord);
        if (intersectionList.length > 0) {
            for (var i = 0; i < intersectionList.length; i++) {
                let currentIntersectionChar = intersectionList[i];
                let charOccurenceIndexesInBoardWord = this.getIntersectionOccurenceIndexes(currentBoardWord.word, currentIntersectionChar);
                let charOccurenceIndexesInTargetWord = this.getIntersectionOccurenceIndexes(currentTargetWord, currentIntersectionChar);
                let isSuitable = this.isCharSuitable(
                    currentIntersectionChar,
                    charOccurenceIndexesInBoardWord,
                    charOccurenceIndexesInTargetWord,
                    currentTargetWord,
                    currentBoardWord
                );
                if (isSuitable) {
                    return true;
                }
            }
        }
        return false;

    }

    isCharSuitable(currentIntersectionChar, charOccurenceIndexesInBoardWord, charOccurenceIndexesInTargetWord, currentTargetWord, currentBoardWord) {
        let targetX;
        let targetY;
        for (var i = 0; i < charOccurenceIndexesInBoardWord.length; i++) {
            let currentBoardWordOccurenceIndex = charOccurenceIndexesInBoardWord[i];
            for (var j = 0; j < charOccurenceIndexesInTargetWord.length; j++) {
                let currentTargetWordOccurenceIndex = charOccurenceIndexesInTargetWord[j];
                if (currentBoardWord.axis === "H") {
                    targetX = currentBoardWord.x + currentBoardWordOccurenceIndex;
                    targetY = currentBoardWord.y - currentTargetWordOccurenceIndex;
                    if (this.canTopDownInsert(currentTargetWord, targetX, targetY, currentTargetWordOccurenceIndex)) {
                        let isPlaced = this.topDownInsert(currentTargetWord, targetX, targetY, currentTargetWordOccurenceIndex);
                        return true;
                    }
                } else if (currentBoardWord.axis === "V") {
                    targetX = currentBoardWord.x - currentTargetWordOccurenceIndex;
                    targetY = currentBoardWord.y + currentBoardWordOccurenceIndex;
                    if (this.canLeftToRightInsert(currentTargetWord, targetX, targetY, currentTargetWordOccurenceIndex)) {
                        let isPlaced = this.leftToRightInsert(currentTargetWord, targetX, targetY, currentTargetWordOccurenceIndex);
                        return true;
                    }
                }

            }
        }
        return false;
    }


    canTopDownInsert(word, x, y, intersectionIndex) {
        const regex = RegExp(/[A-Z]/);
        for (var i = 0; i < word.length; i++) {
            let currentGridPoint = this.grid[y+i][x];
            let topNeighbour     = this.grid[y+i-1][x];
            let bottomNeighbour  = this.grid[y+i+1][x];
            let leftNeighbour    = this.grid[y+i][x-1];
            let rightNeighbour   = this.grid[y+i][x+1];
            if (i === intersectionIndex) {
                if (regex.test(topNeighbour) || regex.test(bottomNeighbour)) {
                    return false;
                }
            } else if (i === intersectionIndex + 1) {
                if (regex.test(leftNeighbour) || regex.test(rightNeighbour) || regex.test(bottomNeighbour)) {
                    return false;
                }
            } else if (i === intersectionIndex - 1) {
                if (regex.test(leftNeighbour) || regex.test(rightNeighbour) || regex.test(topNeighbour)) {
                    return false;
                }
            } else {
                if (regex.test(leftNeighbour) || regex.test(rightNeighbour) || regex.test(topNeighbour) || regex.test(bottomNeighbour)) {
                    return false;
                }
            }
        }
        return true;
    }


    canLeftToRightInsert(word, x, y, intersectionIndex) {
        const regex = RegExp(/[A-Z]/);
        for (var i = 0; i < word.length; i++) {
            let currentGridPoint = this.grid[y][x+i];
            let topNeighbour     = this.grid[y-1][x+i];
            let bottomNeighbour  = this.grid[y+1][x+i];
            let leftNeighbour    = this.grid[y][x+i-1];
            let rightNeighbour   = this.grid[y][x+i+1];
            if (i === intersectionIndex) {
                if (regex.test(leftNeighbour) || regex.test(rightNeighbour)) {
                    return false;
                }
            } else if (i === intersectionIndex + 1) {
                if (regex.test(topNeighbour) || regex.test(bottomNeighbour) || regex.test(rightNeighbour)) {
                    return false;
                }
            } else if (i === intersectionIndex - 1) {
                if (regex.test(topNeighbour) || regex.test(bottomNeighbour) || regex.test(leftNeighbour)) {
                    return false;
                }
            } else {
                if (regex.test(leftNeighbour) || regex.test(rightNeighbour) || regex.test(topNeighbour) || regex.test(bottomNeighbour)) {
                    return false;
                }
            }
        }
        return true;
    }




    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


    getIntersectionOccurenceIndexes(currentBoardWord, currentIntersectionChar) {
        var indices = [];
        for (var i = 0; i < currentBoardWord.length; i++) {
            if (currentBoardWord[i] === currentIntersectionChar) indices.push(i);
        }
        return indices;
    }


    leftToRightInsert(word, x, y, intersectionIndex) {
        for (var i = 0; i < word.length; i++) {
            this.grid[y][x + i] = word[i];
        }
        this.boardWordList.push({
            "word": word,
            "axis": "H",
            "x": x,
            "y": y
        });
        let index = this.leftWordList.indexOf(word);
        if (index > -1) {
            this.leftWordList.splice(index, 1);
        }
        return true;
    }


    topDownInsert(word, x, y, intersectionIndex) {
        for (var i = 0; i < word.length; i++) {
            this.grid[y + i][x] = word[i];
        }
        this.boardWordList.push({
            "word": word,
            "axis": "V",
            "x": x,
            "y": y
        });
        let index = this.leftWordList.indexOf(word);
        if (index > -1) {
            this.leftWordList.splice(index, 1);
        }
        return true;
    }


    printGrid() {
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                let printText = " " + this.grid[i][j] + " ";
                try {
                    process.stdout.write(printText);
                } catch (e) {
                    // NOT NODE ENV
                }
            }
            console.log();
        }
    }

    sortWords() {
        this.wordList.sort( function(a, b) {
            return b.length - a.length;
        });
    }


    getUniqueIntersectionList(word1, word2) {
        let word1CharArray = word1.split('');
        let word2CharArray = word2.split('');
        return [...new Set(word1CharArray.filter(x => word2CharArray.indexOf(x) !== -1))];
    }


    generateRandomWords() {
        let words = [];
        let randomInt = this.getRandomInt(threeLetterWords.length);
        words.push(threeLetterWords[randomInt]);
        while (words.indexOf(threeLetterWords[randomInt]) !== -1) {
            randomInt = this.getRandomInt(threeLetterWords.length);
        }
        words.push(threeLetterWords[randomInt]);
        randomInt = this.getRandomInt(fourLetterWords.length);
        words.push(fourLetterWords[randomInt]);
        while (words.indexOf(fourLetterWords[randomInt]) !== -1) {
            randomInt = this.getRandomInt(fourLetterWords.length);
        }
        words.push(fourLetterWords[randomInt]);
        randomInt = this.getRandomInt(fiveLetterWords.length);
        words.push(fiveLetterWords[randomInt]);
        while (words.indexOf(fiveLetterWords[randomInt]) !== -1) {
            randomInt = this.getRandomInt(fiveLetterWords.length);
        }
        words.push(fiveLetterWords[randomInt]);
        this.wordList = words;
    }



}

var wordGameController = new WordGameController();
var phaserController = null;
try {
    phaserController = new PhaserController();
} catch (e) {
    // NODE ENV
}
wordGameController.printGrid();




//
