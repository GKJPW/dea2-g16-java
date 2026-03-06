# Use a lightweight version of Node.js
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first (for caching efficiency)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend code into the container
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Start the Vite dev server and EXPOSE it to the host network using --host
CMD ["npm", "run", "dev", "--", "--host"]