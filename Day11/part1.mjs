import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(...line.split('').map(Number));
}

// End template, start code
const globalIncrease = map => map.map(i => i + 1);
const getNeighbour = (i) => [
  (i % 10 === 0 ? -1 : i - 11), i - 10, ((i + 1) % 10 === 0 ? -1 : i - 9 ),
  (i % 10 === 0 ? -1 : i - 1 ), /* i */,((i + 1) % 10 === 0 ? -1 : i + 1 ),
  (i % 10 === 0 ? -1 : i + 9 ), i + 10, ((i + 1) % 10 === 0 ? -1 : i + 11),
].filter(i => i >= 0 && i < 100);

const flash = map => {
  const newMap = [...map];
  const flashed = Array(100).fill(false);
  let thisRoundFlashed = false;

  do {
    thisRoundFlashed = false;
    [...Array(100)].forEach((_ , i) => {
      if (newMap[i] > 9 && !flashed[i]) {
        getNeighbour(i).forEach(n => {
          newMap[n] = newMap[n] + 1;
        });
        flashed[i] = true;
        thisRoundFlashed = true;
      }
    }) 
  } while (thisRoundFlashed);

  return newMap;
}

const printMap = map => {
  console.log([
    map.slice( 0, 10),
    map.slice(10, 20),
    map.slice(20, 30),
    map.slice(30, 40),
    map.slice(40, 50),
    map.slice(50, 60),
    map.slice(60, 70),
    map.slice(70, 80),
    map.slice(80, 90),
    map.slice(90, 100),
  ].map(row => row.join()).join('\n'))
  return map;
}

// With generator and map
const countAfterFlashes = map => map.filter(i => i === 0).length;

function* stepper(map) {
  let state = [...map];
  while(true) {
    state = afterFlashes(flash(globalIncrease(state)))
    yield state;
  }
}

function processLines(map) {
  const step = stepper(map);
  return [...Array(100)].map(() => step.next().value).map(countAfterFlashes).sum();
}

// With reduce
// const countFlashes = map => map.filter(i => i > 9).length;

// function processLines(map) {
//   const result = [...Array(100)].reduce(({map: prev, count: prevCount}) => {
//     const increased = globalIncrease(prev)
//     const flashed = flash(increased);
//     const increment = countFlashes(flashed);
//     const newMap = afterFlashes(flashed);
//     return {map: newMap, count: prevCount + increment};
//   }, {map, count: 0});

//   return result.count;
// }

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
