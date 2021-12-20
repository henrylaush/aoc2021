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
  const list = [];
  let level = 0;
  for (let c of line) {
    if( c === '[') { level++ }
    else if (c === ']') { level-- }
    else if (c === ',') { continue }
    else {
      list.push({ level, value: Number(c) });
    }
  }
  return list
}

function explode(list) {
  let cur = 0;
  while (cur < list.length - 1) {
    if (list[cur].level === 5 && list[cur + 1].level === 5) {
      const left = list[cur - 1];
      const p1 = list[cur];
      const p2 = list[cur + 1];
      const right = list[cur + 2];
      if (left) {
        left.value += p1.value
      }
      if (right) {
        right.value += p2.value
      }
      p1.level -= 1;
      p1.value = 0;
      list.splice(cur + 1, 1);
      return { didSomething: true, list };
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

    if (didSomething) { 
      // console.log('after explode: ', result); 
      continue 
    }
    
    const splitResult = split(result);
    result = splitResult.list;
    didSomething = splitResult.didSomething;
    // if (didSomething) { console.log('after split: ', result);}
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
