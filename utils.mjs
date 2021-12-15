
Object.defineProperties(Array.prototype, {
  sum: {
    value: function(getValue = id => id) { return this.reduce((partial, item) => partial + getValue(item), 0)}
  },
  gather: {
    value: function(getKey = id => id, combiner = (existing, value) => ([...(existing ?? []), value])) {
      return this.map(item => [getKey(item), item]).reduce((bag, [key, value]) => ({ ...bag, [key]: combiner(bag[key], value) }), {})
    }
  }
})

class Heap {
  data = [];
  isKeyEqual = (a, b) => a === b;

  constructor(isKeyEqual) {
    this.isKeyEqual = isKeyEqual
  }

  parent = (i) => Math.floor((i - 1) / 2)
  left = (i) => 2 * i + 1
  right = (i) => 2 * i + 2
  size = () => this.data.length

  peak = () => data[0];

  minHeapify = (at) => {
    const l = this.left(at);
    const r = this.right(at);

    let smallest = at;
    const lData = this.data[l];
    const rData = this.data[r];
    if(lData && lData.value < this.data[smallest].value) {
      smallest = l
    }
    if (rData && rData.value < this.data[smallest].value) {
      smallest = r;
    }
    if (smallest != at) {
      const temp = this.data[smallest];
      this.data[smallest] = this.data[at];
      this.data[at] = temp;

      this.minHeapify(smallest);
    }
  }

  insert = (key, value) => {
    let i = this.data.length;
    this.data.push({ key, value });

    while(i != 0 && this.data[this.parent(i)].value > this.data[i].value) {
      const temp = this.data[this.parent(i)];
      this.data[this.parent(i)] = this.data[i];
      this.data[i] = temp;

      i = this.parent(i);
    }
  }

  decreaseKey = (targetKey, newValue) => {
    const idx = this.findKeyIdx(targetKey);
    if (idx === -1) return false;

    this.data[idx].value = newValue;
    let i = idx;
    while (i != 0 && this.data[this.parent(i)].value > this.data[i].value) {
      const parent = this.parent(i);
      const temp = this.data[parent];
      this.data[parent] = this.data[i];
      this.data[i] = temp;
      i = parent;
    }

    return true;
  }

  decreaseOrInsert = (targetKey, newValue) => {
    if (!this.decreaseKey(targetKey, newValue)) {
      this.insert(targetKey, newValue);
    }
  }

  removeMin = () => {
    if (!this.data.length) return Number.MAX_VALUE;

    const data = this.data[0]
    if (this.data.length === 1) {
      this.data = [];
      return data;
    }

    this.data[0] = this.data.pop();
    this.minHeapify(0);

    return data;
  }

  findKeyIdx = targetKey => this.data.findIndex(({ key }) => this.isKeyEqual(key, targetKey))

  hasKey = targetKey => this.findKeyIdx(targetKey) !== -1;

  deleteKey = (targetKey) => {
    if (this.decreaseKey(targetKey, Number.MIN_VALUE)){
      this.removeMin();
    }
  }
}

function makePath(cameFrom, end) {
  let current = end;
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)
    path.push(current);
  }
  return path.reverse();
}

export const aStar = (start, end, getNeighbour, d, h, isKeyEqual) => {
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

// export const aStar = (start, end, getNeighbour, d, h) => {
//   const frontier = new Set();
//   frontier.add(start);

//   const cameFrom = new Map();
//   const gScore = new Map();
//   gScore.set(start, 0);

//   const fScore = new Map();
//   fScore.set(start, h(start));

//   while(frontier.size) {
//     const cur = [...frontier.values()]
//     .map(k => [k, fScore.get(k) ?? Number.MAX_SAFE_INTEGER])
//     .sort(([k1, v1], [k2, v2]) => v1 - v2 )[0][0]
//     if (cur === end) {
//       return makePath(cameFrom, cur);
//     }
//     frontier.delete(cur);

//     const curGSore = gScore.get(cur);
//     getNeighbour(cur).forEach(n => {
//       const tempGScore = curGSore + d(cur, n);
//       if (tempGScore < (gScore.get(n) ?? Number.MAX_SAFE_INTEGER)) {
//         cameFrom.set(n, cur);
//         gScore.set(n, tempGScore)
//         fScore.set(n, tempGScore + h(n))
//         frontier.add(n)
//       }
//     });
//   }
//   return [];
// }