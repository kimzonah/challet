# Use Node.js 20.17.0 for building the React app
FROM node:20.17.0 as build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React application
RUN npm run build

# Expose a port (optional, since it's just a build stage)
EXPOSE 3000