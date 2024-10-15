import { useState } from "react";

// Function that defines each clickable square
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Function that tracks and updates game state
export default function Game() {
  // Keep track of game history and the current move
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  // Keep current state constantly up to date
  const xIsNext = (currentMove & 1) === 0;
  const currentSquares = history[currentMove];

  // Update Game State (only triggerred if a user clicks a valid square)
  function handlePlay(nextSquares) {
    // Adjust history based on currentMove
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // Update history list with new state
    setHistory(nextHistory);
    // Update current move to point to latest history entry
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    // Update current move so that history can be updated if a new move is clicked
    setCurrentMove(nextMove);
  }

  // Create a list of game moves
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #: " + move;
    } else {
      description = "Go to game start";
    }
    // Update current move if a user clicks on one of the buttons
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Draw the board and handle board logic
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // Return early if the square already has a value
    //  or if the game has ended
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // Create a copy of the squares array (treat it as immutable)
    const nextSquares = squares.slice();

    // Populare the entry with an X or O
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    // Let parent class handle updating game state
    onPlay(nextSquares);
  }

  // Update the user on who to play or if the game is over
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Draw the board
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );

  // Determine if the game is over or not
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }
}
