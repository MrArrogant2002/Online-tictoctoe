'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function LoadingSpinner({ size = 'md', message = 'Loading...' }: LoadingSpinnerProps) {
  useEffect(() => {
    // Register the Spiral component only on client side
    if (typeof window !== 'undefined') {
      import('ldrs').then(({ spiral }) => {
        spiral.register()
      })
    }
  }, [])

  const getSpiralSize = () => {
    switch (size) {
      case 'sm':
        return '30'
      case 'lg':
        return '60'
      default:
        return '40'
    }
  }

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-xl'
      default:
        return 'text-base'
    }
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Spiral Loader */}
      <div className="mb-4 text-blue-600 dark:text-blue-400">
        <l-spiral
          size={getSpiralSize()}
          speed="0.9"
          color="currentColor"
        />
      </div>
      
      {/* Loading Message with Animation */}
      <motion.p 
        className={`mt-2 font-medium text-gray-700 dark:text-gray-300 ${getTextSize()}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {message}
      </motion.p>
      
      {/* Enhanced Pulsing Dots */}
      <div className="flex space-x-2 mt-4">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Subtle background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl -z-10"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}