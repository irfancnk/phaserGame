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
            process.stdout.write(printText);
        }
        console.log("\n");
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






























//
