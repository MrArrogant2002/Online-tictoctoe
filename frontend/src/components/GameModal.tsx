interface Player {
  name: string
  socketId: string
  connected: boolean
}

interface GameState {
  roomCode: string
  players: {
    X: Player | null
    O: Player | null
  }
  board: (string | null)[]
  currentPlayer: 'X' | 'O'
  gameStatus: 'waiting' | 'playing' | 'finished'
  winner: 'X' | 'O' | null
  winningLine: number[] | null
}

interface GameModalProps {
  gameState: GameState
  playerSymbol: 'X' | 'O' | null
  onPlayAgain: () => void
  onClose: () => void
}

export default function GameModal({ gameState, playerSymbol, onPlayAgain, onClose }: GameModalProps) {
  const { winner, players } = gameState
  
  const isWinner = winner === playerSymbol
  const isDraw = !winner
  const winnerName = winner ? players[winner]?.name || winner : null

  const getResultMessage = () => {
    if (isDraw) {
      return "It's a Draw!"
    }
    if (isWinner) {
      return "You Win! 🎉"
    }
    return `${winnerName} Wins!`
  }

  const getResultColor = () => {
    if (isDraw) return 'text-yellow-600'
    if (isWinner) return 'text-green-600'
    return 'text-red-600'
  }

  const getResultEmoji = () => {
    if (isDraw) return '🤝'
    if (isWinner) return '🏆'
    return '😔'
  }

  const getResultDescription = () => {
    if (isDraw) {
      return "Good game! All squares filled with no winner."
    }
    if (isWinner) {
      return "Congratulations! You got three in a row!"
    }
    return "Better luck next time! Want to play again?"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="text-center">
          {/* Result Emoji */}
          <div className="text-6xl mb-4 animate-bounce-slow">
            {getResultEmoji()}
          </div>

          {/* Result Message */}
          <h2 className={`text-3xl font-bold mb-4 ${getResultColor()}`}>
            {getResultMessage()}
          </h2>

          {/* Result Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            {getResultDescription()}
          </p>

          {/* Game Statistics */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Game Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-blue-600">Player X</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {players.X?.name || 'Unknown'}
                </div>
                {winner === 'X' && (
                  <div className="text-green-600 font-semibold mt-1">Winner!</div>
                )}
              </div>
              <div className="text-center">
                <div className="font-medium text-red-600">Player O</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {players.O?.name || 'Unknown'}
                </div>
                {winner === 'O' && (
                  <div className="text-green-600 font-semibold mt-1">Winner!</div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Play Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>

          {/* Additional Actions */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                if (gameState.roomCode) {
                  navigator.clipboard.writeText(gameState.roomCode)
                  // Could add toast notification here
                }
              }}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              📋 Copy Room Code to Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}