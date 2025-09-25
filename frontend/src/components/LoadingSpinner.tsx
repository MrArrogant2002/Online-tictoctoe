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
      className="flex items-center justify-center p-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Spiral Loader Only */}
      <div className="text-blue-400">
        <l-spiral
          size={getSpiralSize()}
          speed="0.9"
          color="currentColor"
        />
      </div>
    </motion.div>
  )
}