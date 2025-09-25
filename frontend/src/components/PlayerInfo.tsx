'use client'

import { motion } from 'framer-motion'
import { User, Wifi, WifiOff, Clock, Trophy } from 'lucide-react'

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
    <motion.div 
      className="card-modern p-6 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2 
        className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <User size={20} />
        Players
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player X */}
        <motion.div 
          className={`relative p-6 rounded-xl transition-all duration-300 ${
            currentPlayer === 'X' && gameStatus === 'playing'
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-400 shadow-lg'
              : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600'
          } ${isCurrentPlayer('X') ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          {gameStatus === 'playing' && currentPlayer === 'X' && (
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              X
            </motion.div>
            
            <div className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
              {players.X?.connected ? <Wifi size={16} className="text-green-500" /> : <WifiOff size={16} className="text-red-500" />}
              {players.X?.name || 'Waiting...'}
            </div>
            
            <motion.div 
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                getPlayerStatus('X') === 'Turn' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                getPlayerStatus('X') === 'Ready' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                getPlayerStatus('X') === 'Disconnected' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
              }`}
              animate={getPlayerStatus('X') === 'Turn' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {getPlayerStatus('X') === 'Turn' && <Clock size={12} />}
              {getPlayerStatus('X') === 'Ready' && <Trophy size={12} />}
              {getPlayerStatus('X')}
            </motion.div>
            
            {isCurrentPlayer('X') && (
              <motion.div 
                className="mt-3 text-xs text-purple-600 dark:text-purple-400 font-medium bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                You
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Player O */}
        <motion.div 
          className={`relative p-6 rounded-xl transition-all duration-300 ${
            currentPlayer === 'O' && gameStatus === 'playing'
              ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-400 shadow-lg'
              : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600'
          } ${isCurrentPlayer('O') ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          {gameStatus === 'playing' && currentPlayer === 'O' && (
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              O
            </motion.div>
            
            <div className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
              {players.O?.connected ? <Wifi size={16} className="text-green-500" /> : <WifiOff size={16} className="text-red-500" />}
              {players.O?.name || 'Waiting...'}
            </div>
            
            <motion.div 
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                getPlayerStatus('O') === 'Turn' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                getPlayerStatus('O') === 'Ready' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                getPlayerStatus('O') === 'Disconnected' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
              }`}
              animate={getPlayerStatus('O') === 'Turn' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {getPlayerStatus('O') === 'Turn' && <Clock size={12} />}
              {getPlayerStatus('O') === 'Ready' && <Trophy size={12} />}
              {getPlayerStatus('O')}
            </motion.div>
            
            {isCurrentPlayer('O') && (
              <motion.div 
                className="mt-3 text-xs text-purple-600 dark:text-purple-400 font-medium bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                You
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Turn Indicator */}
      {gameStatus === 'playing' && (
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
              currentPlayer === 'X' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className={`w-3 h-3 rounded-full mr-3 ${
                currentPlayer === 'X' ? 'bg-blue-200' : 'bg-red-200'
              }`}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {currentPlayer === playerSymbol ? '🎯 Your turn!' : `⏳ ${players[currentPlayer]?.name || currentPlayer}'s turn`}
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Waiting Status */}
      {gameStatus === 'waiting' && (
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-3 h-3 rounded-full mr-3 bg-yellow-200"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            ⏳ Waiting for Player O to join
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}