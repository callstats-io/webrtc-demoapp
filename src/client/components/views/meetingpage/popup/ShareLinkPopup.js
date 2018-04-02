'use strict';
import React from 'react';
import ShareLinkPopupHandler from '../../../handlers/meetingpage/ShareLinkPopupHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class ShareLinkPopup extends React.Component {
  constructor(props) {
    super(props);
    this.shareLinkPopupHandler = new ShareLinkPopupHandler();
    this.state = this.shareLinkPopupHandler.getState();
    document.addEventListener(
      CsioEvents.MEETING_PAGE.ON_SHARE_MEETING_LINK,
      this.shareLinkPopupHandler.onShareButtonClick.bind(this),
      false);
  }

  render() {
    const customStyle = {
      paddingTop: '5%',
      paddingBottom: '8%'
    };
    return (
      <div className="modal" tabIndex="-1" role="dialog" style={{
        display: this.state.showModal, paddingTop: '2%'}}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="input-group col-lg-offset-4"
                style={customStyle}>
                <a href={this.state.meetingRoomURL} target="_blank">{this.state.meetingRoomURL}</a>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button"
                className="btn btn-primary"
                onClick={this.shareLinkPopupHandler.handleCloseModal.bind(this)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShareLinkPopup;
