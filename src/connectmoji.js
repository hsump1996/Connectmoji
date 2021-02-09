// implement your functions here
// ...don't forget to export functions!

const c = {

    generateBoard: function(rows, cols, fill = null) {

        const board = {
            data: new Array(rows*cols),
            rows: rows,
            cols: cols
        };

        board.data.fill(fill);

        return board;

    }

    ,rowColToIndex: function(board, row, col) {

        const index = row * board.cols + col;

        return index;

    }


    ,setCell: function(board, row, col, value){

        const copiedBoard = {
            
            data: board.data.slice(),
            rows: board.rows,
            cols: board.cols,
        };

        copiedBoard.data[c.rowColToIndex(board, row, col)] = value;

        return copiedBoard;
    }

    ,setCells: function(board, ...moves) {
        

        let copiedBoard = {
            data: board.data.slice(),
            rows: board.rows,
            cols: board.cols,
        };

        for (let i = 0; i < moves.length; i++) {
            copiedBoard = c.setCell(copiedBoard, moves[i].row, moves[i].col, moves[i].val);
        }
        
        return copiedBoard;
    }


    ,indexToRowCol: function(board, i) {

        const rowCol = {

            row: Math.floor(i/board.cols),
            col: Math.floor(i % board.cols)
        };

        return rowCol;

    }

    ,boardToString: function(board) {
        const wcwidth = require('wcwidth');
        const itemWidth = Math.max(...board.data.map(item => item === null ? 1 : wcwidth(item)));
        const unitBlank = ' '.repeat(itemWidth);
        const unitBar = `--${'-'.repeat(itemWidth)}`;

        const mainSection = [...Array(board.rows).keys()].map( row =>
          '|' +
          board.data.slice(row * board.cols, (row + 1) * board.cols)
            .map( elem => elem === null ? unitBlank : elem)
            .map( elem => ` ${elem}${itemWidth === 2 && wcwidth(elem) === 1 ? ' ' : ''} `
          ).join('|') +
          '|'
        ).join('\n');

        const dashLine = '|' + new Array(board.cols).fill(unitBar).join('+') + '|';
        const alphabetLine =
          '|' +
          [...Array(board.cols).keys()]
            .map(x => ` ${String.fromCharCode(65 + x)}${unitBlank}`)
            .join('|') +
          '|';

        return [mainSection, dashLine, alphabetLine].join('\n');
    }

    ,letterToCol: function(letter) {
        
        if (letter.length > 1) {
            return null;
        } 

        const number = letter.charCodeAt(0) - 65;

        if (number < 0 || number > 25) {
            return null;
        } else {
            return number;
        }
    }


    ,getEmptyRowCol: function(board, letter, empty = null) {

        const col = c.letterToCol(letter);
        let answer = null;
        let count = 0;
        let prevNull = false;
        
        //Handles the case where the letter is not a valid column
        if (col === null || col < board.col) {
            return null;
        }

        for (let i = board.data.length-1; i >= 0; i--) {
            const rowCol = c.indexToRowCol(board, i);
            if (rowCol.col === col) {
                if (board.data[i] === empty) {
                    if (prevNull === false) {
                        answer = {row: rowCol.row, col: rowCol.col};
                        count++;
                        prevNull = true;
                    }
                } else {
                    answer = null;
                    prevNull = false;
                }
            }
        }

        if (count === board.rows) {
            answer = {row: board.rows-1, col: col};
        }


        return answer;

    }

    ,getAvailableColumns: function(board) {

        const answerArray = [];

        for (let i = 0; i < board.data.length; i++) {
            const letter = String.fromCodePoint(65 + i);
            const emptyCols = c.getEmptyRowCol(board, letter);

            if (emptyCols !== null) {
                answerArray.push(letter);
            }
        }

        return answerArray;

    }

    ,hasConsecutiveValues: function(board, row, col, n) {

        const variableIndex = c.rowColToIndex(board, row, col);
        const variable = board.data[variableIndex];
        
        if (variable === null) {
            
            return false;

        } else {
        
            let length1 = 0;

            //Vertical Testing
            for (let i = 0; i < board.data.length; i++) {
                const rowCol = c.indexToRowCol(board, i);
                if (rowCol.col === col) {
                    if (board.data[i] !== null && board.data[i] === variable) {
                        length1++;
                    } else {
                        if (length1 === n){
                            return true;
                        } else {
                            length1 = 0;
                        }
                    }
                }
            }

            if (length1 === n) {
                return true;
            }

            let length2 = 0;

            //Horizontal Testing
            for (let i = 0; i < board.data.length; i++) {
                const rowCol = c.indexToRowCol(board, i);
                if (rowCol.row === row) {
                    if (board.data[i] !== null && board.data[i] === variable) {
                        length2++;
                    } else {
                        if (length2 === n) {
                            return true;
                        } else {
                            length2 = 0;
                        }
                    }
                }
            }


            if (length2 === n) {
                return true;
            }

            let length3 = 0;

            //Right Diagonal Testing
            for (let i = 0; i < board.data.length; i++) {
                const rowCol = c.indexToRowCol(board, i);
                if ((rowCol.col-rowCol.row) === (col-row)) {
                    if (board.data[i] !== null && board.data[i] === variable) {
                        length3++;
                    } else {
                        
                        if (length3 === n) {
                            return true;
                        } else {
                            length3 = 0;
                        }
                    }
                }
            }

            if (length3 === n) {
                return true;
            }


            let length4 = 0;

            //Left Diagonal Testing
            for (let i = 0; i < board.data.length; i++) {
                const rowCol = c.indexToRowCol(board, i);
                if ((rowCol.col+rowCol.row) === (col+row)) {
                    if (board.data[i] !== null && board.data[i] === variable) {
                        length4++;
                    } else {
                        if (length4 === n) {
                            return true;
                        } else {
                            length4 = 0;
                        }
                    }
                }
            }

            if (length4 === n) {
                return true;
            }

            return false;
        }
    }

    ,autoplay: function(board, s, numConsecutive) {

        let currentBoard = board;
        let gameFinished = false;

        const sArray = [...s];
        const pieces = sArray.slice(0, 2);
        const playList = sArray.slice(2);

        let lastPlayer = pieces[0];

        for (const [i, letter] of playList.entries()) {
            lastPlayer = pieces[i % 2];

            // check 1
            if (gameFinished === true) {
                return {
                    board: null,
                    pieces: pieces,
                    lastPieceMoved: lastPlayer,
                    error: {num: i + 1, val: lastPlayer, col: letter}
                };
            }

            // check 2
            const nullOrRowCol = c.getEmptyRowCol(currentBoard, letter);
            if (nullOrRowCol === null) {
                return {
                    board: null,
                    pieces: pieces,
                    lastPieceMoved: lastPlayer,
                    error: {num: i + 1, val: lastPlayer, col: letter}
                };
            }

            const {row, col} = nullOrRowCol;
            currentBoard = c.setCell(currentBoard, row, col, lastPlayer);
            if (c.hasConsecutiveValues(currentBoard, row, col, numConsecutive)) {
                gameFinished = true;
            }

        }
        const state = {
            board: currentBoard,
            pieces: pieces,
            lastPieceMoved: lastPlayer
        };
        if (gameFinished === true) {
            state['winner'] = lastPlayer;
        }
        return state;

    }
    
};

module.exports = c;