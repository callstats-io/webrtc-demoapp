'use strict';
import React from 'react';
import Video from './VideoMain';
import RemoteVideo from './RemoteVideo';
const CsioEvents = require('../../../apis/csiortc/events/CsioEvents').CsioEvents;

class ContentLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaStream: null
    };
    document.addEventListener(CsioEvents.UserEvent.Media.LOCALMEDIA, this.onLocalVideoStream.bind(this), false);
  }
  onLocalVideoStream(e) {
    const media = e.detail.media;
    this.setState({
      media: media
    });
  }
  render() {
    const cusStyle = {
      paddingRight: '2%',
      borderRight: '1px solid #ccc',
      paddingBottom: '1%'
    };
    const rowStyle = {
      paddingTop: '2%',
      paddingLeft: '2%'
    };

    return (
      <div className={'col-xs-8'} style={cusStyle}>
        <div className={'row'} style={rowStyle}>
          <div className={'row'} style={rowStyle}>
            <Video key={'local'} name={'local'}
              stream={this.state.media}/>
          </div>
        </div>
        <div className={'row'} style={rowStyle}>8 participants in call</div>
        <div className={'row'} style={rowStyle}>
          <RemoteVideo/>
        </div>
      </div>
    );
  }
}

export default ContentLeft;
