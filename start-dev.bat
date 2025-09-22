@echo off@echo off

echo ========================================echo Starting Online XOX Development Server...

echo    🎮 Online XOX - Development Setupecho.

echo ========================================echo This will start both Next.js and Socket.IO server on port 3001

echo.echo.

echo Starting both Backend and Frontend servers...echo Opening browser in 5 seconds...

echo.echo.

echo Backend: http://localhost:3001 (Socket.IO)

echo Frontend: http://localhost:3000 (Next.js):: Start the server

echo.powershell -ExecutionPolicy Bypass -Command "npm run dev"

echo Press Ctrl+C to stop both servers

echo.pause

:: Start backend server in background
echo ⚡ Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node index.js"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend server in background
echo ⚡ Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

:: Wait a moment for frontend to start
timeout /t 5 /nobreak >nul

:: Open browser
echo 🌐 Opening browser...
start http://10.2.25.44:3000

echo.
echo ✅ Both servers are starting!
echo ✅ Your game will open automatically in the browser
echo.
echo To stop servers: Close the terminal windows or press Ctrl+C in each
echo.
pause