interface GameBoardProps {
  board: (string | null)[]
  onCellClick: (position: number) => void
  winningLine: number[] | null
  disabled: boolean
}

export default function GameBoard({ board, onCellClick, winningLine, disabled }: GameBoardProps) {
  const isWinningCell = (index: number) => {
    return winningLine && winningLine.includes(index)
  }

  const getCellContent = (cell: string | null) => {
    if (!cell) return ''
    return cell
  }

  const getCellClassName = (index: number) => {
    const baseClasses = "cell"
    const isWinner = isWinningCell(index)
    const isEmpty = board[index] === null
    const symbol = board[index]
    
    let classes = baseClasses
    
    if (!disabled && isEmpty) {
      classes += " cell-hover"
    }
    
    if (isWinner) {
      classes += " winning-cell"
    }
    
    if (symbol === 'X') {
      classes += " player-x"
    } else if (symbol === 'O') {
      classes += " player-o"
    }
    
    return classes
  }

  return (
    <div className="flex flex-col items-center">
      <div className="game-board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={getCellClassName(index)}
            onClick={() => !disabled && cell === null && onCellClick(index)}
            disabled={disabled || cell !== null}
            aria-label={`Cell ${index + 1}${cell ? `, contains ${cell}` : ', empty'}`}
          >
            <span className="select-none">
              {getCellContent(cell)}
            </span>
          </button>
        ))}
      </div>
      
      {/* Game Legend */}
      <div className="mt-6 flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">X</span>
          <span>Player X</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">O</span>
          <span>Player O</span>
        </div>
      </div>
    </div>
  )
}