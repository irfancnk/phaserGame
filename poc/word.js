const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');

let grid = [];
let wordList = [
    "act",
    "ace",
    "baby",
    "hate",
    "tiger",
    "apple"
];

function createGrid(gridSize) {
    for (var i = 0; i < gridSize; i++) {
        grid.push([]);
        for (var j = 0; j < gridSize; j++) {
            grid[i].push(".");
        }
    }
}

function printGrid(gridSize) {
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            let printText = " " + grid[i][j] + " ";
            // process.stdout.write(printText);
        }
        console.log();
    }
}

function sortWords() {
    wordList.sort( function(a, b) {
        return b.length - a.length;
    });
}


function checkIntersection() {

}

sortWords();
createGrid(20);

let firstWord = wordList[0];
let nextWord = wordList[1];

for (var i = 0; i < firstWord.length; i++) {
    grid[0][i] = firstWord[i];
}


printGrid(20);
console.log(nextWord);


























// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
