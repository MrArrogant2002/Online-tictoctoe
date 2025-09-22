# Online XOX - Multiplayer Tic Tac Toe

A modern, real-time multiplayer Tic Tac Toe game built with Next.js, TypeScript, Tailwind CSS, and Socket.IO.

## 🚀 Quick Start for Development

### **🎯 Super Easy Way (Recommended)**
Double-click the `start-dev.bat` file in the project root!

This automatically:
- ✅ Starts both backend (port 3001) and frontend (port 3000) servers
- ✅ Opens your browser to http://localhost:3000
- ✅ No need for multiple terminals!

### **⚡ Manual Way (if you prefer terminal control)**
Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
node index.js
```

**Terminal 2 - Frontend:**  
```bash
cd frontend
npm run dev
```

Then open: http://localhost:3000

---

## 🚀 **DEPLOYMENT READY!**

Your project is **100% ready for Render deployment**!

✅ **All configurations verified**  
✅ **Build processes tested**  
✅ **Production settings confirmed**

**→ [📋 Deploy to Render Guide](RENDER-DEPLOYMENT-GUIDE.md)**  
**→ [✅ Final Verification Report](FINAL-DEPLOYMENT-VERIFICATION.md)**

---

## 🚀 Quick Deploy

### Render Deployment (Recommended - Free)
For **free deployment** on Render with separate frontend and backend services:
**[📋 Render Deployment Guide →](README-render.md)**

### Vercel Deployment (Alternative)
For serverless deployment on Vercel:
**[📋 Vercel Deployment Guide →](DEPLOYMENT.md)**

## 🎮 Features

- 🎮 **Real-time Multiplayer**: Play with friends in real-time using WebSockets
- 🎯 **Room-based Games**: Create or join games using unique room codes
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🎨 **Modern UI**: Clean, minimal design with Tailwind CSS
- ⚡ **Fast & Reliable**: Built with TypeScript for optimal performance
- 🔄 **Auto-reconnection**: Handles disconnections gracefully
- 🏆 **Game Statistics**: Track wins, draws, and player info

## 📁 Project Structure

```
Online-XOX/
├── frontend/          # Next.js frontend application
│   ├── src/app/      # Next.js App Router pages
│   ├── src/components/ # React components
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Node.js Socket.IO server
│   ├── index.js      # Server entry point
│   └── package.json  # Backend dependencies
├── README-render.md  # Render deployment guide
└── README.md         # This file
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/MrArrogant2002/Online-XOX.git
   cd Online-XOX
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies  
   cd ../frontend && npm install
   ```

2. **Configure Environment**
   ```bash
   # In frontend/.env.local
   echo "NEXT_PUBLIC_WS_URL=http://localhost:3001" > .env.local
   ```

3. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

4. **Open Browser**
   - Frontend: http://localhost:3000
   - Backend Health: http://localhost:3001/health

## 🎮 How to Play

1. **Create Game**: Enter your name and click "Create Game"
2. **Share Code**: Give the room code to a friend
3. **Join Game**: Friend enters name and room code, clicks "Join"
4. **Play**: Take turns clicking the board, first to get 3 in a row wins!
5. **Play Again**: Click "Play Again" for a new round

## 🧪 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Socket.IO** - WebSocket library for real-time communication
- **CORS** - Cross-origin resource sharing

## 🔧 Environment Variables

### Frontend (.env.local)
```env
# Backend WebSocket URL
NEXT_PUBLIC_WS_URL=wss://your-backend-app.onrender.com
```

### Backend (Render Dashboard)
```env
# Node environment
NODE_ENV=production
# Port (automatically set by Render)
PORT=10000
```

## 📝 Scripts

### Frontend Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### Backend Scripts
```json
{
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

## 🌟 Key Features Explained

### Real-time Communication
- WebSocket connections for instant move updates
- Automatic reconnection on network issues
- Real-time player status and game state

### Game Management
- Unique room codes for private games
- Turn-based gameplay with validation
- Win/draw detection with visual indicators
- Game reset functionality

### User Experience
- Responsive design for mobile and desktop
- Loading states and error handling
- Visual feedback for game events
- Clean, modern interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**MrArrogant2002**
- GitHub: [@MrArrogant2002](https://github.com/MrArrogant2002)

---

**Built with ❤️ using Next.js, TypeScript, and Socket.IO**