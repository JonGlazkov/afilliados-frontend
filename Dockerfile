# Node.js v16
FROM node:18

# work directory
WORKDIR /app

COPY src/ .
COPY package*.json ./
COPY . .

# Listen 3000 port
EXPOSE 3000

# Building project
RUN npm install
RUN npm run build

# Start application
CMD ["npm", "start"]