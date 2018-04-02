'use strict';
import React from 'react';
import {Redirect} from 'react-router-dom';

import JoinMeetingHandler from '../../../handlers/landingpage/JoinMeetingHandler';
const CsioEvents = require('./../../../apis/csiortc/events/CsioEvents').CsioEvents;

class JoinRoomPopup extends React.Component {
  constructor(props) {
    super(props);
    this.meetingHandler = new JoinMeetingHandler(this);
    this.state = this.meetingHandler.getState();
    document.addEventListener(
      CsioEvents.UIEvent.JOIN_ROOM_LINK_CLICK,
      this.meetingHandler.onJoinRoomClick.bind(this),
      false);
  }

  render() {
    const customStyle = {
      paddingTop: '5%',
      paddingBottom: '8%'
    };
    const shouldRedirectToMeetingPage = this.state.shouldRedirectToMeetingPage;
    if (shouldRedirectToMeetingPage) {
      const roomName = `/${this.state.roomName}`;
      return <Redirect push to={roomName}/>;
    }
    return (
      <div className="modal" tabIndex="-1" role="dialog" style={{
        display: this.state.showModal, paddingTop: '2%'}}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="input-group col-lg-offset-4"
                style={customStyle}>
                <input className="form-control"
                  placeholder="Meeting name"
                  value={this.state.roomName}
                  onChange={this.meetingHandler.handleInputChange.bind(this)}/>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button"
                className="btn btn-primary"
                disabled={!this.state.joinRoomButtonEnabled}
                onClick={this.meetingHandler.handleJoinMeeting.bind(this)}
              > Join room </button>
              <button type="button"
                className="btn btn-primary"
                onClick={this.meetingHandler.handleCloseModal.bind(this)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default JoinRoomPopup;
