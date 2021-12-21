import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const state = [
  { position: 0, score: 0 }, 
  { position: 0, score: 0 },
]

function processLine(line) {
  if(line.startsWith("Player 1 starting position: ")) {
    state[0].position = Number(line.replace("Player 1 starting position: ", '')) - 1
  }
  if(line.startsWith("Player 2 starting position: ")) {
    state[1].position = Number(line.replace("Player 2 starting position: ", '')) - 1
  }
}

// End template, start code
function getWinnerIndex(state) {
  return state.findIndex(p => p.score >= 21);
}

const possibleRolls = Object.entries([
  [1,1,1],
  [1,1,2],
  [1,1,3],
  [1,2,1],
  [1,2,2],
  [1,2,3],
  [1,3,1],
  [1,3,2],
  [1,3,3],
  [2,1,1],
  [2,1,2],
  [2,1,3],
  [2,2,1],
  [2,2,2],
  [2,2,3],
  [2,3,1],
  [2,3,2],
  [2,3,3],
  [3,1,1],
  [3,1,2],
  [3,1,3],
  [3,2,1],
  [3,2,2],
  [3,2,3],
  [3,3,1],
  [3,3,2],
  [3,3,3],
].gather(id => id.sum(), (existing) => (existing ?? 0) + 1))
.map(([k,v]) => [Number(k), v]);

function oneStep(players, player, [roll, times], multiplier) {
  const currentPlayer = players[player];

  const newPosition = (currentPlayer.position + roll) % 10;
  const newScore = currentPlayer.score + newPosition + 1;

  const updatedPlayer = {
    position: newPosition,
    score: newScore,
  }

  const newState = [...players]
  newState[player] = updatedPlayer;
  
  const nextPlayer = (player + 1) % 2;

  return {
    players: newState,
    nextPlayer,
    multiplier: multiplier * times,
  }; 
}

function processState(state) {
  // return possibleRolls
  let stack = possibleRolls.map(roll => ({ roll, players: state, player: 0, multiplier: 1 }));
  let tally = [0, 0];
  
  while(stack.length) {
    const { roll, players, player, multiplier } = stack.pop();

    const ranOneStep = oneStep(players, player, roll, multiplier);

    const won = getWinnerIndex(ranOneStep.players);
    if (won !== -1) {
      tally[won] = tally[won] + ranOneStep.multiplier;
      continue;
    }
    
    stack.push(
      ...possibleRolls.map(r => ({ 
        roll: r, 
        players: ranOneStep.players, 
        player: ranOneStep.nextPlayer, 
        multiplier: ranOneStep.multiplier,
      }))
    );
  }

  return tally
}

// End code, start template
function handleProblem() {
    console.log(processState(state));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
