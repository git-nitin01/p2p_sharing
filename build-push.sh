#!/bin/bash

# Exit immediately if a command fails
set -e

echo "Building backend image..."
docker build -t nitin890/p2p-backend:latest ./app

echo "Building frontend image..."
docker build -t nitin890/p2p-frontend:latest ./ui

echo "Logging into Docker Hub..."
docker login

echo "Pushing backend image to Docker Hub..."
docker push nitin890/p2p-backend:latest

echo "Pushing frontend image to Docker Hub..."
docker push nitin890/p2p-frontend:latest

echo "All done! Images pushed to Docker Hub."
