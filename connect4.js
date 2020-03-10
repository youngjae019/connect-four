/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    board.push([...Array(WIDTH)]);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
    const htmlBoard = document.getElementById("board");

  // this is to create the top clickable row of the htmlBoard
  let top = document.createElement("tr"); //creates a table row
  top.setAttribute("id", "column-top"); //new tr id = column-top which is the top row where the player clicks to place a piece
  top.addEventListener("click", handleClick); //eventListener for click in a square in that top row

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td"); //creates a cell
    headCell.setAttribute("id", x); //this cell has an id of x
    top.append(headCell); //add the WIDTH number of cells to row
  }
  htmlBoard.append(top); //add top row of board to htmlBoard

  // this is to create the rest of the htmlBoard
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr"); //creates new table row (7 times for the height)
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td"); //creates new cell (7 times for each column)
      cell.setAttribute("id", `${y}-${x}`); //id of cell is the position of the cell
      row.append(cell); //add cell to row (will do this 6 times)
    }
    htmlBoard.append(row); //add each row 1 by 1 to the htmlBoard (6 times for width)
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y; //finds lowest spot in column and return y value
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`); //get the position of the piece
  spot.append(piece); //add piece to the spot
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return; //return nothing; ignore click
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer; //coordinates which player can place a piece
  placeInTable(y, x); //places piece in table according to player

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won! Play again!`); 
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {  //checks each row/cell if they are filled
    return endGame('You guys tied! Play again!');
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1; //is the currPlayer 1? then switch to 2, if 2 then switch to 1 (false)
}


/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) { //nested for to get position of pieces
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //check if the 4 in a row is horizontal
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //check if the 4 in a row is vertical
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //check if 4 in a row is diagonal down/right
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //check if 4 in a row is diagonal down/left

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true; //player wins if one of these conditions is true
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
