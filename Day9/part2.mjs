import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split('').map(Number));
}

// utils
Object.defineProperties(Array.prototype, {
  sum: {
    value: function(getValue = id => id) { return this.reduce((partial, item) => partial + getValue(item), 0)}
  },
  gather: {
    value: function(getKey = id => id, combiner = (existing, value) => ([...(existing ?? []), value])) {
      return this.map(item => [getKey(item), item]).reduce((bag, [key, value]) => ({ ...bag, [key]: combiner(bag[key], value) }), {})
    }
  }
})

// End template, start code
const getNeighbour = ([i, j]) => [
  [i+1, j],
  [i-1, j],
  [i, j+1],
  [i, j-1],
]


function findLows(map) {
  const lows = [];
  for (let i = 0; i < map.length; i++ ) {
    for(let j = 0; j < map[i].length; j++ ) {
      const mij = map[i][j]
      const isSmallest = getNeighbour([i,j])
        .map(([i,j]) => (map[i] ?? [])[j])
        .filter(n => n != null)
        .every(n => n > mij)
      if (isSmallest) lows.push([i, j])
    }
  }
  return lows
}

const basinSize = (map) => (low) => {
  const visited = new Set();
  const frontier = [low];
  let size = 0;

  while(frontier.length) {
    const [i, j] = frontier.shift();
    const key = i + '-' + j;
    const mij = (map[i] ?? [])[j];

    if (visited.has(key) || mij == null || mij === 9) continue;

    visited.add(key);

    size = size + 1

    frontier.push(...getNeighbour([i, j]))
  }
  return size
}

function processLines(map) {
  return findLows(map).map(basinSize(map)).sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a * b);
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
