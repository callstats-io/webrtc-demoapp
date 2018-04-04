'use strict';

class AlertHandler {
  constructor() {
    this.display = 'none';
    this.text = '';
    this.alertType = 'alert-success';
    this.fadein = 'in';
    this.alartSuccess = 'alert-success';
    this.alertInfo = 'alert-info';
    this.alertWarning = 'alert-warning';
    this.alertDanger = 'alert-danger';
  }

  getState() {
    return {
      alertType: this.alertType,
      text: this.text,
      display: this.display,
      fadein: this.fadein
    };
  }
  showAlart(alertType, text) {
    this.setState({
      alertType: alertType,
      text: text,
      display: 'block',
      fadein: 'in'
    });

    setTimeout(function() {
      this.setState({
        fadein: 'fade'
      });
      setTimeout(function() {
        this.setState({
          display: 'none'
        });
      }.bind(this), 500);
    }.bind(this), 1000);
  }
  onNewUserJoined(e) {
    const userId = e.detail.userId;
    const text = `${userId} joined the meeting`;
    this.showAlart('alert-info', text);
  }
  onUserLeave(e) {
    const userId = e.detail.userId;
    const text = `${userId} left the meeting`;
    this.showAlart('alert-warning', text);
  }
}
export default AlertHandler;
