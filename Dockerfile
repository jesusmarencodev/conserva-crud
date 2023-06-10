FROM node:latest

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn global add typescript

RUN yarn build

CMD ["node", "dist/index.js"]
