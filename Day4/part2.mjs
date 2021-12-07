import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { createInterface } from 'readline';
const rl = createInterface({
  input: process.stdin
});

let state = { seq: [], boards: [], board: -1 }

function markBoard(board, num) {
    return board.map(i => i[0] === num ? [i[0], true] : i)
}

function boardWon(board) {
    for (let i = 0; i < 5; i++) {
        let rowHit = 0;
        let colHit = 0;
        for(let j = 0; j < 5; j++) {
            rowHit = rowHit + Number(board[i*5 + j][1]);
            colHit = colHit + Number(board[i + 5*j][1]);
        }
        if (rowHit === 5 || colHit === 5) {
            return true;
        }
    }
    return false;
}

function processLine(line) {
    if(line.length > 15) {
        state.seq = line.split(',').map(Number);
        return;
    }
    if (line.trim().length === 0) {
        const newBoard = state.board + 1
        state.board = newBoard;
        state.boards[newBoard] = [];
        return;
    }

    state.boards[state.board].push(
        ...line.split(' ').filter(i => i.length).map(Number).map(i => [i, false])
    );
}

function processLines(state) {
    const {lastWonBoard, lastWonCall} = state.seq.reduce((partial, call) => {
        const newBoards = partial.boards.map(board => markBoard(board, call));
        const wonBoard = newBoards.filter(boardWon);
        if (wonBoard.length) {
            return {
                lastWonBoard: wonBoard[0],
                boards: newBoards.filter(board => !boardWon(board)),
                lastWonCall: call,
            }
        }
        return { ...partial, boards: newBoards };
    }, { 
        lastWonBoard: undefined, 
        boards: state.boards, 
        lastWonCall: undefined
    });
    console.log(lastWonBoard);
    const boardSum = lastWonBoard.filter(i => !i[1]).map(i => i[0]).reduce((a,b) => a+ b);
    return boardSum * lastWonCall
}



// End code, start template
function handleProblem() {
    console.log(processLines(state));
    process.exit(0);
}

rl.on('line', processLine).on('close', handleProblem);
