import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const state = {
  table: [],
  image: [],
};

function processLine(line) {
  if (line.length === 512) {
    state.table = Array.from(line).map(c => c === '.' ? 0 : 1);
  } else if (line.length) {
    state.image.push(Array.from(line).map(c => c === '.' ? 0 : 1));
  }
}

// End template, start code
function printImage(image) {
  console.log(image.map(row => row.map(v => v === 0 ? '.': '#').join('')).join('\n'));
}

function padImage(image, emptyAs) {
  const empty = Array(image[0].length + 4).fill(emptyAs);
  return [
    empty,
    empty,
    ...image.map(row => [emptyAs, emptyAs, ...row, emptyAs, emptyAs]), 
    empty,
    empty,
  ]
}

function getNeigbours(x, y) {
  return [
    [x - 1, y - 1],
    [x - 1, y    ],
    [x - 1, y + 1],
    [x    , y - 1],
    [x    , y    ],
    [x    , y + 1],
    [x + 1, y - 1],
    [x + 1, y    ],
    [x + 1, y + 1],
  ]
}

function getValueFrom(image, table, indices, emptyAs) {
  const idx = indices.reduce((p, [x,y]) => ((p << 1) + (image[x]?.[y] ?? emptyAs)), 0);
  return table[idx];
}

function convolution(image, table, emptyAs) {
  return image.map((row, x) => (
    row.map((_, y) => getValueFrom(image, table, getNeigbours(x,y), emptyAs))
  ));
}

function processLines({ table, image }) {
  const result = [...Array(50)].reduce((pImage, _, i) => (
    convolution(padImage(pImage, (i % 2 === 0 ? 0 : table[0])), table, (i % 2 === 0 ? 0 : table[0]))
  ), image);
  return result.flatMap(id => id).filter(Boolean).length;
}

// End code, start template
function handleProblem() {
    console.log(processLines(state));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
