FROM node:14.16.0-alpine3.10

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5000

CMD yarn run start:dev