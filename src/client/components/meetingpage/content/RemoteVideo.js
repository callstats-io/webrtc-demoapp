'use strict';
import React from 'react';
import Video from './VideoMain';
const CsioEvents = require('../../../apis/csiortc/events/CsioEvents').CsioEvents;

class RemoteVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remoteVideos: {}
    };
    document.addEventListener(CsioEvents.UserEvent.Media.REMOTEMEDIA, this.onRemoteVideos.bind(this), false);
  }
  onRemoteVideos(e) {
    const media = e.detail.media;
    this.setState({
      remoteVideos: media
    });
  };
  render() {
    const remoteVideos = this.state.remoteVideos;
    console.log('->', 'need update', remoteVideos);
    const listItems = Object.entries(remoteVideos).map(([key, value]) =>
      <div className="col-xs-3" key={key}>
        <div align="center" className="embed-responsive embed-responsive-16by9" key={{key}}>
          <Video key={key} name={key}
            stream={value}/>
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
