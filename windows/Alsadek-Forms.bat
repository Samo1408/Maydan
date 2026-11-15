@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist "start.mjs" goto nostart
if not exist ".output\server\index.mjs" goto noout
if exist "runtime\node.exe" goto local
where node >nul 2>&1
if errorlevel 1 goto nonode
node "start.mjs"
goto end
:local
"runtime\node.exe" "start.mjs"
goto end
:nostart
echo.
echo start.mjs not found next to this file.
echo Folder checked: %~dp0
echo If you are inside a ZIP, extract the whole zip first.
echo.
pause
exit /b 1
:noout
echo.
echo The folder ".output" is missing next to this file.
echo Folder checked: %~dp0
echo It is a hidden-name folder: the package must be rebuilt with the fixed workflow.
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
