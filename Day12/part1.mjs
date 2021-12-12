import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
  const link = line.split('-');
  lines.push(link);
  if (link[0] !== 'start') {
    lines.push([link[1], link[0]])
  }
}

// End template, start code
const getMap = lines => lines.gather(
  link => link[0],
  (existing, link) => [...(existing ?? []), link[1]],
)

function processLines(lines) {
  const map = getMap(lines);

  const frontier = [{ next: 'start', path: [], visited: new Set(), }];
  const paths = [];

  while (frontier.length) {
    const { next, path, visited } = frontier.shift();
    if (next === 'end') { 
      paths.push([...path, next]) 
      continue;
    }

    if (visited.has(next)) { continue; }
    const newVisited = new Set(visited);
    if (next === next.toLowerCase()) { newVisited.add(next); }

    const nextPath = [...path, next];
    const nextNodes = map[next].map(nextNode => ({ 
      next: nextNode, path: nextPath, visited: newVisited 
    }));

    frontier.push(...nextNodes);
  }

  return paths.length;
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
