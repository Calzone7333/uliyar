@echo off
echo Starting Bluecaller App...
echo Installing dependencies...
call npm install
echo Installing Database drivers (sqlite3, multer)...
call npm install sqlite3 multer
echo ---------------------------------------------
echo Server IP: 192.168.1.2
echo Public IP: 115.97.59.230
echo ---------------------------------------------
echo You can access the app from other devices at:
echo http://192.168.1.2:5174
echo ---------------------------------------------
npm run dev
pause
