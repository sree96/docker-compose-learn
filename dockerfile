FROM node:alpine

WORKDIR /src/app

COPY package*.json /src/app/

RUN npm install \
  && npm install nodemon -g

ADD . .

CMD ["nodemon", "app.js"] 
