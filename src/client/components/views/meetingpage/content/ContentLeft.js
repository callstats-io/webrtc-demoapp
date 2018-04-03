'use strict';
import React from 'react';
import Video from './Video';
import RemoteVideos from './RemoteVideos';
import ContentLeftHandler from '../../../handlers/meetingpage/ContentLeftHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class ContentLeft extends React.Component {
  constructor(props) {
    super(props);
    this.contentLeftHandler = new ContentLeftHandler();
    this.state = this.contentLeftHandler.getState();
    document.addEventListener(
      CsioEvents.CsioMediaCtrl.ON_LOCAL_USER_MEDIA,
      this.contentLeftHandler.onLocalVideoStream.bind(this), false);
    document.addEventListener(
      CsioEvents.CsioMediaCtrl.VIDEO_FOCUS_CHANGE,
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
