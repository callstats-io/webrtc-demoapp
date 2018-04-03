// A video element class taken from
// https://github.com/facebook/react/pull/9146
'use strict';
import React from 'react';
import VideoMainHandler from '../../../handlers/meetingpage/VideoMainHandler';
import {CsioEvents} from '../../../../events/CsioEvents';
class VideoMain extends React.Component {
  constructor(props) {
    super(props);
    this.videoHandler = new VideoMainHandler(this.props.name);
    this.state = this.videoHandler.getState();
    this.componentDidMount = this.videoHandler.componentDidMount.bind(this);
    this.componentDidUpdate = this.videoHandler.componentDidUpdate.bind(this);
    document.addEventListener(
      CsioEvents.MEETING_PAGE.RESIZE_VIDEO_VIEW,
      this.videoHandler.onResizeVideoView.bind(this), false);
  }

  render() {
    const customStyle = {
      objectFit: 'fill',
      width: '90%',
      paddingRight: '5%',
      maxHeight: `${this.state.videoHeight}px`
    };
    return (
      <video id={this.videoHandler.name}
        muted={this.videoHandler.muted}
        autoPlay loop
        style={customStyle}
        ref={(video) => {
          this.video = video;
        }}>
      </video>
    );
  }
}

export default VideoMain;
