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
      padding: '0px',
      WebkitTransform: 'scaleX(1.5)',
      MozTransform: 'scaleX(1.5)'
    };
    const mirrorStyle = {
      padding: '0px',
      WebkitTransform: 'scaleX(1.5)',
      MozTransform: 'scaleX(1.5)',
      transform: 'rotateY(180deg)',
      webkitTransform: 'rotateY(180deg)',
      mozTransform: 'rotateY(180deg)'
    };
    return (
      <a href='#' onClick={this.videoHandler.onClickHandler.bind(this)} title={this.props.name}>
        <video id={this.videoHandler.name}
          muted={this.state.muted}
          className="thumbnail"
          autoPlay loop
          style={this.videoHandler.name === 'local' ? mirrorStyle : videoStyle}
          ref={(video) => {
            this.video = video;
          }}>
        </video>
      </a>
    );
  }
}

export default Video;
