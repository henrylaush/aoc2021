import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line.split(''));
}
// End template, start code

const table = {
  '}': '{',
  ']': '[',
  ')': '(',
  '>': '<',
}

const completionPoints = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4,
}

function parseLine(line) {
  return line.reduce((res, char) => {
    if (!res.valid) return res;

    const open = table[char];
    if (!open) {
      return {...res, stack: [...res.stack, char]}
    }

    const newStack = [...res.stack]
    const last = newStack.pop();
    if (last === open) {
      return {...res, stack: newStack};
    }
    return { valid: false, stack: newStack, errorChar: char};
  }, { valid: true, stack: [], errorChar: undefined });
}

function scoreStack(stack) {
  return stack.reduceRight((partial, char) => (
    partial * 5 + completionPoints[char]
  ), 0);
}

function processLines(lines) {
  const toBeCompleted = lines.map(parseLine).filter(({valid}) => valid)
  const scores = toBeCompleted.map(({stack}) => scoreStack(stack)).sort((a,b) => a-b);

  return scores[Math.floor(scores.length/2)];
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
