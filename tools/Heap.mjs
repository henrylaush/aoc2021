export default class Heap {
  data = [];
  isKeyEqual;
  
  constructor(isKeyEqual = (a, b) => a === b) {
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