import React, { useState } from ‘react’;

const CapybaraIcon = ({ className = “w-20 h-20” }) => (
<img src="/mnt/user-data/uploads/IMG_2991.jpeg" alt="Capybara" className={className} />
);

const CorgiIcon = ({ className = “w-20 h-20” }) => (
<img src="/mnt/user-data/uploads/IMG_2992.jpeg" alt="Corgi" className={className} />
);

export default function CapybaraCorgiTicTacToe() {
const [board, setBoard] = useState(Array(9).fill(null));
const [isCapybaraTurn, setIsCapybaraTurn] = useState(true);
const [gameOver, setGameOver] = useState(false);
const [winner, setWinner] = useState(null);
const [capybaraStarts, setCapybaraStarts] = useState(true);

const checkWinner = (squares) => {
const lines = [
[0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
[0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
[0, 4, 8], [2, 4, 6] // diagonals
];

```
for (let line of lines) {
  const [a, b, c] = line;
  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    return squares[a];
  }
}
return null;
```

};

const handleClick = (index) => {
if (board[index] || gameOver) return;

```
const newBoard = [...board];
newBoard[index] = isCapybaraTurn ? 'capybara' : 'corgi';
setBoard(newBoard);

const winnerResult = checkWinner(newBoard);
if (winnerResult) {
  setWinner(winnerResult);
  setGameOver(true);
} else if (newBoard.every(square => square !== null)) {
  setGameOver(true);
  setWinner('draw');
} else {
  setIsCapybaraTurn(!isCapybaraTurn);
}
```

};

const resetGame = () => {
setBoard(Array(9).fill(null));
setGameOver(false);
setWinner(null);
setCapybaraStarts(!capybaraStarts);
setIsCapybaraTurn(!capybaraStarts);
};

return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
<div className="bg-white rounded-3xl shadow-lg p-6 max-w-md w-full">
<h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
Capybaras vs Corgis
</h1>

```
    {/* Player Cards */}
    <div className="flex gap-4 mb-8">
      {/* Player 1 - Capybara */}
      <div className={`flex-1 rounded-2xl p-4 text-center transition-all ${
        gameOver && winner === 'capybara' 
          ? 'bg-green-100 border-4 border-green-400' 
          : !gameOver && isCapybaraTurn
          ? 'bg-green-50 border-2 border-green-300'
          : 'bg-gray-100 border-2 border-gray-200'
      }`}>
        <div className="flex justify-center mb-2">
          <CapybaraIcon className="w-16 h-16 text-gray-700" />
        </div>
        <div className="font-semibold text-gray-700">Player 1</div>
        <div className="text-sm text-gray-500">
          {gameOver && winner === 'capybara' ? 'WINNER!' : 
           !gameOver && isCapybaraTurn ? 'YOUR TURN' : 'WAITING'}
        </div>
      </div>

      {/* Player 2 - Corgi */}
      <div className={`flex-1 rounded-2xl p-4 text-center transition-all ${
        gameOver && winner === 'corgi' 
          ? 'bg-green-100 border-4 border-green-400' 
          : !gameOver && !isCapybaraTurn
          ? 'bg-green-50 border-2 border-green-300'
          : 'bg-gray-100 border-2 border-gray-200'
      }`}>
        <div className="flex justify-center mb-2">
          <CorgiIcon className="w-16 h-16 text-gray-700" />
        </div>
        <div className="font-semibold text-gray-700">Player 2</div>
        <div className="text-sm text-gray-500">
          {gameOver && winner === 'corgi' ? 'WINNER!' : 
           !gameOver && !isCapybaraTurn ? 'YOUR TURN' : 'WAITING'}
        </div>
      </div>
    </div>

    {/* Game Board */}
    <div className="grid grid-cols-3 gap-3 mb-8">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className="bg-white border-4 border-gray-200 rounded-2xl 
                   hover:border-green-300 transition-all duration-200
                   flex items-center justify-center aspect-square
                   active:scale-95 disabled:cursor-not-allowed
                   shadow-sm hover:shadow-md"
          disabled={cell !== null || gameOver}
        >
          {cell === 'capybara' && <CapybaraIcon className="w-16 h-16 text-black" />}
          {cell === 'corgi' && <CorgiIcon className="w-16 h-16 text-black" />}
        </button>
      ))}
    </div>

    {/* Winner Message */}
    {gameOver && (
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {winner === 'draw' ? "It's a Draw!" : 
           winner === 'capybara' ? 'Capybara Wins!' : 'Corgi Wins!'}
        </h2>
      </div>
    )}

    {/* Play Again Button */}
    <button
      onClick={resetGame}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold 
               py-4 px-6 rounded-full transition-all duration-200 shadow-md 
               hover:shadow-lg active:scale-95 text-lg flex items-center justify-center gap-2"
    >
      <span className="text-2xl">↻</span>
      Play Again
    </button>
  </div>
</div>
```

);
}
