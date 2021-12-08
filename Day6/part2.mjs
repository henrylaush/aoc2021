import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];
// End template, start code

function processLine(line) {
    lines.push(line.split(',').map(Number));
}

function groupByAges(fishes) {
    const ages = Array(9).fill(0); // 0 - 8 years old
    for (let i of fishes) {
        ages[i] = ages[i] + 1;
    }
    return ages;
}
const oneYearPassed = ([a0, a1, a2, a3, a4, a5, a6, a7, a8]) => [a1, a2, a3, a4, a5, a6, a7 + a0, a8, a0];

function processLines(lines) {
    const years = 256
    const ages = groupByAges(lines[0]);
    return [...Array(years)].reduce(oneYearPassed, ages).reduce((a,b) => a+b)
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
