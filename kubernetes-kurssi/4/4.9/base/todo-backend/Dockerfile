FROM node:20

WORKDIR /app

COPY package*.json ./

COPY index.js ./

RUN npm install


EXPOSE 3001

CMD ["node", "index.js"]
