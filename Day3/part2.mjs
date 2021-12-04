import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split('').map(Number));
}

const bToD = (array) => parseInt(array.join(''), 2);

function commonAt(lines, pos) {
    const sum = lines.reduce((partial, line) => partial + line[pos], 0);
    return Number(sum >= lines.length / 2)
}

function search(lines, pos, keep) {
    if (lines.length === 1) return lines[0];

    const common = commonAt(lines, pos);
    const newLines = lines.filter(line => line[pos] === keep(common));

    return search(newLines, pos + 1, keep);
}

function processLines(lines) {
    const [ogr, co2] = [id => id, id => 1 - id].map(f => search(lines, 0, f)).map(bToD);
    return ogr * co2;
}

function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);