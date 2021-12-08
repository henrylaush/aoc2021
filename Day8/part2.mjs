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

const genDigit = ([a,b,c,d,e,f,g]) => ([
  a+b+c+e+f+g,
  c+f,
  a+c+d+e+g,
  a+c+d+f+g,
  b+c+d+f,
  a+b+d+f+g,
  a+b+d+e+f+g,
  a+c+f,
  a+b+c+d+e+f+g,
  a+b+c+d+f+g,
])

const compareArray = (arr1, arr2) => {
  let same = true;
  for(let i of arr1) {
    same = same && (arr2.indexOf(i) > -1)
  }
  return same;
}

const sortChars = (str) => str.split('').sort().join('')

const isEqual = (bag1, bag2) => {
  let same = true;

  for (let key of Object.keys(bag1)) {
    if (!same) break;
    const arr1 = bag1[key].map(sortChars);
    const arr2 = bag2[key].map(sortChars);
    same = same && compareArray(arr1, arr2)
  }
  return same;
}

const handleLine = (input, output, table, baggedTable, bagger) => {
  const inputBag = bagger(input);
  const row = baggedTable.reduce((p, {bag, i}) => {
    if(p) return p;
    if (isEqual(bag, inputBag)) {
      return i;
    }
  }, undefined)
  const sorted = table[row].map(sortChars);
  const sortedOutput = output.map(sortChars).map(i => sorted.indexOf(i));
  return parseInt(sortedOutput.join(''));
}

function processLines(lines) {
  const set = new Set('abcdefg');
  const table = buildTable(set).map(genDigit);
  const bagger = gather(item => item.length);
  const baggedTable = table.map(bagger).map((bag, i) => ({bag, i}));
  const result = lines.map(line => handleLine(line[0], line[1], table, baggedTable, bagger));
  return result.reduce((a,b) => a+b);
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
