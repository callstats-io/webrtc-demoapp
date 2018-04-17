'use strict';

class CreateMeetingHandler {
  constructor() {
    this.roomName = '';
    this.createRoomButtonEnabled = false;
    this.shouldRedirectToMeetingPage = false;
  }
  getState() {
    return {
      roomName: this.roomName,
      createRoomButtonEnabled: this.createRoomButtonEnabled,
      shouldRedirectToMeetingPage: this.shouldRedirectToMeetingPage
    };
  }
  handleInputChange(e) {
    const roomName = e.target.value;
    const needEnable = roomName.length > 0;
    this.setState({
      roomName: roomName,
      createRoomButtonEnabled: needEnable
    });
  }
  onKeyUp(e) {
    if (e.key === 'Enter') {
      this.setState({
        shouldRedirectToMeetingPage: true
      });
    }
  }
  handleCreateRoomClick(e) {
    this.setState({
      shouldRedirectToMeetingPage: true
    });
  }
}

export default CreateMeetingHandler;
