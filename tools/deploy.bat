@echo off
chcp 65001 >nul
echo ===== 87.9 MHz Auto Deploy =====
echo.
node "%~dp0deploy.js"
echo.
pause
