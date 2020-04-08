FROM node:12-alpine

RUN apk --no-cache add tzdata
RUN cp /usr/share/zoneinfo/America/New_York /etc/localtime

WORKDIR /fcict
COPY . .
RUN yarn install && yarn build
RUN rm -rf node_modules
RUN yarn install --prod
RUN yarn cache clean

EXPOSE 3000

CMD ["yarn", "start"]
