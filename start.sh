#!/bin/bash

echo "Starting locally Chatty!"

cd client && npm i && npm run dev &

echo "[CLIENT] Client Started"

cd server && npm i && npm run test &

echo "[SERVER] Server Started"

wait