const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin
});

let state = { forward: 0, depth: 0 };

function run({ forward, depth }, { command, value}) {
    switch (command) {
        case 'forward':
            return { forward: forward + value, depth };
        case 'up':
            return { forward, depth: depth - value };
        case 'down':
            return { forward, depth: depth + value };
        default:
            console.log('unknown command', command, value);
            return { forward, depth };
    }
}

rl.on('line', function (line) {
    const [command, value] = line.split(' ');
    const action = { command, value: parseInt(value) }
    const newState = run(state, action);
    state = newState
}).on('close', () => {
    console.log(state, state.forward * state.depth)
    process.exit(0)
});