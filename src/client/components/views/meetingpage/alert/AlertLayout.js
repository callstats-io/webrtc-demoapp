import React from 'react';
import AlertHandler from '../../../handlers/meetingpage/AlertHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class AlertLayout extends React.Component {
  constructor(props) {
    super(props);
    this.alertHandler = new AlertHandler();
    this.showAlart = this.alertHandler.showAlart.bind(this);
    this.state = this.alertHandler.getState();
    document.addEventListener(CsioEvents.CSIOSignaling.ON_JOIN,
      this.alertHandler.onNewUserJoined.bind(this), false);
    document.addEventListener(CsioEvents.CSIOSignaling.ON_LEAVE,
      this.alertHandler.onUserLeave.bind(this), false);
    document.addEventListener(CsioEvents.MEETING_PAGE.ON_TOGGLE_MEDIA_STATE,
      this.alertHandler.onToggleMediaState.bind(this), false);
    document.addEventListener(CsioEvents.CsioRTC.ON_EXTENTION_REQUIRED,
      this.alertHandler.onMayBeDownloadExtention.bind(this), false);
  }
  render() {
    return (
      <div>
        <div className={'container-fluid'} style={{padding: '0px', display: this.state.display}}>
          <div id='alert' className={`alert ${this.state.fadein} ${this.state.alertType}`}
            role="alert" style={{'textAlign': 'center'}}>
            {this.state.text}
          </div>
        </div>
        <div className={'container-fluid'} style={{padding: '0px', display: this.state.extensionDisplay}}>
          <div id='alert' className={'alert alert-danger'}
            role="alert" style={{'textAlign': 'center'}}>
            <a onClick={this.alertHandler.onClickExtensionDownloadLink.bind(this)}
              target="_blank"
              href={this.state.extensionDownloadURL}>
              {`Download extension from: ${this.state.extensionDownloadURL}`}</a>
          </div>
        </div>
      </div>
    );
  }
}

export default AlertLayout;
