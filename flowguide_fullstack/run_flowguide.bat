@echo off
title FlowGuide Launcher for Windows
echo ===================================================
echo             FLOWGUIDE WIN-LAUNCHER
echo ===================================================
echo Checking dependencies...

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH. Please install Python 3.10+.
    pause
    exit /b
)

:: Check Node.js / NPM
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js/NPM is not installed or not in PATH. Please install Node.js.
    pause
    exit /b
)

echo [OK] Python and Node.js detected.
echo.

:: Setup Backend
echo [INFO] Preparing Python Backend...
cd backend
if not exist venv (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)
echo [INFO] Installing/verifying backend dependencies...
call .\venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..
echo [OK] Backend ready.
echo.

:: Setup Frontend
echo [INFO] Preparing React Frontend...
cd frontend
if not exist node_modules (
    echo [INFO] Installing node packages (first-time setup, may take a minute)...
    call npm install
)
cd ..
echo [OK] Frontend ready.
echo.

:: Start Backend in separate window
echo [INFO] Starting FastAPI server on port 8000...
start "FlowGuide Backend Server" cmd /c "cd backend && call .\venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

:: Start Frontend in separate window
echo [INFO] Starting React Vite dev server on port 5173...
start "FlowGuide Frontend Server" cmd /c "cd frontend && npm run dev"

echo.
echo ===================================================
echo [SUCCESS] FlowGuide is starting up!
echo Opening browser...
echo ===================================================
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo.
echo Press any key to stop launchers and exit...
pause >nul
taskkill /FI "WINDOWTITLE eq FlowGuide Backend Server*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq FlowGuide Frontend Server*" /T /F >nul 2>&1
echo Done! Goodbye.
