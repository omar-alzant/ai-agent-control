FROM node:20-slim

WORKDIR /Backend

# Install dependencies first (for caching)
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

RUN npm run build

# Expose the port Railway uses
EXPOSE 4000

# Use tsx to run the server just like in development
CMD ["node", "dist/server.js"]