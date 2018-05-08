import React from 'react';
import {CsioEvents, TriggerEvent} from '../../../../events/CsioEvents';

class JoinMeeting extends React.Component {
  render() {
    const customeStyle = {
      textDecoration: 'none',
      background: 'inherit'
    };
    const JoinMeeting = (e) => {
      e.preventDefault();
      TriggerEvent(
        CsioEvents.LANDING_PAGE.ON_JOIN_MEETING_ROOM_LINK_CLICK, {});
    };
    return (
      <nav>
        <ul className={'nav nav-pills pull-right'}>
          <li role={'presentation'}>
            <a href="#" className={'btn btn-link'} style={customeStyle}
              id="join-meeting-link"
              onClick={JoinMeeting}>Join a meeting</a></li>
        </ul>
      </nav>
    );
  }
}
export default JoinMeeting;
