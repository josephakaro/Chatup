# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /frontend

# Copy package.json and yarn.lock to install dependencies first (for better caching)
COPY package.json yarn.lock ./

# install yarn globaly if not exist
RUN npm install -g yarn -y

# Install dependencies
RUN yarn install

# Copy the rest of the application source code to the working directory
COPY . .

# Expose Vite's default development port
EXPOSE 5173

# Set environment variable to specify the port

# Start the development server
CMD ["yarn", "dev"]
