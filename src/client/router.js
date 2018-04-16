/**
 * Router for demo application.
 * Currently router has two route
 *    1. Landing page for demo application
 *          From landing page we can create, or open an existing meeting
 *    2. Meeting page for demo application
 *          Main conference page of the demo application
 */
import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import LandingLayout from 'components/views/landingpage/AppLayout';
import MeetingLayout from 'components/views/meetingpage/AppLayout';

export default function() {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/" name="home" component={LandingLayout}/>
        <Route path="/:roomName" name="meeting" component={MeetingLayout}/>
      </div>
    </BrowserRouter>
  );
}
