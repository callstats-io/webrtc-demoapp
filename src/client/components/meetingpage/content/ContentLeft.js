'use strict';
import React from 'react';
import Video from './Video';
import RemoteVideos from './RemoteVideos';
import ContentLeftHandler from './../../../apis/meetingpage/ContentLeftHandler';
const CsioEvents = require('../../../apis/csiortc/events/CsioEvents').CsioEvents;

class ContentLeft extends React.Component {
  constructor(props) {
    super(props);
    this.contentLeftHandler = new ContentLeftHandler();
    this.state = this.contentLeftHandler.getState();
    document.addEventListener(
      CsioEvents.UserEvent.Media.LOCALMEDIA,
      this.contentLeftHandler.onLocalVideoStream.bind(this), false);
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
        <RemoteVideos/>
      </div>
    );
  }
}

export default ContentLeft;
