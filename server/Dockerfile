FROM node:dubnium-alpine

EXPOSE 3000

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]