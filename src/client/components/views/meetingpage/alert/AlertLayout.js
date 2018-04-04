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
  }
  render() {
    return (
      <div className={'container-fluid'} style={{padding: '0px', display: this.state.display}}>
        <div id='alert' className={`alert ${this.state.fadein} ${this.state.alertType}`}
          role="alert" style={{'textAlign': 'center'}}>
          {this.state.text}
        </div>
      </div>
    );
  }
}

export default AlertLayout;
