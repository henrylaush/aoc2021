import { createInterface } from 'readline';
import '../utils.mjs';
import { compose } from '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(line);
}

// End template, start code

function asList(line) {
  return Array.from(line).reduce((p, c) => {
    if( c === '[') return { ...p, level: p.level + 1 };
    else if (c === ']') return { ...p, level: p.level - 1 };
    else if (c === ',') return p;
    return { ...p, list: [...p.list, { level: p.level, value: Number(c) }]};
  }, { list: [], level: 0 }).list
}

function explode(list) { 
  let cur = 0;
  while (cur < list.length - 1) {
    if (list[cur].level === 5 && list[cur + 1].level === 5) {
      const left = list[cur - 1];
      const p1 = list[cur];
      const p2 = list[cur + 1];
      const right = list[cur + 2];
      const replacement = [
        ...(left ? [{ ...left, value: left.value + p1.value }] : []),
        { level: (p1.level - 1), value: 0 },
        ...(right ? [{ ...right, value: right.value + p2.value }] : []),
      ];
      const result = [
        ...list.slice(0, Math.max(0, cur - 1)),
        ...replacement,
        ...list.slice(cur + 3)
      ]
      return { didSomething: true, list: result };
    }
    cur++
  }
  return { didSomething: false, list };
}

function split(list) {
  return list.reduce((p, data) => (p.didSomething || data.value < 10 ) ? { 
    didSomething: p.didSomething,
    list: [...p.list, data],
  } : {
    didSomething: true,
    list: [
      ...p.list,
      {level: data.level + 1, value: Math.floor(data.value / 2)},
      {level: data.level + 1, value: Math.ceil(data.value / 2)},
    ]
  }, { didSomething: false, list: [] })
}

function add(l1, l2) {
  return [...l1, ...l2].map(data => ({ level: data.level + 1, value: data.value }));
}

function resolve(list) {
  let didSomething = true;
  let result = list;
  while (didSomething) {
    const exResult = explode(result);
    result = exResult.list;
    didSomething = exResult.didSomething;

    if (didSomething) { continue; }
    
    const splitResult = split(result);
    result = splitResult.list;
    didSomething = splitResult.didSomething;
  }
  return result
}

function flatten(list) {
  while(list.length !== 1) {
    let i = 0;
    while(true) {
      if (list[i].level === list[i+1]?.level) {
        list[i].value = 3* list[i].value  + 2 * list[i+1].value;
        list[i].level -= 1;
        list.splice(i + 1, 1);
        break;
      }
      i++
    }
  }
  return list[0].value;
}

function processLines(lines) {
  return flatten(lines.map(asList).reduce(compose(resolve)(add)))
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
