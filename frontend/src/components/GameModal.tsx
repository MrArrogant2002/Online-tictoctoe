'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RotateCcw, X as CloseIcon, Copy, Users, Target } from 'lucide-react'
import { useState } from 'react'

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
  const [copySuccess, setCopySuccess] = useState(false)
  
  const isWinner = winner === playerSymbol
  const isDraw = !winner
  const winnerName = winner ? players[winner]?.name || winner : null

  const getResultMessage = () => {
    if (isDraw) {
      return "It's a Draw!"
    }
    if (isWinner) {
      return "Victory! 🎉"
    }
    return `${winnerName} Wins!`
  }

  const getResultColor = () => {
    if (isDraw) return 'from-yellow-500 to-orange-500'
    if (isWinner) return 'from-green-500 to-emerald-600'
    return 'from-red-500 to-rose-600'
  }

  const getResultEmoji = () => {
    if (isDraw) return '🤝'
    if (isWinner) return '🎉'
    return '😔'
  }

  const getResultDescription = () => {
    if (isDraw) {
      return "Well played! The board is full with no winner."
    }
    if (isWinner) {
      return "Outstanding! You achieved three in a row!"
    }
    return "Great effort! Ready for another round?"
  }

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(gameState.roomCode)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy room code:', err)
    }
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700"
          initial={{ scale: 0.7, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="text-center">
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIcon size={20} className="text-gray-600 dark:text-gray-400" />
            </motion.button>

            {/* Result Emoji with Animation */}
            <motion.div 
              className="text-8xl mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 10,
                delay: 0.2 
              }}
            >
              {getResultEmoji()}
            </motion.div>

            {/* Result Message with Gradient */}
            <motion.h2 
              className={`text-4xl font-bold mb-4 bg-gradient-to-r ${getResultColor()} bg-clip-text text-transparent`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {getResultMessage()}
            </motion.h2>

            {/* Result Description */}
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {getResultDescription()}
            </motion.p>

            {/* Enhanced Game Statistics */}
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users size={20} className="text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Game Summary
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    X
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {players.X?.name || 'Unknown'}
                  </div>
                  {winner === 'X' && (
                    <motion.div 
                      className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold bg-green-100 dark:bg-green-800 px-2 py-1 rounded-full text-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      <Trophy size={14} />
                      Winner!
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    O
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {players.O?.name || 'Unknown'}
                  </div>
                  {winner === 'O' && (
                    <motion.div 
                      className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold bg-green-100 dark:bg-green-800 px-2 py-1 rounded-full text-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      <Trophy size={14} />
                      Winner!
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <motion.button
                onClick={onPlayAgain}
                className="flex-1 btn-success flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw size={18} />
                Play Again
              </motion.button>
              <motion.button
                onClick={onClose}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Target size={18} />
                Close
              </motion.button>
            </motion.div>

            {/* Room Code Sharing */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <motion.button
                onClick={copyRoomCode}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  copySuccess 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy size={16} />
                {copySuccess ? '✓ Copied!' : `Share Room: ${gameState.roomCode}`}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}