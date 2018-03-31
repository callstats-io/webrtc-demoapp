'use strict';
import React from 'react';
import Video from './Video';
import RemoteVideosHandler from './../../../apis/meetingpage/RemoteVideosHandler';
const CsioEvents = require('../../../apis/csiortc/events/CsioEvents').CsioEvents;

class RemoteVideo extends React.Component {
  constructor(props) {
    super(props);
    this.remoteVideoHandler = new RemoteVideosHandler();
    this.state = this.remoteVideoHandler.getState();
    document.addEventListener(
      CsioEvents.UserEvent.Media.REMOTEMEDIA,
      this.remoteVideoHandler.onRemoteVideos.bind(this),
      false);
  }
  render() {
    const remoteVideos = this.state.remoteVideos;
    const listItems = Object.entries(remoteVideos).map(([key, value]) =>
      <div className="col-xs-3" key={key}>
        <div align="center" className="embed-responsive embed-responsive-16by9" key={{key}}>
          <Video key={key} name={key} stream={value}/>
        </div>
      </div>
    );
    return (
      <div className="row">
        {listItems}
      </div>
    );
  }
}

export default RemoteVideo;
