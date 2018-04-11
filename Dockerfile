FROM node:8.9.4

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --silent

COPY . /usr/src/app

ARG APPID
ARG APPSECRET
ARG CSJSURL
ARG EXTENSION_URL
ARG JWT

ENV APPID=${APPID}
ENV APPSECRET=${APPSECRET}
ENV CSJSURL=${CSJSURL}
ENV EXTENSION_URL=${EXTENSION_URL}
ENV JWT=${JWT}

RUN npm run build
CMD [ "npm", "start" ]
