# Image: node:apline
FROM node:18-alpine

# Set the working directory
WORKDIR /backend

# Copy the package.json file
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . ./

# prisma generate
RUN npx prisma generate

# Expose the port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]