import { createInterface } from 'readline';
import { aStar } from '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split('').map(Number));
}

// End template, start code
// Array + sort: Done in 39.18s.
// Binary Heap: Done in 4.97s.

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

const fillMap = (map) => {
  const [m0, m1, m2, m3, m4] = [...Array(5)].map((_ ,i) => map.map(row => row.map(r => ((r + i) >= 10) ? r + i - 9: r + i)))
  return [
    ...m0.map(row => [...Array(5)].flatMap((_ ,i) => row.map(r => ((r + i) >= 10) ? r + i - 9: r + i))),
    ...m1.map(row => [...Array(5)].flatMap((_ ,i) => row.map(r => ((r + i) >= 10) ? r + i - 9: r + i))),
    ...m2.map(row => [...Array(5)].flatMap((_ ,i) => row.map(r => ((r + i) >= 10) ? r + i - 9: r + i))),
    ...m3.map(row => [...Array(5)].flatMap((_ ,i) => row.map(r => ((r + i) >= 10) ? r + i - 9: r + i))),
    ...m4.map(row => [...Array(5)].flatMap((_ ,i) => row.map(r => ((r + i) >= 10) ? r + i - 9: r + i))),
  ]
}

function processLines(map) {
  const largeMap = fillMap(map)

  const end = [largeMap.length - 1, largeMap[0].length - 1];
  const result = aStar('0-0', toKey(end), getNeighbour(end), d(largeMap), h(end));
  return result.slice(1).map(n => {
    const [i,j] = n.split('-').map(Number);
    return largeMap[i][j];
  }).sum();
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
