import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split(',').map(Number));
}

// utils
Object.defineProperties(Array.prototype, {
  sum: {
    value: function(getValue = id => id) { return this.reduce((partial, item) => partial + getValue(item), 0)}
  },
  all: {
    value: function(getValue = id => id) { return this.reduce((partial, item) => partial && !!getValue(item), true)}
  },
  any: {
    value: function(getValue = id => id) { return this.reduce((partial, item) => partial || !!getValue(item), false)}
  },
  gather: {
    value: function(getKey = id => id, combiner = (existing, value) => ([...(existing ?? []), value])) { 
      return this.map(item => [getKey(item), item]).reduce((bag, [key, value]) => ({ ...bag, [key]: combiner(bag[key], value) }), {})
    }
  }
})

// End template, start code
function processLines(lines) {

}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
