import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const state = { template: '', lines: [] };

function processLine(line) {
  if (line.length === 0) return
  const split = line.split(' -> ');
  if (split.length === 1) {
    state.template = line;
    return
  }
  state.lines.push(split);
}

// End template, start code
const react = (start, reactions) => (
  [...Array(start.length - 1)].reduce((p, _, i) => {
    const char1 = start[i];
    const char2 = start[i+1];
    const mid = reactions[char1 + char2];
    return p + (mid ?? '') + char2
  }, start[0])
)

function processState(state) {
  const start = state.template;
  const reactions = Object.fromEntries(state.lines);
  const stat = [...Array(10)]
    .reduce((p) => react(p, reactions), start)
    .split('')
    .gather(id => id, existing => (existing ?? 0) + 1);

  const counts = Object.values();
  return Math.max(...counts) - Math.min(...counts);
}

// End code, start template
function handleProblem() {
    console.log(processState(state));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
