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
      size: 40,
      className: `transition-all duration-300 ${
        cell === 'X' 
          ? `text-blue-400 ${isWinner ? 'text-blue-200' : ''}` 
          : `text-red-400 ${isWinner ? 'text-red-200' : ''}`
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
    <div className="flex flex-col items-center">
      <motion.div 
        className="game-board-modern"
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
              backgroundColor: '#4f46e5',
              boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
              transition: { duration: 0.2 } 
            } : {}}
            whileTap={!disabled && cell === null ? { 
              scale: 0.95,
              transition: { duration: 0.1 }
            } : {}}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.05,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <motion.div 
              className="flex items-center justify-center h-full will-change-transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.1 }}
            >
              {getCellContent(cell, index)}
            </motion.div>
          </motion.button>
        ))}
      </motion.div>
      
      {/* Enhanced Game Legend */}
      <motion.div 
        className="mt-8 flex space-x-8 text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
            <X size={16} className="text-white" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Player X</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
            <Circle size={16} className="text-white" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Player O</span>
        </div>
      </motion.div>
    </div>
  )
}