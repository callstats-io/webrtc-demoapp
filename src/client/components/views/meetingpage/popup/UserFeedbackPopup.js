'use strict';
import React from 'react';
import UserFeedbackPopupHandler from '../../../handlers/meetingpage/UserFeedbackPopupHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class UserFeedbackPopup extends React.Component {
  constructor(props) {
    super(props);
    this.userFeedbackPopupHandler = new UserFeedbackPopupHandler();
    this.state = this.userFeedbackPopupHandler.getState();
    document.addEventListener(
      CsioEvents.MEETING_PAGE.ON_MEETING_CLOSE_CLICKED,
      this.userFeedbackPopupHandler.onMeetingPageClosed.bind(this),
      false
    );
  }

  render() {
    const customStyle = {
      paddingTop: '%',
      paddingBottom: '0px'
    };

    return (
      <div className="modal" tabIndex="-1" role="dialog" style={{
        display: this.state.showModal, paddingTop: '2%'}}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon3">Meeting feedback: </span>
                <input className="form-control" id="basic-url" aria-describedby="basic-addon3/"
                  value={this.state.meetingFeedback}
                  onChange={this.userFeedbackPopupHandler.onUpdateMeetingFeedback.bind(this)}/>
              </div>
              <br/>
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon3">Audio feedback: </span>
                <input className="form-control" id="basic-url" aria-describedby="basic-addon3/"
                  value={this.state.audioFeedback}
                  onChange={this.userFeedbackPopupHandler.onUpdateAudioFeedback.bind(this)}/>
              </div>
              <br/>
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon3">Video feedback: </span>
                <input className="form-control" id="basic-url" aria-describedby="basic-addon3/"
                  value={this.state.videoFeedback}
                  onChange={this.userFeedbackPopupHandler.onUpdateVideoFeedback.bind(this)}/>
              </div>
              <br/>
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon3">Screen share feedback: </span>
                <input className="form-control" id="basic-url" aria-describedby="basic-addon3/"
                  value={this.state.screenshareFeedback}
                  onChange={this.userFeedbackPopupHandler.onUpdateScreenShareFeedback.bind(this)}/>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary"
                onClick={this.userFeedbackPopupHandler.handleCloseModal.bind(this)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserFeedbackPopup;
