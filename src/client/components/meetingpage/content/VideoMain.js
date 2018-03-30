// A video element class taken from
// https://github.com/facebook/react/pull/9146

'use strict';
import React from 'react';

class VideoMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.muted = false;
    if (this.props.name === 'local') {
      this.muted = true;
    }
  }
  componentDidMount() {
    console.log('component did mount', this.props.name);
    this.video.srcObject = this.props.stream;
  }
  shouldComponentUpdate(props) {
    console.log('component should update',
      this.props.name, this.props.stream !== props.stream);
    return this.props.stream !== props.stream;
  }
  componentDidUpdate() {
    console.log('component did update', this.props.name);
    this.video.srcObject = this.props.stream;
  }
  render() {
    const videoStyle = {
      marginRight: 'auto',
      display: 'block',
      maxWidth: '640px',
      maxHeight: '480px'
    };
    return (
      <video id={this.props.name} muted={this.muted} className="thumbnail" autoPlay loop style={videoStyle}
        ref={(video) => {
          this.video = video;
        }}>
      </video>
    );
  }
}

export default VideoMain;
