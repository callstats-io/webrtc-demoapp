'use strict';

class LoadingHandler {
  constructor() {
    this.display = 'block';
  }
  getState() {
    return {
      display: this.display
    };
  }
  onLoadUserMedia(e) {
    this.setState({
      display: 'none'
    });
  }
}
export default LoadingHandler;
