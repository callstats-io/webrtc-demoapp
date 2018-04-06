import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import AppLayout from 'components/applayout/AppLayout';

export default function() {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/" name="home" component={AppLayout} />
      </div>
    </BrowserRouter>
  );
}
