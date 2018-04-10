'use strict';

class PrecalltestResultPopupHandler {
  constructor() {
    this.showModal = 'none'; // none or block
  }
  getState() {
    return {
      showModal: this.showModal
    };
  }
  showPrecallStats(e) {
    this.precallStats = e.detail.precallStats;
    console.log('->', this.precallStats);
    this.setState({
      showModal: 'block'
    });
  }
  handleCloseModal(e) {
    e.preventDefault();
    this.setState({
      showModal: 'none'
    });
  }
}

export default PrecalltestResultPopupHandler;
