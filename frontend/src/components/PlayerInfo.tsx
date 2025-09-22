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

interface PlayerInfoProps {
  gameState: GameState
  playerSymbol: 'X' | 'O' | null
}

export default function PlayerInfo({ gameState, playerSymbol }: PlayerInfoProps) {
  const { players, currentPlayer, gameStatus } = gameState

  const getPlayerStatus = (symbol: 'X' | 'O') => {
    const player = players[symbol]
    
    if (!player) return 'Waiting...'
    if (!player.connected) return 'Disconnected'
    if (gameStatus === 'playing' && currentPlayer === symbol) return 'Turn'
    return 'Ready'
  }

  const getPlayerStatusColor = (symbol: 'X' | 'O') => {
    const player = players[symbol]
    
    if (!player) return 'text-gray-500'
    if (!player.connected) return 'text-red-500'
    if (gameStatus === 'playing' && currentPlayer === symbol) return 'text-green-500'
    return 'text-blue-500'
  }

  const isCurrentPlayer = (symbol: 'X' | 'O') => {
    return symbol === playerSymbol
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
        Players
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Player X */}
        <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
          currentPlayer === 'X' && gameStatus === 'playing'
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
        } ${isCurrentPlayer('X') ? 'ring-2 ring-purple-500' : ''}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">X</div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
              {players.X?.name || 'Waiting...'}
            </div>
            <div className={`text-xs font-semibold ${getPlayerStatusColor('X')}`}>
              {getPlayerStatus('X')}
            </div>
            {isCurrentPlayer('X') && (
              <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
                You
              </div>
            )}
          </div>
        </div>

        {/* Player O */}
        <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
          currentPlayer === 'O' && gameStatus === 'playing'
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
        } ${isCurrentPlayer('O') ? 'ring-2 ring-purple-500' : ''}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">O</div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
              {players.O?.name || 'Waiting...'}
            </div>
            <div className={`text-xs font-semibold ${getPlayerStatusColor('O')}`}>
              {getPlayerStatus('O')}
            </div>
            {isCurrentPlayer('O') && (
              <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
                You
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Turn Indicator */}
      {gameStatus === 'playing' && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              currentPlayer === 'X' ? 'bg-blue-500' : 'bg-red-500'
            }`}></div>
            {currentPlayer === playerSymbol ? 'Your turn' : `${players[currentPlayer]?.name || currentPlayer}'s turn`}
          </div>
        </div>
      )}

      {/* Game Status Messages */}
      {gameStatus === 'waiting' && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            <div className="w-2 h-2 rounded-full mr-2 bg-yellow-500 animate-pulse"></div>
            Waiting for player O to join
          </div>
        </div>
      )}
    </div>
  )
}