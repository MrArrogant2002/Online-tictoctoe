'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, Play, UserPlus, Gamepad2, Zap, Shield, Globe } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 relative overflow-hidden">
      
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
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 min-h-[50vh] lg:min-h-screen">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo and Title */}
            <motion.div 
              className="flex items-center gap-6 mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div 
                className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl"
                whileHover={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.05 
                }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-4xl font-bold text-white">XO</span>
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                  Online XOX
                </h1>
                <p className="text-xl text-gray-400 mt-2">
                  The Ultimate Tic-Tac-Toe Experience
                </p>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 p-4 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Real-time</h3>
                  <p className="text-sm text-gray-400">Instant gameplay</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Global</h3>
                  <p className="text-sm text-gray-400">Play anywhere</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Secure</h3>
                  <p className="text-sm text-gray-400">Safe & private</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-lg text-gray-300 leading-relaxed mb-8"
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
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
                <Play className="w-6 h-6" />
                Get Started
              </button>
              <div className="text-sm text-gray-400">
                No registration required
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Game Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 min-h-[50vh] lg:min-h-screen lg:border-l border-gray-700/50">
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-100 mb-2">
                  Start Playing
                </h2>
                <p className="text-gray-400">
                  Enter your name and join the game
                </p>
              </motion.div>

              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {/* Player Name Input */}
                <div>
                  <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="input-modern text-lg"
                    placeholder="Enter your name"
                    maxLength={20}
                    suppressHydrationWarning
                  />
                </div>

                {/* Create Game Button */}
                <motion.button
                  onClick={handleCreateGame}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
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
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-800 text-gray-400 font-medium">or</span>
                  </div>
                </div>

                {/* Join Game Section */}
                <div>
                  <label htmlFor="roomCode" className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Room Code
                  </label>
                  <input
                    type="text"
                    id="roomCode"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="input-modern focus:ring-green-500 focus:border-green-500 text-lg font-mono tracking-wider"
                    placeholder="Enter room code"
                    maxLength={6}
                    suppressHydrationWarning
                  />
                </div>

                <motion.button
                  onClick={handleJoinGame}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
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
                    className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm"
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
                className="mt-8 p-6 bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-600/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
                  🎯 How to Play
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-200 text-sm">Create or Join</h4>
                      <p className="text-xs text-gray-400">Start a new game or join with a code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-200 text-sm">Share & Play</h4>
                      <p className="text-xs text-gray-400">Send room code to friends</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-200 text-sm">Take Turns</h4>
                      <p className="text-xs text-gray-400">X goes first, then O</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-200 text-sm">Win! 🏆</h4>
                      <p className="text-xs text-gray-400">Get 3 in a row to victory</p>
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