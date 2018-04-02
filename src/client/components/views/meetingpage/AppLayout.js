import React from 'react';

import HeaderLayout from './header/HeaderLayout';
import ContentLayout from './content/ContentLayout';
import ShareLinkPopup from './popup/ShareLinkPopup';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

export class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    const roomName = this.props.match.params.roomName;
    const detail = {
      roomName: roomName
    };
    TriggerEvent(
      CsioEvents.MEETING_PAGE.ON_MEETING_PAGE_LOADED,
      detail);
  }
  render() {
    return (
      <div className={'container-fluid'}>
        <HeaderLayout/>
        <ContentLayout/>
        <ShareLinkPopup/>
      </div>
    );
  }
}

export default AppLayout;
