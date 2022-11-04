FROM node:16.3.0-alpine

WORKDIR /app

ENV MONGO_URI=""
COPY package*.json ./

RUN npm install

#RUN npm run prod

COPY . .

EXPOSE 8080
#CMD [ "node", "server.js" ]
CMD [ "npm", "run", "prod"]

