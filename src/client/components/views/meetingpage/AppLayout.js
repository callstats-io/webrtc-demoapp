import React from 'react';

import HeaderLayout from './header/HeaderLayout';
import ContentLayout from './content/ContentLayout';
import ShareLinkPopup from './popup/ShareLinkPopup';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';
import AlertLayout from './alert/AlertLayout';
import FirefoxScreenShare from './popup/FirefoxScreenShare';
import UserFeedbackPopup from './popup/UserFeedbackPopup';
import PrecalltestResultPopup from './popup/PrecalltestResultPopup';
import LoadingLayout from './loading/LoadingLayout';

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
      <div className={'container-fluid'} id='principle-dom'>
        <HeaderLayout roomName={this.roomName}/>
        <AlertLayout roomName={this.roomName}/>
        <LoadingLayout/>
        <ContentLayout/>
        <ShareLinkPopup/>
        <FirefoxScreenShare/>
        <UserFeedbackPopup/>
        <PrecalltestResultPopup/>
      </div>
    );
  }
}

export default AppLayout;
