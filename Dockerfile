FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
EXPOSE 3000
COPY . .
CMD ["node", "app.js"]