import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split('').map(Number));
}
// End template, start code

const bToD = (array) => parseInt(array.join(''), 2);

function processLines(lines) {
    const sums = lines[0].map(
        (_, i) => lines.reduce((partial, line) => partial + line[i], 0)
    );

    const gRate = bToD(sums.map(sum => sum > lines.length / 2).map(Number));
    const eRate = ~gRate + (1 << lines[0].length);
    return gRate * eRate;
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);

// Old code dump site after refinement

// const bToD = (array) => array.reduce((partial, item) => (
//     (partial << 1) | item
// ));

// function bToD(array) {
//     const lenM1 = array.length -1;
//     return array.reduce((partial, item, i) => (
//         partial + item * Math.pow(2, lenM1 - i)
//     ), 0);
// }

// function processLines(lines) {
    // const sums = [];
    // for(let i = 0; i < lines[0].length; i++){
    //     let sum = 0;
    //     for(let j = 0; j < lines.length; j++) {
    //         sum = sum + lines[j][i];
    //     }
    //     sums.push(sum);
    // }

    // const result = [
    //     sums.map(sum => sum > lines.length / 2 ? 1 : 0),
    //     sums.map(sum => sum <= lines.length / 2 ? 1 : 0),
    // ].map(bToD);
    // return result[0] * result[1]
// }