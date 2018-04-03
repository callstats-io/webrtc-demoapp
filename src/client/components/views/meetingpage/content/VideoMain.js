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
    this.shouldComponentUpdate = this.videoHandler.shouldComponentUpdate.bind(this);
    this.componentDidUpdate = this.videoHandler.componentDidUpdate.bind(this);
    document.addEventListener(
      CsioEvents.MEETING_PAGE.RESIZE_VIDEO_VIEW,
      this.videoHandler.onResizeVideoView.bind(this), false);
  }

  render() {
    const customStyle = {
      marginRight: 'auto',
      marginLeft: 'auto',
      display: 'block',
      width: `${this.state.videoWidth}px`,
      height: `${this.state.videoHeight}px`,
      WebkitTransform: `scaleX(${this.state.scale})`,
      MozTransform: 'scaleX(1.5)'

    };
    return (
      <a href='#' onClick={this.videoHandler.onClickHandler.bind(this)}>
        <video id={this.videoHandler.name}
          muted={this.videoHandler.muted}
          className="thumbnail"
          autoPlay loop
          style={customStyle}
          ref={(video) => {
            this.video = video;
          }}>
        </video>
      </a>
    );
  }
}

export default VideoMain;
