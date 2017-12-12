FROM node:4.3.1

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY Gruntfile.js /usr/src/app/
RUN npm install --silent -g grunt-cli
RUN npm install

COPY . /usr/src/app

CMD [ "npm", "start" ]
