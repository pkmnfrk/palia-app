FROM node:20-alpine
COPY api /var/app
COPY dist /var/app/dist
ENV STATIC_ROOT=./dist

WORKDIR /var/app
RUN npm i --omit=dev

CMD ["node", "index.js"]