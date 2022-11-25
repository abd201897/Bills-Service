FROM node:16.3.0-alpine

WORKDIR /app

ENV MONGO_URI=""
ENV PORT=8080
COPY package*.json ./
RUN npm install -g npm@8.19.3
RUN npm install dotenv

#RUN npm run prod

COPY . .

EXPOSE 8080
#CMD [ "node", "server.js" ]
CMD [ "npm", "run", "prod"]

