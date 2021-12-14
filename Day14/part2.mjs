import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

// End template, start code
const state = { template: '', lines: [], reactions: {} };

function processLine(line) {
  if (line.length === 0) return
  const split = line.split(' -> ');
  if (split.length === 1) {
    state.template = line;
    return
  }
  const [c1, c2] = split[0].split('');
  state.reactions[split[0]] = [c1 + split[1], split[1] + c2];
}

const react = reactions => pairs => (
  Object.entries(pairs)
    .flatMap(([k, v]) => {
      const reacted = reactions[k];
      return reacted ? reacted.map(r => [r, v]) : [[k, v]];
    })
    .gather(([k]) => k, (existing, [_, v]) => (existing ?? 0) + v)
)

const toPairs = (template) => (
  [...Array(template.length - 1)]
    .map((_, i) => template[i]+template[i+1])
    .gather(id => id, existing => (existing ?? 0) + 1)
)

const count = (pairs, startChar, endChar) => {
  const temp = [
    ...Object.entries(pairs).flatMap(([k,v]) => Array.from(k, c => [c, v])),
    [startChar, 1],
    [endChar, 1],
  ]
  .gather(([k]) => k, (existing, [_, v]) => (existing ?? 0) + v);

  return Object.values(temp).map(v => v / 2);
}

function processState(state) {
  const { template, reactions } = state;
  const start = toPairs(state.template);
  const reacted = [...Array(40)].reduce(react(reactions), start);
  const counts = count(reacted, template[0], template[template.length - 1]);
  return Math.max(...counts) - Math.min(...counts);
}

// End code, start template
function handleProblem() {
    console.log(processState(state));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
