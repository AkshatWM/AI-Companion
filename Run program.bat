@echo off
title Python + Ollama launcher
echo Starting Ollama …
start "Ollama" cmd /k "ollama serve"

echo Starting Python serve.py …
start "Serve" cmd /k "python -m http.server 8000"

start http://localhost:8000/index.html

echo.
echo Both services are starting in their own windows.
echo Press any key to close this launcher (services keep running).
pause >nul