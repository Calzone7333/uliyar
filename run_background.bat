@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo   BlueCaller Background Launcher
echo ===================================================

:: Check if node_modules exists, install if not
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

:: Kill previous instances to avoid port conflicts (Optional, but recommended for dev)
echo Cleaning up previous instances...
taskkill /F /IM node.exe >nul 2>&1

:: Clean old log
if exist bluecaller.log del bluecaller.log

echo Starting application in background...
start "" wscript.exe background_runner.vbs

echo Application launched! Waiting for startup logs...
echo ---------------------------------------------------

:: Wait loop to show initial logs (10 seconds)
set "timeout_count=10"
:monitor_loop
cls
echo ===================================================
echo   BlueCaller Background Launcher
echo ===================================================
echo.
echo Application is running in the background.
echo Monitor closing in %timeout_count% seconds...
echo.
echo --- Latest Logs (bluecaller.log) ---
if exist bluecaller.log (
    powershell -command "Get-Content bluecaller.log -Tail 15"
) else (
    echo Waiting for logs...
)
echo ----------------------------------------

timeout /t 1 /nobreak >nul
set /a timeout_count-=1
if %timeout_count% gtr 0 goto monitor_loop

echo.
echo Launcher closing. Application continues to run in the background.
echo To view logs later, check 'bluecaller.log'.
echo To stop the app, run 'stop_bluecaller.bat' (I'll create this for you).
timeout /t 2
exit
