FROM node:12-alpine

RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/America/New_York /etc/localtime

WORKDIR /fcict
RUN chown -R node:node /fcict
USER node
COPY --chown=node:node . .

RUN yarn install && yarn build
RUN yarn install --prod --force

EXPOSE 3000

ENTRYPOINT yarn start
