FROM node:12-alpine

WORKDIR /fcict
COPY . .
RUN yarn install && yarn build
RUN rm -rf node_modules
RUN yarn install --prod
RUN yarn cache clean

EXPOSE 3000

CMD ["yarn", "start"]
