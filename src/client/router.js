import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import LandingLayout from 'components/landingpage/AppLayout';
import MeetingLayout from 'components/meetingpage/AppLayout';

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
