import { createInterface } from 'readline';
import '../utils.mjs';

const rl = createInterface({
  input: process.stdin
});

const lines = [];

function processLine(line) {
    lines.push(
      line
        .replace('target area: x=', '')
        .replace(', y=', '..')
        .split('..').map(Number)
    );
}

const withinTargetX = ([lx, hx, ly, hy]) => x => (
  x >= lx && x <= hx
)
const withinTargetY = ([lx, hx, ly, hy]) => y => (
  y >= ly && y <= hy
)

const goingToTargetX  = ([lx, hx, ly, hy]) => x => ( x < lx )
const awayFromTargetX = ([lx, hx, ly, hy]) => x => ( x > hx )

const goingToTargetY  = ([lx, hx, ly, hy]) => y => ( y > hy )
const awayFromTargetY = ([lx, hx, ly, hy]) => y => ( y < ly )

const withinTarget = (bounds) => (x, y) => (
  withinTargetX(bounds)(x) && withinTargetY(bounds)(y)
)

const getTimeRangeToReachY = (bounds) => (vy) => {
  let result = [];
  let t = 0;
  let y = 0;
  let vyNow = vy;
  while(true) {
    if (awayFromTargetY(bounds)(y)) {
      return result;
    } else if (!goingToTargetY(bounds)(y)) { 
      result.push(t);
    } 
    y += vyNow;
    vyNow -= 1;
    t ++
  }
}

const step = ({x, y, vx, vy}) => ({
  x: x + vx,
  y: y + vy,
  vx: vx === 0 ? 0 : (vx > 0 ? vx - 1 : vx + 1),
  vy: vy - 1,
});

// End template, start code
function processLines(target) {
  let valid = [];
  const [lx, hx, ly, hy] = target;

  for (let vx = 1; vx <= hx; vx++) {
    for (let vy = ly; vy <= -ly ; vy++) {
      let state = { x: 0, y: 0, vx, vy };
      while(!awayFromTargetY(target)(state.y)) {
        state = step(state);
        if (withinTarget(target)(state.x, state.y)) {
          valid.push([vx, vy].join(','))
          break;
        }
      }
    }
  }
  return valid.length;
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines[0]));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
