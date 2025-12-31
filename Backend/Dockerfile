FROM node:20-slim

WORKDIR /Backend

COPY Backend/package*.json ./
RUN npm install --legacy-peer-deps

COPY Backend/. .
RUN npm run build

EXPOSE 4000
CMD ["npx", "tsx", "server.ts"]