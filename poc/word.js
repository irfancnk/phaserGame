// const rulesBtn = document.getElementById('rules-btn');
// const closeBtn = document.getElementById('close-btn');



const threeLetterWords = ["AGE", "AIR", "AND", "APP", "BAG", "BOY"];
const fourLetterWords = ["GIRL", "BABY", "STAR", "ARMY", "COOL", "CODE"];
const fiveLetterWords = ["BOARD", "APPLE", "TIGER", "WORLD", "BLACK"];


class WordGameController {

    constructor(gridSize) {
        this.grid = [];
        this.wordList = [];
        // this.wordList = [
        //     "EGG",
        //     "RACE",
        //     "AGE",
        //     "BABY",
        //     "HATE",
        //     "RETAILER",
        //     "APPLE"
        // ];
        this.gridSize = 0;
        this.boardWordList = [];
        this.leftWordList = [];
        this.initializeGame();
    }


    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


    initializeGame() {
        this.generateRandomWords();
        // Sort all the words by length, descending.
        this.sortWords();
        // Choose a grid size with safety factor of 6.
        this.gridSize = this.wordList[0].length * 4;
        // Clone chosen words to not placed array.
        this.leftWordList = [...this.wordList];
        // Create empty grid on desired size.
        for (var i = 0; i < this.gridSize; i++) {
            this.grid.push([]);
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i].push(".");
            }
        }
        // Take the first word and place it on the board.
        let currentTargetWordIndex = 0;
        let currentTargetWord = this.leftWordList[currentTargetWordIndex];
        let isPlaced = this.leftToRightInsert(currentTargetWord, this.gridSize / 2 - currentTargetWord.length, this.gridSize / 2, 0);
        let loopCount = 0;
        // Continue placing until all words are inserted.
        while(this.leftWordList.length !== 0) {
            loopCount += 1;
            if (loopCount > 1000) {
                return this.initializeGame();
            }
            // this.printGrid();
            currentTargetWord = this.leftWordList[currentTargetWordIndex];
            isPlaced = false;
            for (var i = 0; i < this.boardWordList.length; i++) {
                let currentBoardWord = this.boardWordList[i];
                if (currentBoardWord.word === currentTargetWord) {
                    continue;
                }
                let intersectionList = this.getUniqueIntersectionList(currentBoardWord.word, currentTargetWord);
                for (var j = 0; j < intersectionList.length; j++) {
                    let currentIntersectionChar = intersectionList[j];
                    let charOccurenceIndexesInBoardWord = this.getIntersectionOccurenceIndexes(currentBoardWord.word, currentIntersectionChar);
                    let charOccurenceIndexesInTargetWord = this.getIntersectionOccurenceIndexes(currentTargetWord, currentIntersectionChar);
                    for (var k = 0; k < charOccurenceIndexesInBoardWord.length; k++) {
                        let currentBoardWordOccurenceIndex = charOccurenceIndexesInBoardWord[k];
                        for (var t = 0; t < charOccurenceIndexesInTargetWord.length; t++) {
                            let currentTargetWordOccurenceIndex = charOccurenceIndexesInTargetWord[t];
                            if (currentBoardWord.axis === "H") {
                                let targetX = currentBoardWord.x + currentBoardWordOccurenceIndex;
                                let targetY = currentBoardWord.y - currentTargetWordOccurenceIndex;
                                if (this.canTopDownInsertWithoutInterfering(currentTargetWord, targetX, targetY, currentTargetWordOccurenceIndex)) {
                                    isPlaced = this.topDownInsert(currentTargetWord, targetX, targetY, currentTargetWordOccurenceIndex);
                                }
                            } else if (currentBoardWord.axis === "V") {
                                let targetX = currentBoardWord.x - currentTargetWordOccurenceIndex;
                                let targetY = currentBoardWord.y + currentBoardWordOccurenceIndex;
                                if (this.canLeftToRightInsertWithoutInterfering(currentTargetWord, targetX, targetY, currentTargetWordOccurenceIndex)) {
                                    isPlaced = this.leftToRightInsert(currentTargetWord, targetX, targetY, currentTargetWordOccurenceIndex);
                                }
                            }
                            if (isPlaced) {
                                break;
                            }
                        }
                        if (isPlaced) {
                            break;
                        }
                    }
                    if (isPlaced) {
                        break;
                    }
                }
                if (isPlaced) {
                    break;
                }
            }
        }
        return true;
    }

    getIntersectionOccurenceIndexes(currentBoardWord, currentIntersectionChar) {
        var indices = [];
        for (var i = 0; i < currentBoardWord.length; i++) {
            if (currentBoardWord[i] === currentIntersectionChar) indices.push(i);
        }
        return indices;
    }

    printGrid() {
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                let printText = " " + this.grid[i][j] + " ";
                process.stdout.write(printText);
            }
            console.log();
        }
    }

    sortWords() {
        this.wordList.sort( function(a, b) {
            return b.length - a.length;
        });
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

    canLeftToRightInsertWithoutInterfering(word, x, y, intersectionIndex) {
        for (var i = 0; i < word.length; i++) {
            if (this.grid[y][x+i] !== "." && i !== intersectionIndex) {
                return false;
            }
            let topNeighbour = this.grid[y-1][x+i];
            let bottomNeighbour = this.grid[y+1][x+i];
            let leftNeighbour = this.grid[y][x+i-1];
            let rightNeighbour = this.grid[y][x+i+1];
            if (i === intersectionIndex) {
                if (
                    /[A-Z]/.test(leftNeighbour)
                    || /[A-Z]/.test(rightNeighbour)
                ) {
                    return false;
                }
            }
            else if (i === intersectionIndex + 1) {
                if (
                   /[A-Z]/.test(topNeighbour)
                || /[A-Z]/.test(rightNeighbour)
                || /[A-Z]/.test(bottomNeighbour)) {
                    return false;
                }
            }
            else if (i === intersectionIndex - 1) {
                if (
                   /[A-Z]/.test(topNeighbour)
                || /[A-Z]/.test(leftNeighbour)
                || /[A-Z]/.test(bottomNeighbour)) {
                    return false;
                }
            }
            else {
                if (
                   /[A-Z]/.test(topNeighbour)
                || /[A-Z]/.test(leftNeighbour)
                || /[A-Z]/.test(rightNeighbour)
                || /[A-Z]/.test(bottomNeighbour)) {
                    return false;
                }
            }
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

    canTopDownInsertWithoutInterfering(word, x, y, intersectionIndex) {
        for (var i = 0; i < word.length; i++) {
            if (this.grid[y+i][x] !== "." && i !== intersectionIndex) {
                return false;
            }
            let topNeighbour = this.grid[y-1][x+i];
            let bottomNeighbour = this.grid[y+1][x+i];
            let leftNeighbour = this.grid[y][x+i-1];
            let rightNeighbour = this.grid[y][x+i+1];
            if (i === intersectionIndex) {
                if (
                    /[A-Z]/.test(topNeighbour)
                    || /[A-Z]/.test(bottomNeighbour)
                ) {
                    return false;
                }
            }
            else if (i === intersectionIndex + 1) {
                if (
                   /[A-Z]/.test(leftNeighbour)
                || /[A-Z]/.test(rightNeighbour)
                || /[A-Z]/.test(bottomNeighbour)) {
                    return false;
                }
            }
            else if (i === intersectionIndex - 1) {
                if (
                   /[A-Z]/.test(leftNeighbour)
                || /[A-Z]/.test(rightNeighbour)
                || /[A-Z]/.test(topNeighbour)) {
                    return false;
                }
            }
            else {
                if (
                   /[A-Z]/.test(topNeighbour)
                || /[A-Z]/.test(leftNeighbour)
                || /[A-Z]/.test(rightNeighbour)
                || /[A-Z]/.test(bottomNeighbour)) {
                    return false;
                }
            }
        }
        return true;
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

var wordGameController = new WordGameController(20);
wordGameController.printGrid();




// Rules and close event handlers
// rulesBtn.addEventListener('click', () => rules.classList.add('show'));
// closeBtn.addEventListener('click', () => rules.classList.remove('show'));
