import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split(' | ').map(str => str.split(' ')));
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
const buildTable = (options) => {
  if (options.size === 1) return [...options.values()];
  return [...options.values()].flatMap(char => {
    const nextSet = new Set(options);
    nextSet.delete(char);
    return buildTable(nextSet).map(i => char + i);
  })
}

const sortChars = (str) => str.split('').sort().join('');

const genDigit = ([a,b,c,d,e,f,g]) => ([
  [a, b, c, e, f, g],
  [c, f],
  [a, c, d, e, g],
  [a, c, d, f, g],
  [b, c, d, f],
  [a, b, d, f, g],
  [a, b, d, e, f, g],
  [a, c, f],
  [a, b, c, d, e, f, g],
  [a, b, c, d, f, g],
]).map(d => d.sort().join(''));

const compareArray = (arr1, arr2) => arr1.every(i => arr2.indexOf(i) > -1)

const isEqual = (bag1, bag2) => (
  Object.keys(bag1)
    .map((key) => [bag1, bag2].map(bag => bag[key]))
    .every(arrs => compareArray(...arrs))
)

const handleLine = ([input, output], table, baggedTable, gatherBy) => {
  const inputBag = input.gather(gatherBy);
  const row = baggedTable.findIndex(bag => isEqual(bag, inputBag));
  const sortedOutput = output.map(i => table[row].indexOf(i));
  return parseInt(sortedOutput.join(''));
}

const generatePossibleArrangements = () => buildTable(new Set('abcdefg')).map(genDigit);

function processLines(lines) {
  const table = generatePossibleArrangements();
  const gatherBy = item => item.length;
  const baggedTable = table.map(row => row.gather(gatherBy));
  return lines.map(line => handleLine(line.map(l => l.map(sortChars)), table, baggedTable, gatherBy)).sum();
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
