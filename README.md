# webrtc-demoapp

This is a WebRTC test application running on node.js and express.js


Get started:

1. Install node.js if not installed (https://nodejs.org/en/download/)
2. Clone and install
```
$ https://github.com/callstats-io/webrtc-demoapp.git
$ cd webrtc-demoapp/
$ npm install
```
3. Set environment variables (example):
```
port=8081
portSSL=4040
SSL=true
APPID=callstatsAppId
APPSECRET=callstatsAppSecret
```
4. If you want to use SSL, generate SSL certificates to webrtc-demoapp/ssl/ folder (ca.crt, server.crt, server.key)
5. Run the app
```
$ npm start
```
  Try the app locally by opening https://localhost:4440/.
