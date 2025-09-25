'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import GameBoard from '@/components/GameBoard'
import GameModal from '@/components/GameModal'
import PlayerInfo from '@/components/PlayerInfo'
import LoadingSpinner from '@/components/LoadingSpinner'

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

function GameContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [socket, setSocket] = useState<Socket | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [showModal, setShowModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const roomCode = searchParams?.get('room')
  const playerName = searchParams?.get('name')
  const isCreator = searchParams?.get('create') === 'true'

  useEffect(() => {
    if (!roomCode || !playerName) {
      router.push('/')
      return
    }

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001'
    console.log('🔗 Connecting to backend:', backendUrl)
    
    // Initialize Socket.IO connection to backend server
    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'], // WebSocket preferred, polling fallback
      upgrade: true, // Allow upgrade to WebSocket
      rememberUpgrade: true,
      forceNew: true,
      autoConnect: true,
      timeout: 20000, // 20 seconds timeout
      
      // Enhanced error handling
      reconnection: true, // Enable auto-reconnection
      reconnectionAttempts: 5, // Try 5 times to reconnect
      reconnectionDelay: 1000, // Start with 1 second delay
      reconnectionDelayMax: 5000, // Max 5 seconds between attempts
      randomizationFactor: 0.5, // Randomize reconnection timing
      
      // Connection optimizations
      closeOnBeforeunload: true, // Clean disconnect on page close
      
      // Additional query parameters for better compatibility
      query: {
        v: Date.now(), // Cache busting
        client: 'frontend'
      }
    })

    setSocket(newSocket)

    // Enhanced connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to server successfully')
      setConnectionStatus('connected')
      setError('') // Clear any previous errors
      
      if (isCreator) {
        console.log('Creating game...')
        newSocket.emit('create-game', { roomCode, playerName })
      } else {
        console.log('Joining game...')
        newSocket.emit('join-game', { roomCode, playerName })
      }
    })

    // Connection acknowledgment (new event from optimized server)
    newSocket.on('connection-ack', (data) => {
      console.log('Server acknowledgment:', data)
      setConnectionStatus('connected')
    })

    newSocket.on('disconnect', (reason) => {
      console.log(`❌ Disconnected from server. Reason: ${reason}`)
      setConnectionStatus('disconnected')
      
      // Handle different disconnect reasons
      if (reason === 'transport close' || reason === 'transport error') {
        setError('Connection lost. Attempting to reconnect...')
      }
    })

    // Enhanced error handling
    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error)
      setConnectionStatus('error')
      
      // More specific error messages
      if (error.message.includes('server error')) {
        setError('Server is temporarily unavailable. Retrying...')
      } else if (error.message.includes('timeout')) {
        setError('Connection timeout. Please check your internet connection.')
      } else {
        setError('Failed to connect to game server. Please try again.')
      }
    })

    // Reconnection events
    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`)
      setConnectionStatus('connected')
      setError('')
    })

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`)
      setConnectionStatus('reconnecting')
      setError(`Reconnecting... (attempt ${attemptNumber}/5)`)
    })

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection failed:', error)
      setError('Reconnection failed. Please refresh the page.')
    })

    newSocket.on('reconnect_failed', () => {
      console.error('❌ All reconnection attempts failed')
      setConnectionStatus('error')
      setError('Unable to reconnect. Please refresh the page.')
    })

    // Game events
    newSocket.on('game-created', (data) => {
      console.log('Game created:', data)
      if (data.success) {
        setGameState(data.game)
        setPlayerSymbol(data.game.playerSymbol)
        setIsLoading(false)
      }
    })

    newSocket.on('game-joined', (data) => {
      console.log('Game joined:', data)
      if (data.success) {
        setGameState(data.game)
        setIsLoading(false)
      }
    })

    newSocket.on('player-assigned', (data) => {
      console.log('Player assigned:', data)
      setPlayerSymbol(data.playerSymbol)
    })

    newSocket.on('game-updated', (data) => {
      console.log('Game updated:', data)
      setGameState(prev => prev ? { ...prev, ...data } : null)
      
      // Show modal if game finished
      if (data.gameStatus === 'finished') {
        setTimeout(() => setShowModal(true), 500)
      }
    })

    newSocket.on('game-reset', (data) => {
      console.log('Game reset:', data)
      setGameState(prev => prev ? { ...prev, ...data } : null)
      setShowModal(false)
    })

    newSocket.on('player-disconnected', (data) => {
      console.log('Player disconnected:', data)
      setGameState(prev => prev ? { ...prev, players: data.game.players } : null)
    })

    newSocket.on('game-error', (data) => {
      console.error('Game error:', data)
      setError(data.message)
      setIsLoading(false)
    })

    return () => {
      newSocket.close()
    }
  }, [roomCode, playerName, isCreator, router])

  const handleCellClick = (position: number) => {
    if (!socket || !gameState || !playerSymbol) return
    
    // Check if it's the player's turn and the cell is empty
    if (gameState.currentPlayer !== playerSymbol || gameState.board[position] !== null) {
      return
    }
    
    socket.emit('make-move', { position })
  }

  const handlePlayAgain = () => {
    if (!socket) return
    socket.emit('reset-game')
  }

  const handleLeaveGame = () => {
    if (socket) {
      socket.close()
    }
    router.push('/')
  }

  const copyRoomCode = async () => {
    if (!roomCode) return

    try {
      // Check if clipboard API is available with explicit type checking
      if (typeof navigator !== 'undefined' && 
          navigator.clipboard && 
          typeof navigator.clipboard.writeText === 'function' && 
          window.isSecureContext) {
        await navigator.clipboard.writeText(roomCode)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        throw new Error('Clipboard API not available')
      }
    } catch (err) {
      console.error('Failed to copy room code:', err)
      // Fallback method using textarea
      try {
        const textArea = document.createElement('textarea')
        textArea.value = roomCode
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (successful) {
          setCopySuccess(true)
          setTimeout(() => setCopySuccess(false), 2000)
        } else {
          throw new Error('Fallback copy failed')
        }
      } catch (fallbackErr) {
        console.error('All copy methods failed:', fallbackErr)
        // Could show an error message to user here
        alert(`Failed to copy automatically. Please copy this code manually: ${roomCode}`)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 flex items-center justify-center p-4">
        <div className="card-modern p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
            <span className="text-3xl text-white">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Connection Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {error}
          </p>
          <button
            onClick={handleLeaveGame}
            className="btn-primary px-8 py-3"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="card-modern p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">XO</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                  Room: {roomCode}
                </h1>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 dark:text-gray-400">
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
                  connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
                }`}></div>
                <span className="text-sm">
                  Connection: <span className={`font-semibold ${
                    connectionStatus === 'connected' ? 'text-green-600' : 
                    connectionStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {connectionStatus}
                  </span>
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyRoomCode}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                  copySuccess 
                    ? 'btn-success' 
                    : 'btn-secondary'
                }`}
              >
                {copySuccess ? '✓ Copied!' : '📋 Copy Code'}
              </button>
              <button
                onClick={handleLeaveGame}
                className="btn-danger"
              >
                🚪 Leave Game
              </button>
            </div>
          </div>
        </div>

        {/* Player Info */}
        <PlayerInfo 
          gameState={gameState}
          playerSymbol={playerSymbol}
        />

        {/* Game Board */}
        <div className="card-modern p-6 lg:p-8 mb-6">
          <GameBoard
            board={gameState.board}
            onCellClick={handleCellClick}
            winningLine={gameState.winningLine}
            disabled={gameState.gameStatus !== 'playing' || gameState.currentPlayer !== playerSymbol}
          />
        </div>

        {/* Enhanced Game Status */}
        <div className="card-modern p-6 text-center">
          {gameState.gameStatus === 'waiting' && (
            <div>
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Waiting for Player 2
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Share the room code to get started!
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  🔗 Share this room code with your friend:
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl border-2 border-blue-200 dark:border-gray-600 shadow-lg">
                    <span className="font-mono font-bold text-2xl text-blue-600 dark:text-blue-400">
                      {roomCode}
                    </span>
                  </div>
                  <button
                    onClick={copyRoomCode}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                      copySuccess 
                        ? 'btn-success' 
                        : 'btn-primary'
                    }`}
                  >
                    {copySuccess ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {gameState.gameStatus === 'playing' && (
            <div>
              <div className="mb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl ${
                  gameState.currentPlayer === playerSymbol 
                    ? 'bg-gradient-to-br from-green-400 to-green-600 animate-pulse' 
                    : 'bg-gradient-to-br from-yellow-400 to-orange-500'
                }`}>
                  {gameState.currentPlayer === playerSymbol ? '🎯' : '⏰'}
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {gameState.currentPlayer === playerSymbol ? 
                  "🚀 Your turn! Make your move" : 
                  `⏳ Waiting for ${gameState.players[gameState.currentPlayer]?.name || gameState.currentPlayer}'s move...`
                }
              </p>
            </div>
          )}
          
          {gameState.gameStatus === 'finished' && (
            <div>
              <div className="mb-6">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl ${
                  gameState.winner 
                    ? 'bg-gradient-to-br from-green-400 to-green-600' 
                    : 'bg-gradient-to-br from-yellow-400 to-orange-500'
                }`}>
                  {gameState.winner ? '🏆' : '🤝'}
                </div>
              </div>
              
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                {gameState.winner ? 
                  `🎉 ${gameState.players[gameState.winner]?.name || gameState.winner} wins!` : 
                  "🤝 It's a draw!"
                }
              </p>
              
              <button
                onClick={handlePlayAgain}
                className="btn-success text-lg px-8 py-3"
              >
                🔄 Play Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Game Result Modal */}
      {showModal && (
        <GameModal
          gameState={gameState}
          playerSymbol={playerSymbol}
          onPlayAgain={handlePlayAgain}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <GameContent />
    </Suspense>
  )
}