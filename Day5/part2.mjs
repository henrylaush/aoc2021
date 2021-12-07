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
const isDia = ([x1, y1, x2, y2]) => Math.abs(x1-x2) === Math.abs(y1-y2);
const getStep = (i) => i === 0 ? 0 : (i > 0 ? 1 : -1)
const expandLine = ([x1, y1, steps, stepX, stepY]) => [...Array(steps + 1)].map((_, i) => [
    x1 + i * stepX, y1 + i * stepY
])

function processState(state) {
    const coords = state
        .filter(line => isVerHon(line) || isDia(line))
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
//     let board = [];

//     state
//         .filter(line => isVerHon(line) || isDia(line))
//         .forEach(([x1, y1, x2, y2]) => {
            
//             const diffX = (x2 - x1);
//             const stepX = diffX === 0 ? 0 : (diffX > 0 ? 1 : -1);
//             const diffY = (y2 - y1);
//             const stepY = diffY === 0 ? 0 : (diffY > 0 ? 1 : -1);
//             const steps = Math.max(Math.abs(diffX), Math.abs(diffY));

//             for(let i = 0; i <= steps; i++ ) {
//                 const tempX = x1 + i * stepX;
//                 const tempY = y1 + i * stepY;

//                 if (!board[tempX]) {board[tempX] = []}
//                 board[tempX][tempY] = (board[tempX][tempY] ?? 0) + 1
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
