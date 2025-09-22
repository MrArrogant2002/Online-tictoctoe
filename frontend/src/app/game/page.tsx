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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={handleLeaveGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Home
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
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Room: {roomCode}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connection: <span className={`font-semibold ${
                  connectionStatus === 'connected' ? 'text-green-600' : 
                  connectionStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {connectionStatus}
                </span>
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={copyRoomCode}
                className={`font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
                  copySuccess 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {copySuccess ? '✓ Copied!' : 'Copy Code'}
              </button>
              <button
                onClick={handleLeaveGame}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Leave Game
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          <GameBoard
            board={gameState.board}
            onCellClick={handleCellClick}
            winningLine={gameState.winningLine}
            disabled={gameState.gameStatus !== 'playing' || gameState.currentPlayer !== playerSymbol}
          />
        </div>

        {/* Game Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
          {gameState.gameStatus === 'waiting' && (
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Waiting for another player to join...
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Share this room code with your friend:
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-mono font-bold text-xl text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 px-4 py-2 rounded border">
                    {roomCode}
                  </span>
                  <button
                    onClick={copyRoomCode}
                    className={`text-sm font-medium py-2 px-3 rounded transition-all duration-200 ${
                      copySuccess 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
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
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {gameState.currentPlayer === playerSymbol ? 
                  "Your turn!" : 
                  `Waiting for ${gameState.players[gameState.currentPlayer]?.name || gameState.currentPlayer}'s move...`
                }
              </p>
            </div>
          )}
          
          {gameState.gameStatus === 'finished' && (
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {gameState.winner ? 
                  `${gameState.players[gameState.winner]?.name || gameState.winner} wins!` : 
                  "It's a draw!"
                }
              </p>
              <button
                onClick={handlePlayAgain}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Play Again
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