import React from 'react';

import HeaderLayout from './header/HeaderLayout';
import ContentLayout from './content/ContentLayout';

const CsioEvents = require('./../../apis/csiortc/events/CsioEvents').CsioEvents;
const triggerEvent = require('./../../apis/csiortc/events/CsioEvents').triggerEvent;
export class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    const roomName = this.props.match.params.roomName;
    const detail = {
      roomName: roomName,
      from: 'appLayout'
    };
    triggerEvent(
      CsioEvents.UIEvent.MEETING_PAGE_LOADED,
      detail);
  }
  render() {
    return (
      <div className={'container-fluid'}>
        <HeaderLayout/>
        <ContentLayout/>
      </div>
    );
  }
}

export default AppLayout;
