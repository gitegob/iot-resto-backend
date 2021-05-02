FROM node:14.16.0-alpine3.10

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn global add @nestjs/cli@7.6.0

RUN yarn install

COPY . .

ENV NODE_ENV=production

EXPOSE $PORT

CMD yarn start
