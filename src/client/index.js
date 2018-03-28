import 'babel-polyfill';
import 'whatwg-fetch';

import 'sanitize.css/sanitize.css';

import intl from 'intl';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
// global styles
import './style.scss';
import CsioRTC from './apis/CsioRTC';

// apply polyfill
if (!window.Intl) {
  window.Intl = intl;
}
const tmp = new CsioRTC();
tmp.sayHello();
ReactDOM.render(<App />, document.getElementById('app'));
