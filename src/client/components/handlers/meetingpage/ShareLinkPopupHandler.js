'use strict';

class ShareLinkPopupHandler {
  constructor() {
    this.showModal = 'none'; // none or block
    this.meetingRoomURL = ''; // none or block
  }
  getState() {
    return {
      showModal: this.showModal,
      meetingRoomURL: this.meetingRoomURL
    };
  }
  onShareButtonClick(e) {
    const meetingRoomURL = e.detail.meetingRoomURL;
    this.setState({
      meetingRoomURL: meetingRoomURL,
      showModal: 'block'
    });
  }
  handleCloseModal(e) {
    this.setState({
      showModal: 'none',
      meetingRoomURL: ''
    });
  }
}

export default ShareLinkPopupHandler;
