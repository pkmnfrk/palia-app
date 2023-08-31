FROM node:20-alpine
ARG cdnv
ENV CDNV=$cdnv
ENV API_ROOT=/api

WORKDIR /var/app
COPY web /var/app

RUN npm i
RUN npm run build

FROM node:20-alpine
ARG cdnv
ENV CDNV=$cdnv
ENV STATIC_ROOT=./dist

WORKDIR /var/app
ADD api/package.json /var/app/package.json
ADD api/package-lock.json /var/app/package-lock.json

RUN npm i --omit=dev

COPY api /var/app
COPY --from=0 /var/app/dist /var/app/dist

CMD ["node", "index.js"]