import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const state = {
  lines: [],
  folds: [],
};

function processLine(line) {
  if (line.trim().length === 0) { return; }
  if (line.startsWith("fold along ")) {
    state.folds.push(line.replace("fold along ", "").split('='));
    return;
  }

  const [x, y] = line.split(',').map(Number);
  state.lines.push({ x, y });
}

// End template, start code
function handleFold(points, axis, at) {
  return [...new Set(points.map(p => {
    const affected = p[axis];
    const newCoord = affected >= at ? (2 * at - affected ): affected;
    return {...p, [axis]: newCoord };
  }).map(({x, y}) => `${x}-${y}`))].map(s => s.split('-').map(Number));
}


function processState(state) {
  const [axis, step] = state.folds[0];
  return handleFold(state.lines, axis, Number(step)).length;
}

// End code, start template
function handleProblem() {
    console.log(processState(state));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
