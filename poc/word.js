// const rulesBtn = document.getElementById('rules-btn');
// const closeBtn = document.getElementById('close-btn');


class WordGameController {

    constructor(gridSize) {
        this.grid = [];
        this.wordList = [
            // "act",
            "ace",
            "baby",
            "hate",
            "tiger",
            "apple"
        ];
        this.gridSize = 0;
        this.boardWordList = [];
        this.leftWordList = [];
        this.initializeGame();
    }

    initializeGame() {
        // Sort all the words by length, descending.
        this.sortWords();
        this.gridSize = this.wordList[0].length * 6;
        this.leftWordList = [...this.wordList];
        // Create empty grid on desired size.
        for (var i = 0; i < this.gridSize; i++) {
            this.grid.push([]);
            for (var j = 0; j < this.gridSize; j++) {
                this.grid[i].push(".");
            }
        }
        // Take the first word and place it on the board.
        let currentWord = this.wordList[0];
        let isPlaced = this.leftToRightInsert(currentWord, this.gridSize / 2 - currentWord.length, this.gridSize / 2, 0);

        while(this.leftWordList.length !== 0) {
            currentWord = this.leftWordList[0];
            for (var i = 0; i < this.boardWordList.length; i++) {
                let intersection = this.getIntersection(this.boardWordList[i].word, currentWord);
                if (intersection.length > 0) {
                    let currentIntersectionChar = intersection[0];
                    let intersectionIndexOnBoardWord = this.boardWordList[i].word.indexOf(currentIntersectionChar);
                    let intersectionIndexOnCurrentWord = currentWord.indexOf(currentIntersectionChar);
                    if (this.boardWordList[i].axis === "H") {
                        let targetX = this.boardWordList[i].x + intersectionIndexOnBoardWord;
                        let targetY = this.boardWordList[i].y - intersectionIndexOnCurrentWord;
                        this.topDownInsert(currentWord, targetX, targetY, intersectionIndexOnCurrentWord);
                        break;
                    } else if (this.boardWordList[i].axis === "V") {
                        let targetX = this.boardWordList[i].x - intersectionIndexOnCurrentWord;
                        let targetY = this.boardWordList[i].y + intersectionIndexOnBoardWord;
                        this.leftToRightInsert(currentWord, targetX, targetY, intersectionIndexOnCurrentWord);
                        break;
                    }
                }
            }
        }
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
        // console.log(this.checkLeftToRightInterfere(word, x, y));
        console.log(intersectionIndex);

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

    checkLeftToRightInterfere() {

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

    getIntersection(word1, word2) {
        let word1CharArray = word1.split('');
        let word2CharArray = word2.split('');
        return word1CharArray.filter(x => word2CharArray.indexOf(x) !== -1);
    }


}

var wordGameController = new WordGameController(20);
wordGameController.printGrid();




// Rules and close event handlers
// rulesBtn.addEventListener('click', () => rules.classList.add('show'));
// closeBtn.addEventListener('click', () => rules.classList.remove('show'));
