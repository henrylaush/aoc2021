import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const state = [
  { position: 0, score: 0 }, 
  { position: 0, score: 0 },
]

function* Dice() {
  let count = 0;
  let value = 0;
  while (true) {
    count += 3;
    yield { 
      values: [value + 1, value + 2, value + 3],
      rollCount: count,
    }
    value += 3;
  }
}

function processLine(line) {
  if(line.startsWith("Player 1 starting position: ")) {
    state[0].position = Number(line.replace("Player 1 starting position: ", '')) - 1
  }
  if(line.startsWith("Player 2 starting position: ")) {
    state[1].position = Number(line.replace("Player 2 starting position: ", '')) - 1
  }
}

// End template, start code
function getWinner(state) {
  return state.filter(p => p.score >= 1000)[0];
}

function getLoser(state) {
  return state.filter(p => p.score < 1000)[0];
}

function oneStep(players, player, dice) {
  const currentPlayer = players[player];
  const lastRoll = dice.next();

  const newPosition = (currentPlayer.position + lastRoll.value.values.sum()) % 10;
  const newScore = currentPlayer.score + newPosition + 1;

  const updatedPlayer = {
    ...currentPlayer,
    position: newPosition,
    score: newScore,
  }

  const newState = [
    ...players.slice(0, player),
    updatedPlayer,
    ...players.slice(player + 1),
  ];
  return {
    lastRoll: lastRoll.value,
    nextPlayer: (player + 1) % 2,
    players: newState,
  }
}

function processState(state) {
  let gameState = state;
  let lastRoll = undefined;
  let nextPlayer = 0;
  const dice = Dice();
  while(!getWinner(gameState)) {
    const nextStep = oneStep(gameState, nextPlayer, dice);
    lastRoll = nextStep.lastRoll;
    gameState = nextStep.players;
    nextPlayer = nextStep.nextPlayer;
  }

  const loser = getLoser(gameState);

  return loser.score * lastRoll.rollCount;
}

// End code, start template
function handleProblem() {
    console.log(processState(state));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
