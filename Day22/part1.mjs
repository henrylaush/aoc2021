import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
  const [type, ranges] = line.split(' ');
  const [xRange, yRange, zRange] = ranges
    .replace('x=', '')
    .replace('y=', '')
    .replace('z=', '')
    .split(',')
    .map(range => range.split('..').map(Number));
    lines.push({ type, x: xRange, y: yRange, z: zRange });
}

// End template, start code
function withinRange([low, high]) {
  return low >= -50 && high <= 50
}

function processLines(lines) {
  const onLights = new Set();
  for(let l of lines) {
    if (!withinRange(l.x) || !withinRange(l.y) || !withinRange(l.z)) { continue; }
    for(let x = l.x[0]; x <= l.x[1]; x++ ) {
      for(let y = l.y[0]; y <= l.y[1]; y++ ) {
        for(let z = l.z[0]; z <= l.z[1]; z++ ) {
          const key = `${x},${y},${z}`;
          if (l.type === 'on') {
            onLights.add(key);
          } else if (onLights.has(key)) {
            onLights.delete(key);
          } 
        }
      }
    }
  }
  return onLights.size;
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
