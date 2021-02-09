// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync
// const s = 😎,😎💻AABBCC,6,7,4

const c = require('./connectmoji.js');
const clear = require('clear');
const readlineSync = require('readline-sync');

const runInteractiveMode = function (state, playerVal, computerVal, numConsecutive) {
    console.log(c.boardToString(state.board));
  
    let letter = null;
    while (!('winner' in state) && state.board.data.some(x => (x === null))) {
      if (state.lastPieceMoved === playerVal) {
        readlineSync.question('Press <ENTER> to see computer move');
        clear();
        let nullOrRowCal = null;
        while (nullOrRowCal === null) {
          const randomOffset = Math.floor(Math.random() * Math.floor(state.board.cols));
          letter = String.fromCharCode(65 + randomOffset);
          nullOrRowCal = c.getEmptyRowCol(state.board, letter);
        }
        console.log(`...dropping in column ${letter}`);
        state = c.autoplay(state.board, `${computerVal}${playerVal}${letter}`, numConsecutive);
        console.log(c.boardToString(state.board));
      } else {
        let nullOrRowCal = null;
        while (nullOrRowCal === null) {
          letter = readlineSync.question('Choose a column letter to drop your piece in\n>');
          nullOrRowCal = c.getEmptyRowCol(state.board, letter);
          if (nullOrRowCal === null) {
            console.log('Oops, that is not a valid move, try again!');
          }
        }
        clear();
        console.log(`...dropping in column ${letter}`);
        state = c.autoplay(state.board, `${playerVal}${computerVal}${letter}`, numConsecutive);
        console.log(c.boardToString(state.board));
      }
  
    }
    if ('winner' in state) {
      console.log(`Winner is ${state.winner}`);
    } else {
      console.log('No Winner. So sad 😭');
    }
  };

const useScriptedMoves = function () {
  const [playerVal, playersAndMoveString, numRowsStr, numColumnsStr, numConsecutiveStr] = process.argv[2].split(',');
  const [p1, p2,] = [...playersAndMoveString];
  const computerVal = playerVal === p1 ? p2 : p1;
  const [numRows, numColumns, numConsecutive] = [parseInt(numRowsStr), parseInt(numColumnsStr), parseInt(numConsecutiveStr)];
  const board = c.generateBoard(numRows, numColumns);

  const stateAfterAutoPlay = c.autoplay(board, playersAndMoveString, numConsecutive);
  readlineSync.question('Press <ENTER> to continue...');
  runInteractiveMode(stateAfterAutoPlay, playerVal, computerVal, numConsecutive);
};

const useControlledGameSettings = function () {
  const userInput1 = readlineSync.question(
    'Enter the number of rows, columns, and consecutive "pieces" for win\n' +
    '(all separated by commas... for example: 6,7,4)\n' +
    '>'
  );
  const [numRowsStr, numColumnsStr, numConsecutiveStr] = userInput1 === '' ? ['6', '7', '4'] : userInput1.split(',');
  const [numRows, numColumns, numConsecutive] = [parseInt(numRowsStr), parseInt(numColumnsStr), parseInt(numConsecutiveStr)];
  console.log(`Using row, col and consecutive: ${numRows} ${numColumns} ${numConsecutive}`);

  const userInput2 = readlineSync.question(
    'Enter two characters that represent the player and computer\n' +
    '(separated by a comma... for example: P,C)\n' +
    '>'
  );
  const [playerVal, computerVal] = userInput2 === '' ? ['😎', '💻'] : userInput2.split(',');
  console.log(`Using player and computer characters: ${playerVal} ${computerVal}`);

  const userInput3 = readlineSync.question(' Who goes first, (P)layer or (C)omputer?\n>');
  const [p1, p2] = userInput3 === 'C' ? [computerVal, playerVal] : [playerVal, computerVal];
  console.log(`${p1} goes first`);

  const initialState = {
    board: c.generateBoard(numRows, numColumns),
    pieces: [p1, p2],
    lastPieceMoved: p2
  };
  readlineSync.question('Press <ENTER> to start game');
  runInteractiveMode(initialState, playerVal, computerVal, numConsecutive);
};


if (process.argv.length > 2) {
  useScriptedMoves();
} else {
  useControlledGameSettings();
}