FROM node:4.3.1

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY Gruntfile.js /usr/src/app/
RUN npm install --silent -g grunt-cli
RUN npm install; \
    mkdir ssl; \
    openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout ssl/server.key -out ssl/server.crt -passin pass:v2ZIZj2jKUap -subj '/CN=localhost/O=Local/C=FI'; \
    cp ssl/server.crt ssl/ca.crt; \
    if [ ! -f ssl/ecprivate.key ]; \
        then openssl ecparam -out ssl/ecprivate.key -name prime256v1 -genkey; \
        openssl ec -in ssl/ecprivate.key -pubout -out ssl/ecpub.key; \
    fi
COPY . /usr/src/app
RUN grunt build

CMD [ "npm", "start" ]
