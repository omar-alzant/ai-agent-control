FROM node:20-slim

WORKDIR /Frontend

COPY Frontend/package*.json ./

RUN npm install --legacy-peer-deps

COPY Frontend/. .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]