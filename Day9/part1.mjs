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
function processLines(map) {
  const lows = [];
  for (let i = 0; i < map.length; i++ ) {
    for(let j = 0; j < map[i].length; j++ ) {
      const mij = map[i][j]
      const isSmallest = [
        (map[i+1] ?? [] )[j],
        (map[i-1] ?? [] )[j],
        (map[i] ?? [] )[j+1],
        (map[i] ?? [] )[j-1]
      ].filter(n => n != null).every(n => n > mij)
      if (isSmallest) lows.push(mij)
    }
  }
  return lows.sum() + lows.length
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
