import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split(' | ').map(str => str.split(' ')));
}
// End template, start code
const is1478 = (len) => (
  len === 2 || len === 4 || len === 3 || len === 7
)

function processLines(lines) {
  return lines.flatMap(parts => parts[1]).filter(output => is1478(output.length)).length
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
