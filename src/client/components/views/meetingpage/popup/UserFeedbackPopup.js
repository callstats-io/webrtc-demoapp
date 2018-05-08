'use strict';
import React from 'react';
import UserFeedbackPopupHandler from '../../../handlers/meetingpage/UserFeedbackPopupHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class UserFeedbackPopup extends React.Component {
  constructor(props) {
    super(props);
    this.userFeedbackPopupHandler = new UserFeedbackPopupHandler();
    this.parseRating = this.userFeedbackPopupHandler.parseRating.bind(this);
    this.countRating = this.userFeedbackPopupHandler.countRating.bind(this);

    this.state = this.userFeedbackPopupHandler.getState();
    document.addEventListener(
      CsioEvents.MEETING_PAGE.ON_MEETING_CLOSE_CLICKED,
      this.userFeedbackPopupHandler.onMeetingPageClosed.bind(this),
      false
    );
  }

  render() {
    const overallRating = Object.entries(this.state.meetingFeedback).map(([key, value]) =>
      <li key={`meeting-${key}`}>
        <a href="#"
          id={`userfeedback-meeting-fb-${key}`}
          value={key}
          onClick={this.userFeedbackPopupHandler.onUpdateMeetingFeedback.bind(this, key)}>
          <span className={value} aria-hidden="true"/>
        </a>
      </li>
    );
    const audioRating = Object.entries(this.state.audioFeedback).map(([key, value]) =>
      <li key={`audio-${key}`}>
        <a href="#"
          id={`userfeedback-audio-fb-${key}`}
          value={key}
          onClick={this.userFeedbackPopupHandler.onUpdateAudioFeedback.bind(this, key)}>
          <span className={value} aria-hidden="true"/>
        </a>
      </li>
    );
    const videoRating = Object.entries(this.state.videoFeedback).map(([key, value]) =>
      <li key={`video-${key}`}>
        <a href="#"
          id={`userfeedback-video-fb-${key}`}
          value={key}
          onClick={this.userFeedbackPopupHandler.onUpdateVideoFeedback.bind(this, key)}>
          <span className={value} aria-hidden="true"/>
        </a>
      </li>
    );
    const screenShareRating = Object.entries(this.state.screenshareFeedback).map(([key, value]) =>
      <li key={`screen-${key}`}>
        <a href="#"
          id={`userfeedback-screenshare-fb-${key}`}
          value={key}
          onClick={this.userFeedbackPopupHandler.onUpdateScreenShareFeedback.bind(this, key)}>
          <span className={value} aria-hidden="true"/>
        </a>
      </li>
    );

    return (
      <div className="modal" tabIndex="-1" role="dialog" style={{
        display: this.state.showModal, paddingTop: '2%'}}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title"> <strong>Meeting feedback : </strong></h4>
            </div>
            <div className="modal-body">
              <div className={'row'}>
                <div className={'col-xs-3'}/>
                <div className={'col-xs-3'}>
                  <p> <strong> Overall:  </strong></p>
                </div>
                <div className={'col-xs-3'}>
                  <ul className="list-inline">
                    {overallRating}
                  </ul>
                </div>
                <div className={'col-xs-3'}/>
              </div>
              <div className={'row'}>
                <div className={'col-xs-3'}/>
                <div className={'col-xs-3'}>
                  <p> <strong> Audio:  </strong></p>
                </div>
                <div className={'col-xs-3'}>
                  <ul className="list-inline">
                    {audioRating}
                  </ul>
                </div>
                <div className={'col-xs-3'}/>
              </div>
              <div className={'row'}>
                <div className={'col-xs-3'}/>
                <div className={'col-xs-3'}>
                  <p> <strong> Video:  </strong></p>
                </div>
                <div className={'col-xs-3'}>
                  <ul className="list-inline">
                    {videoRating}
                  </ul>
                </div>
                <div className={'col-xs-3'}/>
              </div>
              <div className={'row'}>
                <div className={'col-xs-3'}/>
                <div className={'col-xs-3'}>
                  <p> <strong> Screen Share:  </strong></p>
                </div>
                <div className={'col-xs-3'}>
                  <ul className="list-inline">
                    {screenShareRating}
                  </ul>
                </div>
                <div className={'col-xs-3'}/>
              </div>
            </div>
            <div className={'row'}>
              <div className={'col-xs-2'}/>
              <div className={'col-xs-8'}>
                <div className="form-group">
                  <textarea className="form-control"
                    id="userfeedback-popup-comment-text"
                    onChange={this.userFeedbackPopupHandler.handleInputChange.bind(this)}
                    placeholder="Please provide your feedback"
                    value={this.state.comments}
                    rows="5"/>
                </div>
              </div>
              <div className={'col-xs-2'}/>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary"
                id="userfeedback-popup-close-btn"
                onClick={this.userFeedbackPopupHandler.handleCloseModal.bind(this)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserFeedbackPopup;
