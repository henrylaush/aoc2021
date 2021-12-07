import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

let state = []

function processLine(line) {
    state.push(line.split(' -> ').flatMap(pair => pair.split(',')).map(Number));
}

// Util
const gather = (getKey) => (array) => array.map(getKey).reduce((bag, item) => ({ ...bag, [item]: (bag[item] ?? 0) + 1 }), {})

// Code
const isVerHon = ([x1, y1, x2, y2]) => x1 == x2 || y1 == y2;
const getStep = (i) => i === 0 ? 0 : (i > 0 ? 1 : -1)
const expandLine = ([x1, y1, steps, stepX, stepY]) => [...Array(steps + 1)].map((_, i) => [
    x1 + i * stepX, y1 + i * stepY
])

function processState(state) {
    const coords = state
        .filter(isVerHon)
        .map(([x1, y1, x2, y2]) => {
            const diffs = [x2 - x1, y2 - y1];
            const stepXY = diffs.map(getStep);
            const steps = Math.max(...diffs.map(Math.abs));
            return [x1, y1, steps, ...stepXY];
        })
        .flatMap(expandLine)
    
    return Object.values(gather(([x, y]) => `${x}-${y}`)(coords)).filter(i => i >= 2).length;
}

// function processState(state) {
//     return state
//         .filter(isVerHon)
//         .map(([x1, y1, x2, y2]) => {
//             const diffs = [x2 - x1, y2 - y1];
//             const stepXY = diffs.map(getStep);
//             const steps = Math.max(...diffs.map(Math.abs));
//             return [x1, y1, steps, ...stepXY];
//         })
//         .flatMap(([x1, y1, steps, stepX, stepY]) => {
//             return [...Array(steps + 1).keys()].map(i => [x1 + i * stepX, y1 + i * stepY])
//         })
//         .reduce((board, [x, y]) => {
//             const tempBoard = [...board]; // make me less guilty
//             if (!tempBoard[x]) {tempBoard[x] = []}
//             tempBoard[x][y] = (tempBoard[x][y] ?? 0) + 1
//             return tempBoard;
//         }, [])
//         .flatMap(i => i)
//         .filter(i => i >= 2)
//         .length;
// }

// function processState(state) {
//     let board = [];

//     state
//         .filter(([x1, y1, x2, y2]) => x1 == x2 || y1 == y2)
//         .forEach(([x1, y1, x2, y2]) => {
//             const startX = Math.min(x1, x2);
//             const endX = Math.max(x1, x2);
//             const startY = Math.min(y1, y2);
//             const endY = Math.max(y1, y2);
//             for(let i = startX; i <= endX; i++ ) {
//                 for(let j = startY; j <= endY; j++) {
//                     if (!board[i]) {board[i] = []}
//                     board[i][j] = (board[i][j] ?? 0) + 1
//                 }
//             }
//         });

//     return board.flatMap(i => i).filter(i => i >= 2).length;
// }

// End code, start template
function handleProblem() {
    console.log(processState(state));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
