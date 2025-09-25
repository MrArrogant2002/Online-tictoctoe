'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, Play, UserPlus, Gamepad2, Zap, Shield, Globe } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Generate random room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    const newRoomCode = generateRoomCode()
    
    // Navigate to game with room code and player name
    router.push(`/game?room=${newRoomCode}&name=${encodeURIComponent(playerName)}&create=true`)
  }

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (!roomCode.trim()) {
      setError('Please enter a room code')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    // Navigate to game with room code and player name
    router.push(`/game?room=${roomCode.toUpperCase()}&name=${encodeURIComponent(playerName)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 relative overflow-hidden mobile-safe-area">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Hero Section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-16 min-h-[50vh] lg:min-h-screen">
          <motion.div 
            className="max-w-2xl w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo and Title */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-center sm:text-left"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div 
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl touch-target"
                whileHover={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.05 
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-3xl sm:text-4xl font-bold text-white">XO</span>
              </motion.div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight mobile-title lg:desktop-hero">
                  Online XOX
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mt-2 mobile-subtitle">
                  The Ultimate Tic-Tac-Toe Experience
                </p>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 dark:border-gray-700/50 feature-card-mobile sm:feature-card mobile-smooth-animation hover:bg-white/80 dark:hover:bg-gray-800/80">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center touch-target">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">Real-time</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Instant gameplay</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 dark:border-gray-700/50 feature-card-mobile sm:feature-card mobile-smooth-animation hover:bg-white/80 dark:hover:bg-gray-800/80">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center touch-target">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">Global</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Play anywhere</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 dark:border-gray-700/50 feature-card-mobile sm:feature-card mobile-smooth-animation hover:bg-white/80 dark:hover:bg-gray-800/80 sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center touch-target">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">Secure</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Safe & private</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 text-center sm:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Challenge friends to the classic game of Tic-Tac-Toe with a modern twist. 
              Create private rooms, share codes, and enjoy smooth real-time gameplay with 
              beautiful animations and responsive design.
            </motion.p>

            {/* Call to Action */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.button 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 btn-mobile-optimized mobile-bounce-animation touch-target"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                Get Started
              </motion.button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                No registration required
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Game Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-16 min-h-[50vh] lg:min-h-screen lg:border-l border-white/20 dark:border-gray-700/50">
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <div className="card-mobile-enhanced">
              <motion.div 
                className="text-center mb-6 sm:mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl sm:rounded-2xl flex items-center justify-center touch-target">
                  <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Start Playing
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Enter your name and join the game
                </p>
              </motion.div>

              <motion.div 
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {/* Player Name Input */}
                <div>
                  <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="input-modern text-base sm:text-lg"
                    placeholder="Enter your name"
                    maxLength={20}
                    suppressHydrationWarning
                  />
                </div>

                {/* Create Game Button */}
                <motion.button
                  onClick={handleCreateGame}
                  disabled={isLoading}
                  className="btn-mobile-optimized bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white mobile-bounce-animation"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  suppressHydrationWarning
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Create New Game
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative my-6 sm:my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">or</span>
                  </div>
                </div>

                {/* Join Game Section */}
                <div>
                  <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Room Code
                  </label>
                  <input
                    type="text"
                    id="roomCode"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="input-modern focus:ring-green-500 focus:border-green-500 text-base sm:text-lg font-mono tracking-wider"
                    placeholder="Enter room code"
                    maxLength={6}
                    suppressHydrationWarning
                  />
                </div>

                <motion.button
                  onClick={handleJoinGame}
                  disabled={isLoading}
                  className="btn-mobile-optimized bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white mobile-bounce-animation"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  suppressHydrationWarning
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Join Game
                    </>
                  )}
                </motion.button>

                {/* Error Message */}
                {error && (
                  <motion.div 
                    className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl sm:rounded-2xl text-sm backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>

              {/* Enhanced Game Rules */}
              <motion.div 
                className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50/80 to-indigo-100/80 dark:from-gray-700/80 dark:to-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-gray-600/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 flex items-center gap-2 justify-center sm:justify-start">
                  🎯 How to Play
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold touch-target">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Create or Join</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Start a new game or join with a code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold touch-target">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Share & Play</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Send room code to friends</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold touch-target">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Take Turns</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">X goes first, then O</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold touch-target">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Win! 🏆</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Get 3 in a row to victory</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}