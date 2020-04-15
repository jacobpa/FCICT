FROM node:12-alpine as build
WORKDIR /src
COPY . .
RUN yarn install && yarn build && yarn install --prod

FROM node:12-alpine as serve
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/America/New_York /etc/localtime

WORKDIR /fcict
COPY --from=build /src/__sapper__ ./__sapper__
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/static ./static

EXPOSE 3000

ENTRYPOINT node __sapper__/build
