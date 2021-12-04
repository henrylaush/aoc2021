const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin
});

let state = { forward: 0, depth: 0, aim: 0 };

function run(state, { command, value}) {
    switch (command) {
        case 'forward':
            return {
                ...state,
                forward: state.forward + value,
                depth: state.depth + state.aim * value,
             };
        case 'up':
            return {
                ...state,
                aim: state.aim - value,
            };
        case 'down':
            return {
                ...state,
                aim: state.aim + value,
            };
        default:
            console.log('unknown command', command, value);
            return state;
    }
}

rl.on('line', function (line) {
    const [command, value] = line.split(' ');
    const action = { command, value: parseInt(value) }
    const newState = run(state, action);
    // console.log(line, state, newState)
    state = newState
}).on('close', () => {
    console.log(state, state.forward * state.depth)
    process.exit(0)
});