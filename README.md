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
  - port: server port if no SSL is used
  - portSSL: server port if SSL is used
  - SSL: boolean if SSL should be enabled
  - APPID: callstats app ID from your dashboard
  - APPSECRET: callstats secret key from your dashboard, necessary if no JWT is used ([see here](https://callstats.io/api/#step-2-initialize-with-appsecret))
  - KEYID: callstats key ID for JWT authentication ([see here](https://callstats.io/api/#third-party-authentication))
  - JWT: boolean if JWT authentication should be used
  - CSJSURL: callstats.js URL

Example:
```
port=8081
portSSL=4040
SSL=true
APPID=callstatsAppId
APPSECRET=callstatsAppSecret
KEYID=callstatsKeyID
JWT=true
CSJSURL=http://127.0.0.1:3000/static/callstats.min.js

```
4. If you want to use SSL, generate SSL certificates to webrtc-demoapp/ssl/ folder (see below)
5. If you want to use JWT authentication, generate EC key to webrtc-demoapp/ssl/ (see below)
5. Run the app
```
$ npm start
```
  Try the app locally by opening https://localhost:4440/.

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
