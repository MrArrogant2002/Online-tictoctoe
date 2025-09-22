const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const port = process.env.PORT || 3001

// Create HTTP server
const server = createServer()

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          "https://online-xox-frontend.onrender.com",
          /\.onrender\.com$/,
          "https://localhost:3000"
        ]
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:3001"
        ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
})

// Game state management
class GameManager {
  constructor() {
    this.games = new Map() // roomCode -> gameState
    this.playerRooms = new Map() // socketId -> roomCode
  }

  createGame(roomCode, playerName, socketId) {
    const gameState = {
      roomCode,
      players: {
        X: { name: playerName, socketId, connected: true },
        O: null
      },
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameStatus: 'waiting', // waiting, playing, finished
      winner: null,
      winningLine: null,
      createdAt: Date.now()
    }
    
    this.games.set(roomCode, gameState)
    this.playerRooms.set(socketId, roomCode)
    return gameState
  }

  joinGame(roomCode, playerName, socketId) {
    const game = this.games.get(roomCode)
    if (!game) {
      throw new Error('Game not found')
    }
    
    if (game.players.O) {
      throw new Error('Game is full')
    }
    
    if (game.gameStatus !== 'waiting') {
      throw new Error('Game already in progress')
    }
    
    game.players.O = { name: playerName, socketId, connected: true }
    game.gameStatus = 'playing'
    this.playerRooms.set(socketId, roomCode)
    
    return game
  }

  makeMove(socketId, position) {
    const roomCode = this.playerRooms.get(socketId)
    const game = this.games.get(roomCode)
    
    if (!game) {
      throw new Error('Game not found')
    }
    
    if (game.gameStatus !== 'playing') {
      throw new Error('Game not in progress')
    }
    
    // Validate player turn
    const playerSymbol = this.getPlayerSymbol(socketId, game)
    if (playerSymbol !== game.currentPlayer) {
      throw new Error('Not your turn')
    }
    
    // Validate move
    if (position < 0 || position > 8 || game.board[position] !== null) {
      throw new Error('Invalid move')
    }
    
    // Make the move
    game.board[position] = playerSymbol
    
    // Check for win or draw
    const result = this.checkGameEnd(game.board)
    if (result.gameOver) {
      game.gameStatus = 'finished'
      game.winner = result.winner
      game.winningLine = result.winningLine
    } else {
      // Switch turns
      game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X'
    }
    
    return game
  }

  getPlayerSymbol(socketId, game) {
    if (game.players.X && game.players.X.socketId === socketId) return 'X'
    if (game.players.O && game.players.O.socketId === socketId) return 'O'
    return null
  }

  checkGameEnd(board) {
    // Winning combinations
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]
    
    // Check for wins
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {
          gameOver: true,
          winner: board[a],
          winningLine: pattern
        }
      }
    }
    
    // Check for draw
    if (board.every(cell => cell !== null)) {
      return {
        gameOver: true,
        winner: null,
        winningLine: null
      }
    }
    
    return { gameOver: false }
  }

  resetGame(roomCode) {
    const game = this.games.get(roomCode)
    if (!game) return null
    
    game.board = Array(9).fill(null)
    game.currentPlayer = 'X'
    game.gameStatus = 'playing'
    game.winner = null
    game.winningLine = null
    
    return game
  }

  handleDisconnection(socketId) {
    const roomCode = this.playerRooms.get(socketId)
    if (!roomCode) return null
    
    const game = this.games.get(roomCode)
    if (!game) return null
    
    // Mark player as disconnected
    if (game.players.X && game.players.X.socketId === socketId) {
      game.players.X.connected = false
    }
    if (game.players.O && game.players.O.socketId === socketId) {
      game.players.O.connected = false
    }
    
    // Clean up if both players disconnected or game is very old
    const now = Date.now()
    const gameAge = now - game.createdAt
    const bothDisconnected = 
      (!game.players.X || !game.players.X.connected) && 
      (!game.players.O || !game.players.O.connected)
    
    if (bothDisconnected || gameAge > 24 * 60 * 60 * 1000) { // 24 hours
      this.games.delete(roomCode)
    }
    
    this.playerRooms.delete(socketId)
    return { roomCode, game }
  }

  getGame(roomCode) {
    return this.games.get(roomCode)
  }

  // Clean up old games periodically
  cleanupOldGames() {
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    for (const [roomCode, game] of this.games) {
      if (now - game.createdAt > maxAge) {
        this.games.delete(roomCode)
        // Clean up player rooms
        if (game.players.X) this.playerRooms.delete(game.players.X.socketId)
        if (game.players.O) this.playerRooms.delete(game.players.O.socketId)
      }
    }
  }
}

