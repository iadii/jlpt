#!/bin/bash

echo "======================================"
echo " Starting JLPT Sensei Services"
echo "======================================"

# Trap SIGINT (Ctrl+C) and terminate all child processes
trap "echo 'Stopping all services...'; kill 0" SIGINT SIGTERM EXIT

echo "[1/3] Starting Django Backend (Port 8000)..."
cd backend
source .venv/bin/activate
python manage.py runserver 8000 &
cd ..

echo "[2/3] Starting FastAPI ML Service (Port 8002)..."
cd backend/ml_service
source .venv/bin/activate
uvicorn main:app --port 8002 &
cd ../..

echo "[3/3] Starting Next.js Frontend (Port 3000)..."
cd frontend
npm run dev &
cd ..

echo "======================================"
echo " All services started!"
echo " Frontend: http://localhost:3000"
echo " Backend: http://localhost:8000"
echo " ML Service: http://localhost:8002/docs"
echo " Press Ctrl+C to stop all services."
echo "======================================"

# Wait for all background processes
wait
