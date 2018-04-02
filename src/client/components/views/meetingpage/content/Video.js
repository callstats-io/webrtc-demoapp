// A video element class taken from
// https://github.com/facebook/react/pull/9146
'use strict';
import React from 'react';
import VideoHandler from '../../../handlers/meetingpage/VideoHandler';
class Video extends React.Component {
  constructor(props) {
    super(props);
    this.videoHandler = new VideoHandler(this.props.name);
    this.state = this.videoHandler.getState();
    this.componentDidMount = this.videoHandler.componentDidMount.bind(this);
    this.shouldComponentUpdate = this.videoHandler.shouldComponentUpdate.bind(this);
    this.componentDidUpdate = this.videoHandler.componentDidUpdate.bind(this);
  }

  render() {
    const videoStyle = {
      marginRight: 'auto',
      marginLeft: 'auto',
      display: 'block',
      maxWidth: '640px',
      maxHeight: '340px',
      WebkitTransform: 'scaleX(1.5)',
      MozTransform: 'scaleX(1.5)'
    };
    return (
      <a href='#' onClick={this.videoHandler.onClickHandler.bind(this)}>
        <video id={this.videoHandler.name}
          muted={this.videoHandler.muted}
          className="thumbnail"
          autoPlay loop
          style={videoStyle}
          ref={(video) => {
            this.video = video;
          }}>
        </video>
      </a>
    );
  }
}

export default Video;
