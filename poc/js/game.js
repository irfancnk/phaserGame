var wordGameController = new WordGameController();
var game;
// tile size, in pixels
var tileSize = 40;
// number of tiles per row/column
var fieldSize = 10;
// different kind of tiles allowed
var tileTypes = 27
// array with all game tiles
var tileArray = [];
// game points
var points = 0;

function restartCallback() {
    location.reload();
}


function showRulesCallback() {
    rules.classList.add('show')
}

function closeRulesCallback() {
    rules.classList.remove('show')
}


function hintCallback() {
    for (var i = 0; i < tileArray.length; i++) {
        for (var j = 0; j < tileArray[i].length; j++) {
            if (tileArray[i][j].tileDesc.letter !== "." && !tileArray[i][j].tileDesc.show) {
                tileArray[i][j].tileDesc.show = true;
                return;
            }
        }
    }
}

function tryCallback() {
    let guess = document.getElementById("fname").value.toUpperCase();
    document.getElementById("fname").value = "";
    let guessList = wordGameController.boardWordList.filter(x => x.word === guess);
    if (guessList.length > 0) {
        let hit = guessList[0];
        if (hit.axis === "V") {
            for (var i = 0; i < guess.length; i++) {
                if (!tileArray[hit.y + i][hit.x].tileDesc.show) {
                    tileArray[hit.y + i][hit.x].tileDesc.show = true;
                    points += 1;
                }
            }
        } else if (hit.axis === "H") {
            for (var i = 0; i < guess.length; i++) {
                if (!tileArray[hit.y][hit.x + i].tileDesc.show) {
                    tileArray[hit.y][hit.x + i].tileDesc.show = true;
                    points += 1;
                }
            }
        }
    }

    // console.log(wordGameController.wordList);
    // console.log(wordGameController);
    // console.log(guess);
}



// THE GAME IS PRELOADING
function onPreload() {
    // loading the spritesheet with all tiles
    game.load.spritesheet("tiles", "assets/alphabet.png", tileSize, tileSize);
}

// THE GAME HAS BEEN CREATED
function onCreate() {
    // generating the game field
    for (i = 0; i < wordGameController.grid.length; i++) {
        tileArray[i] = [];
        for (j = 0; j < wordGameController.grid[0].length; j++) {
            var randomTile;
            var theTile = game.add.sprite(j * tileSize, i * tileSize, "tiles");
            if (wordGameController.grid[i][j] === ".") {
                randomTile = 26;
                theTile.tileDesc = {
                    letter : wordGameController.grid[i][j],
                    show : false,
                    i : i,
                    j : j
                }
            } else {
                randomTile = 27;
                theTile.tileDesc = {
                    letter : wordGameController.grid[i][j],
                    show : false,
                    i : i,
                    j : j
                }
                // randomTile = wordGameController.grid[i][j].charCodeAt(0) - 65;
            }
            // "frame" and "value" are custom attributes
            theTile.frame = randomTile;
            theTile.value = randomTile;
            tileArray[i][j] = theTile;
        }
    }
}


// THE GAME IS GOING TO BE UPDATED
function onUpdate() {
    document.getElementById("points").innerHTML = "Points : " + points;
    for (var i = 0; i < tileArray.length; i++) {
        for (var j = 0; j < tileArray[i].length; j++) {
            if (tileArray[i][j].tileDesc.letter !== "." && tileArray[i][j].tileDesc.show) {
                let tile = tileArray[i][j].tileDesc.letter.charCodeAt(0) - 65;
                // "frame" and "value" are custom attributes
                tileArray[i][j].frame = tile;
                tileArray[i][j].value = tile;
            }
        }
    }

    let anyLeft = false;
    for (var i = 0; i < tileArray.length; i++) {
        for (var j = 0; j < tileArray[i].length; j++) {
            if (tileArray[i][j].tileDesc.letter !== "." && !tileArray[i][j].tileDesc.show) {
                anyLeft = true;
            }
        }
    }
    if (!anyLeft) {
        document.getElementById("restartButton").disabled = false;
        document.getElementById("letters").innerHTML = "Good game, well played. Ez.";

    }

}



function onLoad() {
    let charList = [];
    for (var i = 0; i < wordGameController.wordList.length; i++) {
        let currentWord = wordGameController.wordList[i];
        for (var j = 0; j < currentWord.length; j++) {
            if (!charList.includes(currentWord[j])) {
                charList.push(currentWord[j]);
            }
        }
    }
    charList.sort();
    let chars = "";
    for (var i = 0; i < charList.length; i++) {
        chars += charList[i] + " ";
    }
    document.getElementById("letters").innerHTML = chars;
    game = new Phaser.Game(wordGameController.grid[0].length * tileSize, wordGameController.grid.length * tileSize, Phaser.CANVAS, "", {
        preload: onPreload,
        create: onCreate,
        update: onUpdate
    });
};


window.onload = onLoad;
