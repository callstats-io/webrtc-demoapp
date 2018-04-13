import React from 'react';
import AlertHandler from '../../../handlers/meetingpage/AlertHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

// we will not show alert now. Instead we will direct all alert to data channel message
// except chrome extension link
class AlertLayout extends React.Component {
  constructor(props) {
    super(props);
    this.alertHandler = new AlertHandler();
    this.showAlart = this.alertHandler.showAlart.bind(this);
    this.getUserName = this.alertHandler.getUserName.bind(this);
    this.broadcastAlart = this.alertHandler.broadcastAlart.bind(this);
    this.state = this.alertHandler.getState(this.props.roomName);
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
              Download extension from: <strong> Here!</strong></a>
          </div>
        </div>
      </div>
    );
  }
}

export default AlertLayout;
