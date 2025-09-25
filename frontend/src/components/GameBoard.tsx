'use client'

import { motion } from 'framer-motion'
import { X, Circle } from 'lucide-react'

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

  const getCellContent = (cell: string | null, index: number) => {
    if (!cell) return null
    
    const isWinner = isWinningCell(index)
    const iconProps = {
      size: 32, // Base size, will be adjusted with CSS
      className: `transition-all duration-300 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${
        cell === 'X' 
          ? `text-blue-600 dark:text-blue-400 ${isWinner ? 'text-blue-800 dark:text-blue-200' : ''}` 
          : `text-red-600 dark:text-red-400 ${isWinner ? 'text-red-800 dark:text-red-200' : ''}`
      }`
    }
    
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          duration: 0.3 
        }}
        className="flex items-center justify-center w-full h-full"
      >
        {cell === 'X' ? <X {...iconProps} /> : <Circle {...iconProps} />}
      </motion.div>
    )
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
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4">
      <motion.div 
        className="game-board-modern w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {board.map((cell, index) => (
          <motion.button
            key={index}
            className={getCellClassName(index)}
            onClick={() => !disabled && cell === null && onCellClick(index)}
            disabled={disabled || cell !== null}
            aria-label={`Cell ${index + 1}${cell ? `, contains ${cell}` : ', empty'}`}
            whileHover={!disabled && cell === null ? { 
              scale: 1.05, 
              backgroundColor: '#f3f4f6',
              transition: { duration: 0.2 } 
            } : {}}
            whileTap={!disabled && cell === null ? { 
              scale: 0.95,
              transition: { duration: 0.1 }
            } : {}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            {getCellContent(cell, index)}
          </motion.button>
        ))}
      </motion.div>
      
      {/* Enhanced Game Legend */}
      <motion.div 
        className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm w-full justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg touch-target">
            <X size={16} className="text-white" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Player X</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-lg touch-target">
            <Circle size={16} className="text-white" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Player O</span>
        </div>
      </motion.div>
    </div>
  )
}