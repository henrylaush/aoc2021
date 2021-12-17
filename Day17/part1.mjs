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
    t++
  }
}

// End template, start code
function processLines(target) {
  let uy = 0;
  let maxH = undefined;
  let thisUyOK = false;
  let ux = 1;
  let good = [];
  while(uy < - target[2]) {
    thisUyOK = false;
    const timesToReachTargetY = getTimeRangeToReachY(target)(-uy-1).map(t => t + 2 * uy);
    
    ux = 1
    
    while (true) {
      const xs = timesToReachTargetY.map(tof => {
        const vx = Math.max(0, ux - tof);
        return  (ux + vx) * (ux - vx + 1) / 2
      });

      if (xs.some(withinTargetX(target))) {
        maxH = uy * (uy + 1) / 2
        good = [ux, uy]
        thisUyOK = true;
        break;
      }

      if (xs.every(awayFromTargetX(target))) {
        break;
      }
      ux++
    }
    uy++
  }

  return [...good, maxH]
}

// End code, start template
function handleProblem() {
    console.log(processLines(lines[0]));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
