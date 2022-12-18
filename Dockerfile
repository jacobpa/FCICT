FROM node:16-alpine as build
WORKDIR /src
COPY . .
RUN apk add --no-cache git python3 ca-certificates make g++ && ln -s /usr/bin/python3 /usr/bin/python
RUN yarn install && yarn build && yarn install --prod

FROM node:16-alpine as serve
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/America/New_York /etc/localtime

WORKDIR /fcict
COPY --from=build /src/__sapper__ ./__sapper__
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/static ./static

EXPOSE 3000

ENTRYPOINT node __sapper__/build
