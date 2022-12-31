
import './App.css';
import React from "react"
import gameGenerator from './game.js'
/**
 * the user interface part of this app
 */


// Cell component
function Cell(props) {
  let borderBottomWidthSize = "1px";
  let borderRightWidthSize = "1px";
  if (props.rowIndex == 2 || props.rowIndex == 5) {
    borderBottomWidthSize = "3px";
  } else if (props.rowIndex == 8) {
    borderBottomWidthSize = "4px";
  }

  if (props.colIndex == 2 || props.colIndex == 5) {
    borderRightWidthSize = "3px";
  } else if (props.colIndex == 8) {
    borderRightWidthSize = "4px";
  }

  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
    color: props.isCorrect ? "black" : "red",
    borderColor: "black",
    borderTopWidth: props.rowIndex === 0 ? "4px" : "1px",
    borderBottomWidth: borderBottomWidthSize,
    borderLeftWidth: props.colIndex === 0 ? "4px" : "1px",
    borderRightWidth: borderRightWidthSize
  }

  return (
    <td
      className="cell-attributes"
      style={styles}
      suppressContentEditableWarning
      contentEditable={!props.isHeld}
      onKeyUp={props.updateCells}
    >
      {props.value}
      {/* {""} */}
    </td>
  )
}


export default function App() {
  const [cells, setCells] = React.useState(newGame())

  // check if the user sovle the puzzle, for now only display the result in console
  let allDone = true;
  let userDoneFlag, nonHeldRow, nonHeldCol;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      allDone = allDone && (cells[i][j].value == cells[i][j].resultValue)
      if (!cells[i][j].isHeld) {
        nonHeldRow = i;
        nonHeldCol = j;
      }
    }
  }
  userDoneFlag = cells[nonHeldRow][nonHeldCol].userControlFlag;
  if (allDone && userDoneFlag) {
    console.log("Great Job!")
  }

  //set new game
  function newGame() {
    let rows = 9;
    let cols = 9;
    const newCells = [];

    const [currentGameArray, keyArray] = gameGenerator();
    // expand all rows to have the correct amount of cols
    for (let i = 0; i < rows; i++) {
      newCells.push([]);
      for (let j = 0; j < cols; j++) {
        let heldValue = false;
        let realValue = "";
        if (currentGameArray[i][j] != 0) {
          heldValue = true;
          realValue = currentGameArray[i][j];
        } else {
          heldValue = false;
          realValue = "";
        }
        let cellInfo = {
          value: realValue,
          resultValue: keyArray[i][j],
          isHeld: heldValue,
          userControlFlag: true,
          isCorrect: true,
          rowIndex: i,
          colIndex: j,
          id: i * 9 + j
        }
        newCells[i].push(cellInfo);
      }
    }
    return newCells
  }

  function startGame() {
    setCells(newGame())
  }

  // clear the non-held cells, reStart the same game 
  function reStart() {
    setCells(oldCells => oldCells.map((items, index) => {
      return (
        items.map(cell => {
          return cell.isHeld ?
            cell : { ...cell, value: "", userControlFlag: true }
        })
      )
    }))
  }

  function showAnswers() {
    setCells(oldCells => oldCells.map((items, index) => {
      return (
        items.map(cell => {
          return { ...cell, value: cell.resultValue, userControlFlag: false, isCorrect: true }
        })
      )
    }))
  }

  //when there is an input
  function updateCells(id, event) {
    let realValue = (!isNaN(event.key) && event.key > 0 && event.key < 10) ? event.key : " ";
    setCells(oldCells => oldCells.map((items, index) => {
      return (
        items.map(cell => {
          return cell.id === id ?
            { ...cell, value: realValue, isCorrect: realValue == cell.resultValue } :
            cell
        })
      )
    }
    ))
  }

  const gridElements = cells.map((items, index) => {
    return (
      <tr>
        {items.map(cell => (
          <Cell
            key={cell.id}
            value={cell.value}
            rowIndex={cell.rowIndex}
            colIndex={cell.colIndex}
            isHeld={cell.isHeld}
            isCorrect={cell.isCorrect}
            userControlFlag={cell.userControlFlag}
            updateCells={(e) => updateCells(cell.id, e)}
          />
        ))}
      </tr>

    )
  }

  )
  return (
    <main>
      <h1 className="title">SUDOKU</h1>
      <span>
        <button className="game-button" onClick={startGame} > {"New Game"} </button>
        <button className="game-button" onClick={reStart} >  {"Restart"} </button>
        <button className="game-button" onClick={showAnswers} >  {"Show Answers"} </button>
      </span>

      <div className="cells-container">
        <table >
          <tbody>{gridElements}</tbody>
        </table>
      </div>
      <br></br>
      <p className="instructions">Sudoku puzzles are formatted as a 9*9 grid, broken into nine 3*3 boxes.
        To solve a Sudoku, the numbers 1 through 9 must fill each row, column and box.
        Each number can appear only once in each row, column and box.</p>
    </main>
  )
}