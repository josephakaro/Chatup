# backend/Dockerfile.dev.backend

# Use official Node.js image for development
FROM node:18-alpine

# Install nodemon globally for hot reloading
RUN npm install -g nodemon

# Set working directory
WORKDIR /backend

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000 for the backend server
EXPOSE 5000

# Start the backend server with nodemon for hot reloading
CMD ["npm", "run","dev"]