// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync
// const s = 😎, 😎💻AABBCC, 6, 7, 4

const c = require('./connectmoji.js');
const clear = require('clear');
const readlineSync = require('readline-sync');


//Scripted Moves
if (process.argv.length > 2) {
    const arr = process.argv[2].split(',');
    const player_value = arr[0];      //😎
    const move_string = arr[1];       //😎💻AABBCC
    const number_rows = arr[2];       // 6
    const number_columns = arr[3];    // 7
    const number_consecutive = arr[4]; //4

    const board = c.generateBoard (number_rows, number_columns) 

    const moveStringArray = [...moveString];
    const automated_moves = c.autoplay(board, number_consecutive)

    const message = readlineSync.question('Press ENTER to continue...');

    const userReply = 


// User Controlled Game Settings    
} else {

    


}


//PLAYER_VALUE -> the value that the player will use for the game
//MOVE_STRING -> a string where the first characters represent the values to played on the board, and 
//the remaining characters are alternating column letters that represent moves for those values
//NUMBER_ROWS -> the number of rows in the board
//NUMBER_COLUMNS -> the number of columns in the board
//NUMBER_CONSECUTIVE -> the number of repeated consecutive values needed for a win



