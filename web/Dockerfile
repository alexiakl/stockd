FROM node:13.5.0

WORKDIR /usr/src/app
COPY package*.json ./
COPY app.yaml .
COPY .env.local .
RUN npm install
# COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
