# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies inside the container
RUN npm install --force

# Copy the rest of the application
COPY . .

# Expose Vite’s default port
EXPOSE 5173

# Run Vite using npx (ensures it's found)

CMD ["npm" , "run" , "dev"]

