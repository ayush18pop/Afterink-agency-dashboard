@echo off
echo Starting AfterInk Dashboard Servers...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend && node server.js"

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd Frontend && npm start"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul 