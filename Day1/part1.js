const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin
});

let prev;
let count = 0;

rl.on('line', function (line) {
    if (!prev) {
        prev = parseInt(line);
        return;
    }
    const cur = parseInt(line);
    if(cur > prev) {
        count = count + 1
    }
    prev = cur
}).on('close', () => {
    console.log(count)
    process.exit(0)
});