'use strict';
import React from 'react';
import Video from './Video';
import RemoteVideosHandler from '../../../handlers/meetingpage/RemoteVideosHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class RemoteVideo extends React.Component {
  constructor(props) {
    super(props);
    this.remoteVideosHandler = new RemoteVideosHandler();
    this.state = this.remoteVideosHandler.getState();
    document.addEventListener(
      CsioEvents.CsioMediaCtrl.ON_ADD_REMOVE_REMOTESTREAM,
      this.remoteVideosHandler.onRemoteVideos.bind(this),
      false);
  }
  render() {
    const rowStyle = {
      paddingTop: '2%',
      paddingLeft: '2%',
      color: '#442173'
    };
    const remoteVideos = this.state.remoteVideos;
    const listItems = Object.entries(remoteVideos).map(([key, value]) =>
      <div className="col-xs-3" key={key}>
        <div align="center" className="embed-responsive embed-responsive-16by9" key={{key}}>
          <Video key={key} name={key} stream={value}/>
        </div>
      </div>
    );
    let participants = this.state.participantCount < 1
      ? '' : `${this.state.participantCount} 
      participant${this.state.participantCount > 1 ? 's' : ''} in call`;
    return (
      <div>
        <div className={'row'} style={rowStyle}>{participants}</div>
        <div className={'row'} style={rowStyle}>
          <div className="row">
            {listItems}
          </div>
        </div>
      </div>
    );
  }
}

export default RemoteVideo;
