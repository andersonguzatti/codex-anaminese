Param(
  [string]$ApiUrl = "http://localhost:5215"
)

$ErrorActionPreference = 'Stop'

# Always work from the repo root where this script lives
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

# Make sure PowerShell can invoke npm.ps1 in this session (does not persist)
try {
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null
} catch {}

Write-Host "[dev] Starting backend (.NET) and frontend (Vite) ..." -ForegroundColor Cyan

# Start backend in a job
$backendJob = Start-Job -Name backend -ScriptBlock {
  param($root)
  Set-Location (Join-Path $root 'backend')
  & dotnet restore
  & dotnet run
} -ArgumentList $root

# Start frontend in a job
$frontendJob = Start-Job -Name frontend -ScriptBlock {
  param($root, $api)
  Set-Location (Join-Path $root 'frontend')
  $env:VITE_API_URL = $api
  # Prefer npm (PowerShell command); fall back to npm.cmd if needed
  if (Get-Command npm -ErrorAction SilentlyContinue) {
    & npm install
    & npm run dev
  } elseif (Get-Command npm.cmd -ErrorAction SilentlyContinue) {
    & npm.cmd install
    & npm.cmd run dev
  } else {
    throw "npm not found. Install Node.js LTS from https://nodejs.org/."
  }
} -ArgumentList $root, $ApiUrl

Write-Host "[dev] Jobs started: backend=$($backendJob.Id) frontend=$($frontendJob.Id)" -ForegroundColor Green
Write-Host "[dev] Tailing job output. Press Ctrl+C to stop." -ForegroundColor Yellow

# Stream outputs
while ($true) {
  Receive-Job -Id $backendJob.Id -Keep | ForEach-Object { Write-Host "[backend] $_" }
  Receive-Job -Id $frontendJob.Id -Keep | ForEach-Object { Write-Host "[frontend] $_" }
  Start-Sleep -Seconds 1
}

