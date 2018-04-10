'use strict';

class PrecalltestResultPopupHandler {
  constructor() {
    this.showModal = 'none'; // none or block
  }
  getState() {
    return {
      showModal: this.showModal,
      mediaConnectivity: false,
      rtt: 0,
      fractionalLoss: 0,
      throughput: 0
    };
  }
  showPrecallStats(e) {
    const precallStats = e.detail.precallStats;
    console.warn('->', precallStats);
    this.setState({
      showModal: 'block',
      mediaConnectivity: (precallStats.connectivity) ? 'True' : 'False',
      rtt: (precallStats.rtt || 0).toFixed(2),
      fractionalLoss: (precallStats.fractionalLoss || 0).toFixed(2),
      throughput: (precallStats.throughput || 0).toFixed(2)
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
