const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin
});

let prev = [];
let count = 0;

rl.on('line', function (line) {
    if (prev.length < 3) {
        prev.push(parseInt(line));
        return;
    }
    const cur = parseInt(line);
    const head = prev.shift();
    if(cur > head) {
        count = count + 1
    }
    prev.push(cur);
}).on('close', () => {
    console.log(count)
    process.exit(0)
});