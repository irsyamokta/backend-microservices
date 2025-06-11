FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npx prisma migrate dev

COPY . .

CMD ["npm", "run", "start"]