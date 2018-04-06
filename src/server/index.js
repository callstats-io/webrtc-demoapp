'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const setupApiRoutes = require('./middlewares/api');
const signalingServer = require('./csiosignalingserver');
const logger = require('./logger');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;
process.env.SSL = process.env.SSL || 'false';
process.env.JWT = process.env.JWT || 'false';
process.env.APPID = process.env.APPID || '';
process.env.APPSECRET = process.env.APPSECRET || '';

const onUnhandledError = (err) => {
  try {
    logger.error(err);
  } catch (e) {
    console.log('LOGGER ERROR:', e); // eslint-disable-line no-console
    console.log('APPLICATION ERROR:', err); // eslint-disable-line no-console
  }
  process.exit(1);
};

process.on('unhandledRejection', onUnhandledError);
process.on('uncaughtException', onUnhandledError);

const setupAppRoutes =
  process.env.NODE_ENV === 'development' ? require('./middlewares/development') : require('./middlewares/production');

const app = express();

app.set('env', process.env.NODE_ENV);
logger.info(`Application env: ${process.env.NODE_ENV}`);

app.use(logger.expressMiddleware);
app.use(bodyParser.json());
app.use('/static', express.static('src/server/public'));

// application routes
setupApiRoutes(app);
setupAppRoutes(app);

// check ssl is enabled
let options = {};
if (process.env.SSL === 'true') {
  options = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt'),
    ca: fs.readFileSync('ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false,
    passphrase: 'v2ZIZj2jKUap'
  };
}
const server = process.env.SSL === 'true' ? https.createServer(options, app)
  : http.createServer(app);
server.listen(process.env.PORT, () => {
  const isSSL = process.env.SSL === 'true';
  logger.info(`${isSSL ? 'HTTPS' : 'HTTP'} server is now running on 
  ${isSSL ? 'https' : 'http'}://localhost:${process.env.PORT}`);
});
// run socket io based signaling server
let privKey = null;
if (process.env.JWT === 'true') {
  privKey = fs.readFileSync('ssl/ecpriv.key');
}
signalingServer(server, privKey);
