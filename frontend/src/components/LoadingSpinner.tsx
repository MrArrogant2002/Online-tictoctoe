'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
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

  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Enhanced Spiral Loader */}
      <motion.div 
        className="relative mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="text-blue-400">
          <l-spiral
            size={getSpiralSize()}
            speed="0.9"
            color="currentColor"
          />
        </div>
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Loading text with animation */}
      <motion.p 
        className="text-gray-300 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
      
      {/* Animated dots */}
      <div className="flex space-x-1 mt-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}