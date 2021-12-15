import { createInterface } from 'readline';

import { compose } from '../utils.mjs';
import aStar from '../tools/aStar.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split('').map(Number));
}

// End template, start code
// Array + sort: big mac 39.18s. small mac 5.12s.
// Binary Heap: big mac 4.97s. small mac 5.42s.

const toKey = arr => arr.join('-');
const fromKey = str => str.split('-').map(Number)

const getNeighbour = ([endI, endJ]) => compose(([i, j]) => [
  [i+1, j],
  [i-1, j],
  [i, j+1],
  [i, j-1],
].filter(([i, j]) => i >= 0 && j >= 0 && i <= endI && j <= endJ)
.map(toKey))(fromKey);

const getValue = (map) => ([i, j]) => map[i][j];

// Slow but more fun
// const d = (map) => compose(getValue(map))(compose(fromKey)((cur, ij) => ij));

const d = (map) => (cur, ij) => getValue(map)(fromKey(ij));

const h = ([endI, endJ]) => compose(([i, j]) => (endI + endJ - i - j))(fromKey);

const horAdd = (...arrs) => [...Array(arrs[0].length)].map((_, i) => arrs.flatMap(arr => arr[i]))

const fillMap = (map) => {
  const [m1, m2, m3, m4, m5, m6, m7, m8] = [...Array(8)]
    .map((_ ,i) => map.map(row => row.map(r => (r + i + 1 >= 10) ? r + i - 8: r + i + 1)))

  return [
    ...horAdd(map, m1, m2, m3, m4),
    ...horAdd(m1,  m2, m3, m4, m5),
    ...horAdd(m2,  m3, m4, m5, m6),
    ...horAdd(m3,  m4, m5, m6, m7),
    ...horAdd(m4,  m5, m6, m7, m8),
  ]
}

function processLines(map) {
  const largeMap = fillMap(map);
 
  const end = [largeMap.length - 1, largeMap[0].length - 1];
  const result = aStar('0-0', toKey(end), getNeighbour(end), d(largeMap), h(end));
  return result.slice(1).map(compose(([i, j]) => largeMap[i][j])(fromKey)).sum();
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
