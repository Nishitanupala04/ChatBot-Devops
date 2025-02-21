# Use Node.js as base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]
