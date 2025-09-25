# 🎮 Online XOX - Modern Tic-Tac-Toe Game

A beautiful, real-time multiplayer Tic-Tac-Toe game with modern UI, animations, and responsive design. Built with Next.js 15, React 18, and Socket.IO.

## ✨ Features

### 🎯 Core Gameplay
- **Real-time multiplayer** - Play instantly with friends anywhere
- **Room-based matchmaking** - Create or join games with unique room codes
- **Live connection status** - See player connectivity in real-time
- **Game state persistence** - Never lose your progress

### 🎨 Modern UI/UX
- **Stunning animations** - Smooth Framer Motion animations throughout
- **Gradient designs** - Beautiful gradients and modern color schemes
- **Interactive components** - Hover effects, micro-interactions, and feedback
- **Modern iconography** - Clean icons from Lucide React

### 📱 Responsive Design
- **Mobile-first** - Optimized for all screen sizes
- **Touch-friendly** - Perfect for mobile gameplay
- **Adaptive layouts** - Components that scale beautifully
- **Cross-browser compatibility** - Works everywhere

### 🌙 Enhanced Experience  
- **Dark mode support** - Automatic system theme detection
- **Accessibility** - Screen reader support and keyboard navigation
- **Loading states** - Beautiful loading animations
- **Error handling** - Graceful error messages and recovery

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Headless UI** - Accessible UI components

### Backend
- **Node.js** - JavaScript runtime
- **Socket.IO** - Real-time bidirectional communication
- **Express** - Web application framework

### Package Management
- **pnpm** - Fast, disk space efficient package manager

## 🛠️ Getting Started

### Prerequisites
- Node.js 18 or higher
- pnpm (recommended) or npm

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/MrArrogant2002/Online-tictoctoe.git
cd Online-tictoctoe
```

2. **Install dependencies using pnpm:**
```bash
# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies  
cd ../frontend
pnpm install
```

3. **Start development servers:**
```bash
# Start backend (from project root)
pnpm run dev:backend

# Start frontend (from project root)
pnpm run dev:frontend

# Or start both simultaneously
pnpm run dev
```

4. **Open your browser:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📁 Project Structure

```
Online-XOX/
├── 📁 backend/
│   ├── index.js              # Socket.IO game server
│   └── package.json          # Backend dependencies
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── page.tsx      # Landing page with modern design
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── globals.css   # Enhanced global styles
│   │   │   └── 📁 game/
│   │   │       └── page.tsx  # Game room with animations
│   │   └── 📁 components/
│   │       ├── GameBoard.tsx     # Interactive game board
│   │       ├── GameModal.tsx     # Result modal with animations
│   │       ├── PlayerInfo.tsx    # Modern player cards
│   │       └── LoadingSpinner.tsx # Beautiful loading states
│   ├── next.config.js        # Next.js configuration
│   ├── tailwind.config.js    # Tailwind CSS config
│   └── package.json          # Frontend dependencies
├── package.json              # Root package.json with pnpm scripts
├── render.yaml              # Deployment configuration
└── README.md                # This file
```

## 🎯 New Features & Improvements

### 🎨 UI/UX Enhancements
- **Modern card designs** with gradients and shadows
- **Animated game pieces** with rotation and scaling effects
- **Interactive buttons** with hover states and ripple effects
- **Enhanced typography** with gradient text effects
- **Loading animations** with multiple bouncing dots
- **Improved spacing** and visual hierarchy

### 📱 Responsive Improvements
- **Mobile-optimized game board** with touch-friendly cells
- **Flexible layouts** that adapt to any screen size
- **Improved button sizing** for better mobile interaction
- **Optimized font sizes** for readability across devices

### ⚡ Performance Optimizations
- **Lazy loading** of components where appropriate
- **Optimized animations** with reduced motion support
- **Efficient re-renders** with React best practices
- **Bundle optimization** with Next.js built-in features

## 🚀 Deployment

### Automated Deployment (Recommended)

The application includes a `render.yaml` configuration for easy deployment:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy modernized XOX game"
git push origin main
```

2. **Deploy on Render:**
- Connect your GitHub repository to Render
- The backend will auto-deploy using `render.yaml`
- Frontend deploys as a static site

### Manual Deployment

#### Backend (Node.js hosting)
```bash
cd backend
pnpm install --production
pnpm start
```

#### Frontend (Static hosting)
```bash
cd frontend
pnpm run build
# Deploy the 'out' folder to your static host
```

## 🔧 Environment Variables

### Frontend (`.env.local`)
```bash
# Development
NEXT_PUBLIC_WS_URL=http://localhost:3001

# Production  
NEXT_PUBLIC_WS_URL=https://your-backend-url.onrender.com
```

## 🎮 How to Play

1. **🏠 Enter your name** on the beautiful landing page
2. **🎯 Create a game** or **🚀 join with a room code**
3. **📋 Share the room code** with a friend
4. **⚡ Take turns** placing X's and O's with smooth animations
5. **🏆 Win by getting three in a row** - celebrate with confetti!

## 🎨 Design Features

- **Gradient backgrounds** for depth and modern look
- **Card-based layouts** with subtle shadows and borders
- **Smooth transitions** on all interactive elements
- **Consistent color scheme** with blue and purple accents
- **Modern typography** with proper font weights and spacing
- **Icon integration** for better visual communication

## 🛠️ Development Scripts

```bash
# Development
pnpm run dev              # Start both servers
pnpm run dev:frontend     # Frontend only
pnpm run dev:backend      # Backend only

# Building
pnpm run build:frontend   # Build frontend for production
pnpm run build           # Build all

# Installation
pnpm run install:all     # Install all dependencies
pnpm run install:frontend # Frontend dependencies only
pnpm run install:backend  # Backend dependencies only
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Tailwind CSS** for rapid UI development  
- **Lucide React** for beautiful icons
- **Socket.IO** for real-time functionality
- **Next.js team** for an amazing framework

---

Made with ❤️ by [MrArrogant2002](https://github.com/MrArrogant2002)