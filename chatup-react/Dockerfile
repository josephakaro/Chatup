# Use official Node.js image for development
FROM node:18-alpine

# Set working directory
WORKDIR /frontend

# Install dependencies
COPY package*.json ./
RUN yarn install

# Install development dependencies (like react-scripts)
# Assuming dependencies are already in package.json

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the React development server
EXPOSE 5173

# Start the React development server
CMD ["yarn", "dev"]
