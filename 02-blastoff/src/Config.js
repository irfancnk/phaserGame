let game;
let gameOptions = {
    blockSize: 80,
    boardOffset: {
        x: 55,
        y: 400
    },
    destroySpeed: 200,
    fallSpeed: 50,
    shakeSpeed: 40,
    goals: [
        {
            type: 1,
            amount: 20
        },
        {
            type: 2,
            amount: 20
        }
    ],
    moves: 20
}


let boardConfiguration = [
    [3, 3, 3, 4, 1, 1, 4, 2, 3],
    [3, 2, 2, 2, 1, 4, 3, 3, 2],
    [2, 3, 1, 3, 1, 4, 4, 3, 3],
    [3, 3, 1, 1, 3, 2, 2, 4, 3],
    [3, 2, 4, 1, 4, 2, 2, 4, 4],
    [3, 2, 1, 4, 1, 2, 4, 2, 3],
    [2, 3, 3, 2, 2, 3, 2, 3, 1],
    [4, 4, 1, 4, 2, 3, 4, 1, 4],
    [4, 4, 2, 3, 3, 3, 4, 2, 2]
];