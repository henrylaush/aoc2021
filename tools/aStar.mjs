import Heap from './Heap.mjs';

function makePath(cameFrom, end) {
  let current = end;
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)
    path.push(current);
  }
  return path.reverse();
}

// start, end and return of getNeighbour must be of T, T and T[]
// and T needs to be able to be key in Map
export default function aStar(start, end, getNeighbour, d, h) {
  const frontier = new Heap();
  const hStart = h(start);
  frontier.insert(start, hStart);
  
  const cameFrom = new Map();
  
  const gScore = new Map();
  gScore.set(start, 0);
  
  const fScore = new Map();
  fScore.set(start, hStart);
  
  while(frontier.size()) {
    const { key: cur } = frontier.removeMin();
    if (cur === end) {
      return makePath(cameFrom, cur);
    }
    
    const curGSore = gScore.get(cur);
    getNeighbour(cur).forEach(n => {
      const tempGScore = curGSore + d(cur, n);
      if (tempGScore < (gScore.get(n) ?? Number.MAX_SAFE_INTEGER)) {
        cameFrom.set(n, cur);
        gScore.set(n, tempGScore)
        const newFScore = tempGScore + h(n);
        fScore.set(n, newFScore)
        frontier.decreaseOrInsert(n, newFScore);
      }
    });
  }
  return [];
}
