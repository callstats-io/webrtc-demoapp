import React from 'react';

import HeaderLayout from './header/HeaderLayout';
import ContentLayout from './content/ContentLayout';
import ShareLinkPopup from './popup/ShareLinkPopup';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';
import AlertLayout from './alert/AlertLayout';
import FirefoxScreenShare from './popup/FirefoxScreenShare';

export class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    this.roomName = this.props.match.params.roomName;
    const detail = {
      roomName: this.roomName
    };
    TriggerEvent(
      CsioEvents.MEETING_PAGE.ON_MEETING_PAGE_LOADED,
      detail);
  }
  render() {
    return (
      <div className={'container-fluid'}>
        <HeaderLayout roomName={this.roomName}/>
        <AlertLayout/>
        <ContentLayout/>
        <ShareLinkPopup/>
        <FirefoxScreenShare/>
      </div>
    );
  }
}

export default AppLayout;
