import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
  const link = line.split('-');
  lines.push(link)
  lines.push([link[1], link[0]])
}

// End template, start code
const getMap = lines => lines
  .filter(([f, t]) => (
    f !== 'end' && t !== 'start'
  ))
  .gather(
    link => link[0],
    (existing, link) => [...(existing ?? []), link[1]],
  )

const shouldSkip = (visited, next) => {
  const count = visited[next];
  if (!count) return false;
  if (count >= 2) return true;
  return !!Object.entries(visited).find(([_, v]) => v >= 2);
};

// Recursive, don't care path
const getPaths = (map, next, visited) => {
  if (next === 'end') { return 1; }
  if (shouldSkip(visited, next)) { return 0; }

  let newVisited = { ...visited };
  if (next === next.toLowerCase()) { newVisited[next] = (newVisited[next] ?? 0) + 1 }

  return map[next].map(nextNode => getPaths(map, nextNode, newVisited)).sum();
}

function processLines(lines) {
  return getPaths(getMap(lines), 'start', {});
}

// Iter
// function processLines(lines) {
//   const map = getMap(lines);

//   const frontier = [{ next: 'start', path: [], visited: {} }];
//   const paths = [];

//   while (frontier.length) {
//     const { next, path, visited } = frontier.pop(); //DFS for memory and speed
//     if (next === 'end') { 
//       paths.push([...path, next]) 
//       continue;
//     }

//     if (shouldSkip(visited, next)) { continue; }
//     let newVisited = { ...visited };
//     if (next === next.toLowerCase()) { newVisited[next] = (newVisited[next] ?? 0) + 1 }

//     const nextPath = [...path, next];
//     const nextNodes = map[next].map(nextNode => ({ 
//       next: nextNode, path: nextPath, visited: newVisited 
//     }));

//     frontier.push(...nextNodes);
//   }

//   return paths.length;
// }

// End code, start template
function handleProblem() {
    console.log(processLines(lines));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
