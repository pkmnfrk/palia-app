FROM node:20-alpine
ARG cdnv=test
ARG wss=wss
ENV CDNV=$cdnv
ENV API_ROOT=/api
ENV WEBSOCKET_PROTOCOL=$wss
ENV WEBSOCKET_HOST=

WORKDIR /var/app
COPY web /var/app
ADD VERSION /var/app/.env

RUN npm i
RUN npm run build && cp public/favicon.png dist/

FROM node:20-alpine

WORKDIR /var/app
ADD api/package.json /var/app/package.json
ADD api/package-lock.json /var/app/package-lock.json

RUN npm i --omit=dev

COPY api /var/app
COPY --from=0 /var/app/dist /var/app/dist
ENV NODE_ENV=docker

CMD ["node", "index.js"]