import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split(',').map(Number));
}
// End template, start code

function fuelAtPoint(positions, point) {
    return positions.map(pos => Math.abs(pos - point)).reduce((a,b)=> a+b);
}

function processLines(lines) {
    const line = lines[0]
    const max = Math.max(...line)
    const costs = [...Array(max)].map((_, i) => fuelAtPoint(line, i));
    return Math.min(...costs);
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
