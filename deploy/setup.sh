#!/bin/bash

# Ensure we're using Node.js 18
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18

# Build and start the containers
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d