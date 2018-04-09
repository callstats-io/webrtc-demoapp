# webrtc-demoapp

This is a WebRTC test application running on node.js and express.js

### Get started
1. Install node.js if not installed (https://nodejs.org/en/download/)
2. Clone and install
```
$ https://github.com/callstats-io/webrtc-demoapp.git
$ cd webrtc-demoapp/
$ npm install
```
3. Set environment variables:

Environment variables to run the demo application
- PORT: server port to run the demo application
- SSL: boolean to decide if SSL should be enabled
- APPID: callstats app ID from your dashboard
- APPSECRET: callstats secret key from your dashboard, necessary if no JWT is used ([see here](https://callstats.io/api/#step-2-initialize-with-appsecret))
- KEYID: callstats key ID for JWT authentication ([see here](https://callstats.io/api/#third-party-authentication))
- JWT: boolean if JWT authentication should be used
- EXTENSION_URL: chrome extension download link. If extension is not installed where to get the extention 

Example :

Run from command line given that we have environment variable set in .env file
```
# run development mode
npm run dev

# run production mode
npm run build
npm start

# run prettier
npm run prettier

# run lint
npm run lint
```
Single command line expression to run from terminal for development mode
```
PORT=4040 \
SSL=true \
JWT=false \
APPID='change_here_to_your_callstats_app_id' \
APPSECRET='change_here_to your_callstats_app_secret' \
EXTENSION_URL='https://change_here_to_your_chrome_extension_download_link' \
npm run dev
```
Try the app locally by opening http://localhost:4040/ or https://localhost:4040/, depending on if SSL is enabled or not (there is NO redirect!)

4. If you want to use SSL, generate SSL certificates to webrtc-demoapp/ssl/ folder (see below)
5. If you want to use JWT authentication, generate EC key to webrtc-demoapp/ssl/ (see below)
### SSL
Needs ca.crt, server.crt, server.key:
```
openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout server.key -out server.crt -passin pass:v2ZIZj2jKUap -subj '/CN=localhost/O=Local/C=FI'
cp server.crt ca.crt
```

### JWT
Needs ecpriv.key, ecpubkey.pem:
```
openssl ecparam -name prime256v1 -genkey > ecpriv.key
openssl ec -in ecpriv.key -pubout -out ecpubkey.pem
```
