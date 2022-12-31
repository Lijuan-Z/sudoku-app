/**
 * the algorithm part of this app
 * 1.  generate a random valid puzzle
 * 2.  use the backtracking algorithm to ensure a unique answer to each puzzle
 */

//generate a valid game array,return a puzzle array and an answer array
export default function gameGenerator() {

  //generate answerArray
  let a = answersGenerator();

  let uniqueAnswer = false;
  let q, a0;
  //use the backtracking algorithm to make sure a unique answer for each puzzle
  while (!uniqueAnswer) {
    //generate mask to show puzzle
    let mask = maskGenerator();

    //generate puzzle (q for question)
    q = puzzleGenerator(a, mask);

    // a0 is a copy of q in case that q is changed in solveSudoku function
    a0 = [];
    for (let i = 0; i < 9; i++) {
      a0.push([]);
      for (let j = 0; j < 9; j++) {
        a0[i][j] = q[i][j];
      }
    }

    //solve the puzzle to count how many answers
    let answerNum = solveSudoku(a0, 0, 0, 0);
    uniqueAnswer = (answerNum == 1);
  }

  return [q, a];
}

//generate a valid board as an answer array
//method: use a basic valid array,then shuffle it 
function answersGenerator() {

  // now there are 3 groups: 123 456 789, need improve
  let basic = [
    ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
    ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
    ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
    ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
    ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
    ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
    ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
    ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
    ["3", "4", "5", "2", "8", "6", "1", "7", "9"]];

  //shuffle it within 3 rows and 3 colums 
  let newRow = [];
  let newCol = [];
  for (let i = 0; i < 3; i++) {
    while (newRow.length < 3 * (i + 1)) {
      let r = Math.floor(Math.random() * 3) + i * 3;
      if (newRow.indexOf(r) === -1) newRow.push(r);
    }
    while (newCol.length < 3 * (i + 1)) {
      let r = Math.floor(Math.random() * 3) + i * 3;
      if (newCol.indexOf(r) === -1) newCol.push(r);
    }
  }

  //shuffle
  let a = [];
  for (let i = 0; i < 9; i++) {
    a.push([]);
    for (let j = 0; j < 9; j++) {
      a[i].push(basic[newRow[i]][newCol[j]]);
    }
  }
  return a
}

//generate a mask array to decide which cells to hide/display
function maskGenerator() {
  let mask = [];
  for (let i = 0; i < 9; i++) {
    let arr = [];
    mask.push([]);
    // the num related to difficulty of the puzzle,large number means easy puzzle 
    let num = 3 + (i / 9);
    while (arr.length < num) {
      let r = Math.floor(Math.random() * 9);
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    for (let j = 0; j < 9; j++) {
      if (arr.indexOf(j) === -1) {
        mask[i][j] = 0;
      } else {
        mask[i][j] = 1;
      }
    }
  }
  return mask
}

//generate a puzzel with the mask and the answer array
function puzzleGenerator(a, mask) {
  let q = [];
  for (let i = 0; i < 9; i++) {
    q.push([]);
    for (let j = 0; j < 9; j++) {
      q[i].push(a[i][j] * mask[i][j]);
    }
  }
  return q;
}

// solve the puzzle, return the number of answers
function solveSudoku(grid, row, col, count) {

  //when it comes to the end of puzzle, add 1 to answer's number
  if (row == 8 && col == 9) {
    return count + 1;
  }

  if (col == 9) {
    row++;
    col = 0;
  }

  //backtracking
  if (grid[row][col] != 0) {
    return solveSudoku(grid, row, col + 1, count);
  }
  // try 1-9, stop if there are 2 answers 
  for (let num = 1; num < 10 && count < 2; num++) {
    if (isValidNum(grid, row, col, num)) {
      grid[row][col] = num;
      count = solveSudoku(grid, row, col + 1, count);
    }
    grid[row][col] = 0;
  }
  return count;
}

// Check if the num is valid in this cell
function isValidNum(grid, row, col, num) {
  for (let x = 0; x <= 8; x++) {
    if (grid[row][x] == num) {
      return false;
    }
  }
  for (let x = 0; x <= 8; x++) {
    if (grid[x][col] == num) {
      return false;
    }
  }
  let startRow = row - row % 3;
  let startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] == num) {
        return false;
      }
    }
  }
  return true;
}