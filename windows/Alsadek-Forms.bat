@echo off
cd /d "%~dp0"
if not exist "start.mjs" goto bad
if not exist ".output\server\index.mjs" goto bad
if exist "runtime\node.exe" goto local
where node >nul 2>&1
if errorlevel 1 goto nonode
node "start.mjs"
goto end
:local
"runtime\node.exe" "start.mjs"
goto end
:bad
echo.
echo Extract the WHOLE zip first. Do not run Alsadek-Forms.bat from inside the ZIP.
echo Right-click Alsadek-Forms-Windows.zip, choose Extract All, open the folder, then double-click Alsadek-Forms.bat.
echo.
pause
exit /b 1
:nonode
echo.
echo Node.js was not found. Install it from https://nodejs.org and run this file again.
echo.
pause
exit /b 1
:end
echo.
pause
