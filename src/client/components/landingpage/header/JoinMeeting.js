import React from 'react';
const modCommon = require('../../../apis/utils/Common');
const CsioEvents = require('./../../../apis/csiortc/events/CsioEvents').CsioEvents;

class JoinMeeting extends React.Component {
  render() {
    const customeStyle = {
      textDecoration: 'none',
      background: 'inherit'
    };
    const JoinMeeting = () => {
      modCommon.triggerEvent(
        CsioEvents.UIEvent.JOIN_ROOM_LINK_CLICK,
        {});
    };
    return (
      <nav>
        <ul className={'nav nav-pills pull-right'}>
          <li role={'presentation'}>
            <a href="#" className={'btn btn-link'} style={customeStyle}
              onClick={JoinMeeting}>Join a meeting</a></li>
        </ul>
      </nav>
    );
  }
}
export default JoinMeeting;
