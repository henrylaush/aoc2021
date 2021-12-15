import { createInterface } from 'readline';

import '../utils.mjs';
import aStar from '../tools/aStar.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split('').map(Number));
}

// End template, start code
const toKey = arr => arr.join('-');
const fromKey = str => str.split('-').map(Number)

const getNeighbour = ([endI, endJ]) => (ij) => {
  const [i, j] = fromKey(ij);
  return [
    [i+1, j],
    [i-1, j],
    [i, j+1],
    [i, j-1],
  ].filter(([i, j]) => i >= 0 && j >= 0 && i <= endI && j <= endJ)
  .map(toKey);
}

const d = (map) => (cur, ij) => {
  const [i, j] = fromKey(ij);
  return map[i][j]
};

const h = ([endI, endJ]) => (ij) => {
  const [i, j] = fromKey(ij);
  return (endI + endJ - i - j);
};

function processLines(map) {
  const end = [map.length - 1, map[0].length - 1];
  const result = aStar('0-0', toKey(end), getNeighbour(end), d(map), h(end));
  return result.slice(1).map(n => {
    const [i,j] = n.split('-').map(Number);
    return map[i][j];
  }).sum();
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
