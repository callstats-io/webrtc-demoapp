import 'babel-polyfill';
import 'whatwg-fetch';

import 'sanitize.css/sanitize.css';

import intl from 'intl';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
// global styles
import './style.scss';

// apply polyfill
if (!window.Intl) {
  window.Intl = intl;
}

ReactDOM.render(<App />, document.getElementById('app'));
