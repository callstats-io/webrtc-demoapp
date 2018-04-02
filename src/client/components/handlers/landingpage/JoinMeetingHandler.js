'use strict';

class JoinMeetingHandler {
  constructor() {
    this.roomName = '';
    this.joinRoomButtonEnabled = false;
    this.showModal = 'none'; // none or block
    this.shouldRedirectToMeetingPage = false;
  }
  getState() {
    return {
      roomName: this.roomName,
      joinRoomButtonEnabled: this.joinRoomButtonEnabled,
      showModal: this.showModal,
      shouldRedirectToMeetingPage: this.shouldRedirectToMeetingPage
    };
  }
  onJoinRoomClick(e) {
    this.setState({
      showModal: 'block'
    });
  }
  handleInputChange(e) {
    const roomName = e.target.value;
    const needEnable = roomName.length > 0;
    this.setState({
      roomName: roomName,
      joinRoomButtonEnabled: needEnable
    });
  }
  handleJoinMeeting(e) {
    this.setState({
      showModal: 'none',
      shouldRedirectToMeetingPage: true
    });
  }
  handleCloseModal(e) {
    this.setState({
      showModal: 'none',
      shouldRedirectToMeetingPage: false
    });
  }
}

export default JoinMeetingHandler;
