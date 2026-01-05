#!/bin/bash

echo "Building Ahmad Ziyad Portfolio for Vercel..."

# Navigate to frontend directory
cd packages/frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Build the project
echo "Building frontend..."
npm run build

echo "Build completed successfully!"