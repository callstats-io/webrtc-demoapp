import React from 'react';
import LoadingHandler from '../../../handlers/meetingpage/LoadingHandler';
import { CsioEvents } from '../../../../events/CsioEvents';

// we will not show alert now. Instead we will direct all alert to data channel message
// except chrome extension link
class LoadingLayout extends React.Component {
  constructor(props) {
    super(props);
    this.loadingHandler = new LoadingHandler();
    this.state = this.loadingHandler.getState();
    document.addEventListener(CsioEvents.CsioMediaCtrl.ON_LOCAL_USER_MEDIA,
      this.loadingHandler.onLoadUserMedia.bind(this),false);
  }
  render() {
    return (
      <div className={'container-fluid'} style={{ display: this.state.display, padding: '0px', position: 'absolute', zIndex: 999, left: '40%', top: '40%' }}>
        <img alt="Brand" src={'/static/images/loading.gif'}/>
      </div>
    );
  }
}

export default LoadingLayout;
