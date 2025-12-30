# 1. Use Node.js as the base image
FROM node:20-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first to speed up builds (caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install --legacy-depth-apear

# 5. Copy the rest of the frontend code
COPY . .

# 6. Expose the standard development port (3000)
EXPOSE 3000

# 7. Start the app in development mode
# Note: For production, you would use "npm run build" and then "npm start"
CMD ["npm", "run", "dev"]