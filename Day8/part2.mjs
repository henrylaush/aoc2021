import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split(' | ').map(str => str.split(' ')));
}
// End template, start code
const buildTable = (options) => {
  if (options.size === 1) return [...options.values()];
  return [...options.values()].flatMap(char => {
    const nextSet = new Set(options);
    nextSet.delete(char);
    return buildTable(nextSet).map(i => char + i);
  })
}

const gather = (getKey) => (array) => array.map(item => [getKey(item), item]).reduce((bag, [key, value]) => ({ ...bag, [key]: [...(bag[key] ?? []), value] }), {})

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

const compareArray = (arr1, arr2) => (
  arr1.reduce((same, i) => same && (arr2.indexOf(i) > -1), true)
)

const isEqual = (bag1, bag2) => (
  Object.keys(bag1)
    .map((key) => [bag1, bag2].map(bag => bag[key]))
    .reduce((same, [arr1, arr2]) => same && compareArray(arr1, arr2), true)
)

const handleLine = ([input, output], table, baggedTable, bagger) => {
  const inputBag = bagger(input);
  const row = baggedTable.reduce((p, {bag, i}) => (
    (p || !isEqual(bag, inputBag) ) ? p : i
  ), undefined)
  const sortedOutput = output.map(i => table[row].indexOf(i));
  return parseInt(sortedOutput.join(''));
}

const generatePossibleArrangements = () => buildTable(new Set('abcdefg')).map(genDigit);

function processLines(lines) {
  const table = generatePossibleArrangements();
  const bagger = gather(item => item.length);
  const baggedTable = table.map(bagger).map((bag, i) => ({ bag, i }));
  const result = lines.map(line => handleLine(line.map(l => l.map(sortChars)), table, baggedTable, bagger));
  return result.reduce((a,b) => a+b);
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
