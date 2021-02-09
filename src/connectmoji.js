// implement your functions here
// ...don't forget to export functions!

const c = {

    generateBoard: function(rows, cols, fill) {

        const board = {
            data: new Array(rows*cols),
            rows: rows,
            cols: cols
        }

        if (fill === undefined) {

            board.data.fill(null)

        } else{
            board.data.fill(fill)
        }


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
        }

        copiedBoard.data[c.rowColToIndex(board, row, col)] = value;

        return copiedBoard;
    }

    ,setCells: function(board, ...moves) {
        

        let copiedBoard = {
            data: board.data.slice(),
            rows: board.rows,
            cols: board.cols,
        }

        for (let i = 0; i < moves.length; i++) {
            copiedBoard = c.setCell(copiedBoard, moves[i].row, moves[i].col, moves[i].val)
        }
        
        return copiedBoard;
    }


    ,indexToRowCol: function(board, i) {

        const rowCol = {

            row: Math.floor(i/board.cols),
            col: Math.floor(i % board.cols)
        }

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

        var number = letter.charCodeAt(0) - 65;

        if (number < 0 || number > 25) {
            return null;
        } else {
            return number;
        }
    }


    ,getEmptyRowCol: function(board, letter, empty) {

        const col = c.letterToCol(letter);
        let answer = null;
        let count = 0;
        var prevNull = false;
        
        //Handles the case where the letter is not a valid column
        if (col === null) {
            return null;
        }

        for (let i = board.data.length-1; i >= 0; i--) {
            const rowCol = c.indexToRowCol(board, i)
            if (rowCol.col === col) {
                if (board.data[i] === null) {
                    if (prevNull !== true) {
                        answer = {row: rowCol.row, col: rowCol.col};
                        count++
                        prevNull = true;
                    }
                } else {
                    answer = null;
                    prevNull = false;
                }
            }
        }

        if (count === board.rows) {
            answer = {row: board.rows, col: col};
        }


        return answer;

    }

    ,getAvailableColumns: function(board) {

        let answerArray = []

        for (let i = 0; i < board.data.length; i++) {
            let letter = String.fromCodePoint(65 + i)
            const emptyCols = c.getEmptyRowCol(board, letter)

            if (emptyCols !== null) {
                answerArray.push(letter)
            }
        }

        return answerArray;

    }

    ,hasConsecutiveValues: function(board, row, col, n) {

        let answer = false;
        let variableIndex = c.rowColToIndex(board, row, col);
        let variable = board.data[variableIndex];
        
        if (variable === null) {
            
            return false;

        } else {
        
            let length1 = 0;

            //Vertical Testing
            for (let i = 0; i < board.data.length; i++) {
                const rowCol = c.indexToRowCol(board, i)
                if (rowCol.col === col) {
                    if (board.data[i] !== null && board.data[i] === variable) {
                        length1++;
                    } else {
                        if (length1 === n) {
                            answer = true;
                            break;
                        } else {
                            length1 = 0;
                        }
                    }
                }
            }

            if (length1 === n) {
                answer = true;
            }

            let length2 = 0;

            //Horizontal Testing
            for (let i = 0; i < board.data.length; i++) {
                const rowCol = c.indexToRowCol(board, i)
                if (rowCol.row === row) {
                    if (board.data[i] !== null && board.data[i] === variable) {
                        length2++;
                    } else {
                        if (length2 === n) {
                            answer = true;
                            break;
                        } else {
                            length2 = 0;
                        }
                    }
                }
            }


            if (length2 === n) {
                answer = true;
            }

            let length3 = 0;

            //Right Diagonal Testing
            for (let i = 0; i < board.data.length; i++) {
                const rowCol = c.indexToRowCol(board, i)
                if ((rowCol.col-rowCol.row) === (col-row)) {
                    if (board.data[i] !== null && board.data[i] === variable) {
                        length3++;
                    } else {
                        if (length3 === n) {
                            answer = true;
                            break;
                        } else {
                            length3 = 0;
                        }
                    }
                }
            }

            if (length3 === n) {
                answer = true;
            }


            let length4 = 0;

            //Left Diagonal Testing
            for (let i = 0; i < board.data.length; i++) {
                const rowCol = c.indexToRowCol(board, i)
                if ((rowCol.col+rowCol.row) === (col+row)) {
                    if (board.data[i] !== null && board.data[i] === variable) {
                        length4++;
                    } else {
                        if (length4 === n) {
                            answer = true;
                            break;
                        } else {
                            length4 = 0;
                        }
                    }
                }
            }

            if (length4 === n) {
                answer = true;
            }

            return answer;
        }
    }

    ,autoplay: function (board, s, numConsecutive) {
        //const s = 'vwABCDE'
        //const s = '😄🤮D';
        //const s = '😄🤮AABBCCDD';
        
        const error = undefined;

        let victory = null;

        let copiedBoard = {
            data: board.data.slice(),
            rows: board.rows,
            cols: board.cols,
        }

        const pieces = s.slice(0, 2);
        const arrayOfS = s.split("");

        let lastPieceMoved = undefined;

        let winner = undefined;

        for (let i = 2; i < arrayOfS.length; i++) {

            let intendedColumn = c.letterToCol(arrayOfS[i])
            
            //Error Case where the intended column is out of bounds
            if (intendedColumn > copiedBoard.cols) {
                
                copiedBoard = null;
                
                if (i % 2 ==0 ) {
                    lastPieceMoved = arrayOfS[0];
                } else {
                    lastPieceMoved = arrayOfS[1]
                }
                error = {num: i, val: lastPieceMoved, col: arrayOfS[i]}
            }

            //Error Case where there are more moves after win
            if (victory == true) {
                copiedBoard = null;
                
                if (i % 2 ==0 ) {
                    lastPieceMoved = arrayOfS[0];
                } else {
                    lastPieceMoved = arrayOfS[1]
                }
                error = {num: i, val: lastPieceMoved, col: arrayOfS[i]}

            }
            
            //Looks for the empty column
            const emptyRowCol = c.getEmptyRowCol(copiedBoard, arrayOfS[i]);

            copiedBoard = c.setCell(copiedBoard, emptyRowCol.row, emptyRowCol.col, arrayOfS[i]);

            if (i % 2 ==0 ) {

                lastPieceMoved = arrayOfS[0]

            } else {
                lastPieceMoved = arrayOfS[1]
            }

            //Last Move
            if (i == arrayOfS.length-1) {

                victory = c.hasConsecutiveValues(copiedBoard, emptyRowCol.row, emptyRowCol.col, numConsecutive)

                if (victory == true) {
                    winner = lastPieceMoved;
                } else {
                    break;
                }

            }
        }

        if (error === undefined && winner !== undefined) {

            return {board: copiedBoard, pieces: pieces, lastPieceMoved: lastPieceMoved, winner: winner}

        } else if (error === undefined && winner === undefined ) {
            return {board: copiedBoard, pieces: pieces, lastPieceMoved: lastPieceMoved}
        } else {
            return {board: copiedBoard, pieces: pieces, lastPieceMoved: lastPieceMoved}
        }

        
    }
    

}

module.exports = c;