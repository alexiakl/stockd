FROM node:8

WORKDIR /usr/src/app

ADD package*.json ./
RUN npm install
ADD . .

EXPOSE 3000

CMD [ "npm", "start" ]
