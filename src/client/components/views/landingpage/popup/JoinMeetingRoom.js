'use strict';
import React from 'react';
import {Redirect} from 'react-router-dom';
import JoinMeetingHandler from '../../../handlers/landingpage/JoinMeetingHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class JoinMeetingRoomPopup extends React.Component {
  constructor(props) {
    super(props);
    this.joinMeetingHandler = new JoinMeetingHandler();
    this.state = this.joinMeetingHandler.getState();
    document.addEventListener(
      CsioEvents.LANDING_PAGE.ON_JOIN_MEETING_ROOM_LINK_CLICK,
      this.joinMeetingHandler.onJoinRoomClick.bind(this),
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
                  id="join-meeting-popup-name-input"
                  value={this.state.roomName}
                  onChange={this.joinMeetingHandler.handleInputChange.bind(this)}
                  onKeyUp={this.joinMeetingHandler.onKeyUp.bind(this)}/>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button"
                id="join-meeting-popup-join-btn"
                className="btn btn-primary"
                disabled={!this.state.joinRoomButtonEnabled}
                onClick={this.joinMeetingHandler.handleJoinMeeting.bind(this)}
              > Join room </button>
              <button type="button"
                id="join-meeting-popup-close-btn"
                className="btn btn-primary"
                onClick={this.joinMeetingHandler.handleCloseModal.bind(this)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default JoinMeetingRoomPopup;
