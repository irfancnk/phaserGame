let grid = [];
let wordList = [
    "act",
    "ace",
    "baby",
    "hate",
    "tiger",
    "apple"
];

function createGrid() {
    for (var i = 0; i < 15; i++) {
        grid.push([]);
        for (var j = 0; j < 15; j++) {
            grid[i].push(".");
        }
    }
}

function printGrid() {
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
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
createGrid();

let firstWord = wordList[0];
let nextWord = wordList[1];

for (var i = 0; i < firstWord.length; i++) {
    grid[0][i] = firstWord[i];
}


printGrid();
console.log(nextWord);






























//
