#!/bin/bash

# Exit immediately if a command fails
set -e
set -e

echo "Setting up Docker buildx..."
docker buildx use multiarch-builder || docker buildx create --use --name multiarch-builder

echo "Logging into Docker Hub..."
docker login

echo "Building backend image for linux/amd64 and loading locally..."
docker buildx build --platform linux/amd64 -t nitin890/p2p-backend:latest ./app --load

echo "Pushing backend image to Docker Hub..."
docker push nitin890/p2p-backend:latest

echo "Building frontend image for linux/amd64 and loading locally..."
docker buildx build --platform linux/amd64 -t nitin890/p2p-frontend:latest ./ui --load

echo "Pushing frontend image to Docker Hub..."
docker push nitin890/p2p-frontend:latest

echo "All done! Images built, loaded locally, and pushed to Docker Hub."