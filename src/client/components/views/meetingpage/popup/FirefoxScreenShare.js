'use strict';
import React from 'react';
import FFScreenShareHandler from '../../../handlers/meetingpage/FFScreenShareHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class FirefoxScreenShare extends React.Component {
  constructor(props) {
    super(props);
    this.ffScreenShareHandler = new FFScreenShareHandler();
    this.state = this.ffScreenShareHandler.getState();
    document.addEventListener(
      CsioEvents.CsioRTC.ON_FF_SCREEN_SHARE_OPTION,
      this.ffScreenShareHandler.onRequestScreenShare.bind(this), false);
  }

  render() {
    return (
      <div className="modal" tabIndex="-1" role="dialog" style={{
        display: this.state.showModal, paddingTop: '2%'}}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body" style={{textAlign: 'center'}}>
              <button onClick={this.ffScreenShareHandler.onScreenSelected.bind(this)}
                className="btn btn-primary"
                style={{margin: '2px'}}>
                Screen</button>
              <button onClick={this.ffScreenShareHandler.onApplicationSelected.bind(this)}
                className="btn btn-primary"
                style={{margin: '2px'}}>
                Application</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FirefoxScreenShare;