// Initialize game manager
const gameManager = new GameManager()

// Clean up old games every hour
setInterval(() => {
  gameManager.cleanupOldGames()
}, 60 * 60 * 1000)

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Create game event
    socket.on('create-game', ({ roomCode, playerName }) => {
      try {
        const game = gameManager.createGame(roomCode, playerName, socket.id)
        socket.join(roomCode)
        
        socket.emit('game-created', {
          success: true,
          game: {
            roomCode: game.roomCode,
            players: game.players,
            board: game.board,
            currentPlayer: game.currentPlayer,
            gameStatus: game.gameStatus,
            playerSymbol: 'X'
          }
        })
        
        console.log(`Game created: ${roomCode} by ${playerName}`)
      } catch (error) {
        socket.emit('game-error', { message: error.message })
      }
    })

    // Join game event
    socket.on('join-game', ({ roomCode, playerName }) => {
      try {
        const game = gameManager.joinGame(roomCode, playerName, socket.id)
        socket.join(roomCode)
        
        // Notify both players
        io.to(roomCode).emit('game-joined', {
          success: true,
          game: {
            roomCode: game.roomCode,
            players: game.players,
            board: game.board,
            currentPlayer: game.currentPlayer,
            gameStatus: game.gameStatus
          }
        })
        
        // Send player-specific data
        socket.emit('player-assigned', { playerSymbol: 'O' })
        socket.to(roomCode).emit('player-assigned', { playerSymbol: 'X' })
        
        console.log(`${playerName} joined game: ${roomCode}`)
      } catch (error) {
        socket.emit('game-error', { message: error.message })
      }
    })

    // Make move event
    socket.on('make-move', ({ position }) => {
      try {
        const game = gameManager.makeMove(socket.id, position)
        const roomCode = gameManager.playerRooms.get(socket.id)
        
        // Broadcast updated game state to all players in the room
        io.to(roomCode).emit('game-updated', {
          board: game.board,
          currentPlayer: game.currentPlayer,
          gameStatus: game.gameStatus,
          winner: game.winner,
          winningLine: game.winningLine
        })
        
        console.log(`Move made in room ${roomCode}: position ${position}`)
      } catch (error) {
        socket.emit('game-error', { message: error.message })
      }
    })

    // Reset game event
    socket.on('reset-game', () => {
      try {
        const roomCode = gameManager.playerRooms.get(socket.id)
        const game = gameManager.resetGame(roomCode)
        
        if (game) {
          io.to(roomCode).emit('game-reset', {
            board: game.board,
            currentPlayer: game.currentPlayer,
            gameStatus: game.gameStatus,
            winner: game.winner,
            winningLine: game.winningLine
          })
          
          console.log(`Game reset in room: ${roomCode}`)
        }
      } catch (error) {
        socket.emit('game-error', { message: error.message })
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
      
      const result = gameManager.handleDisconnection(socket.id)
      if (result) {
        const { roomCode, game } = result
        // Notify remaining player about disconnection
        socket.to(roomCode).emit('player-disconnected', {
          game: {
            players: game.players,
            gameStatus: game.gameStatus
          }
        })
      }
    })

    // Get game state event (for reconnections)
    socket.on('get-game-state', ({ roomCode }) => {
      const game = gameManager.getGame(roomCode)
      if (game) {
        socket.emit('game-state', {
          success: true,
          game: {
            roomCode: game.roomCode,
            players: game.players,
            board: game.board,
            currentPlayer: game.currentPlayer,
            gameStatus: game.gameStatus,
            winner: game.winner,
            winningLine: game.winningLine
          }
        })
      } else {
        socket.emit('game-error', { message: 'Game not found' })
      }
    })
  })

// Health check endpoint
server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'OK', message: 'Game server is running' }))
    return
  }
  
  // For all other requests, return a simple message
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Online XOX Game Server')
})

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Game server running on port ${port}`)
  console.log(`🎮 Socket.IO server ready for connections`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})