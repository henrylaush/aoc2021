import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split(',').map(Number));
}
// End template, start code

// Brute force for 1st start
function processLines(lines) {
    const result = [...Array(80)].reduce((fishes) => {
        const newFishes = fishes.filter(i => i === 0).length;
        const existing = fishes.map(i => i === 0 ? 6 : i - 1);
        return [...existing, ...([...Array(newFishes)].map(() => 8))];
    }, lines[0]);

    return result.length
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
