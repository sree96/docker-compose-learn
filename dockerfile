FROM node:alpine

WORKDIR /src/app

COPY package*.json /src/app/

RUN npm install \
  && npm install nodemon -g

COPY . ./

CMD ["nodemon", "app.js"] 
