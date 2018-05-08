'use strict';

import React from 'react';
import HeaderRightHandler from '../../../handlers/meetingpage/HeaderRightHandler';
import { TriggerEvent, CsioEvents } from '../../../../events/CsioEvents';

class HeaderRight extends React.Component {
  constructor(props) {
    super(props);
    this.headerRightHandler = new HeaderRightHandler();
    this.state = this.headerRightHandler.getState();
    document.addEventListener(
      CsioEvents.CsioStats.ON_PRECALLTEST_RESULT_AVAILABLE,
      this.headerRightHandler.onStatAvailable.bind(this), false);
    TriggerEvent(CsioEvents.CsioStats.ON_ASK_PRECALLTEST_RESULT_AVAILABLE, {});
  }
  render() {
    return (
      <ul className="nav navbar-nav navbar-right">
        <li><a id="meeting-show-precall-test-btn" href="#" style={{color: '#FFFFFF', background: 'inherit', display: this.state.showStat}}
          onClick={this.headerRightHandler.mayBeShowStat.bind(this)}>
          <span className="glyphicon glyphicon-ice-lolly" aria-hidden="true"></span>
        </a></li>
        <li><a id="meeting-share-link-btn" href="#" style={{color: '#FFFFFF', background: 'inherit'}}
          onClick={this.headerRightHandler.onClickShareButton.bind(this)}>
          <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
        </a></li>
      </ul>
    );
  }
}

export default HeaderRight;
