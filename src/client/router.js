import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

// Disable landing page for a while to implement meeting page UI
// Todo enable routing, and landing page when implementing actions
// import AppLayout from 'components/landingpage/AppLayout';
import AppLayout from 'components/meetingpage/AppLayout';

export default function() {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/" name="home" component={AppLayout} />
      </div>
    </BrowserRouter>
  );
}
