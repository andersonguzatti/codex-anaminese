@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Always run from the repo root where this script lives
pushd %~dp0

set API_URL=http://localhost:5215

echo [dev] Starting backend (.NET) and frontend (Vite) ...

REM Start backend in a new window
start "Anamnese Backend" cmd /k "cd backend && dotnet restore && dotnet run"

REM Start frontend in a new window (use cmd to avoid PowerShell execution policy issues)
start "Anamnese Frontend" cmd /k "cd frontend && set VITE_API_URL=%API_URL% && call npm install && call npm run dev"

popd
endlocal

