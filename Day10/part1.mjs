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

const points = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
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

function processLines(lines) {
  return lines.map(parseLine).filter(({valid}) => !valid).map(({errorChar})=> points[errorChar]).sum();
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
