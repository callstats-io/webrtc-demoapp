'use strict';
import React from 'react';
import Video from './Video';
import ContentRightHandler from './../../../apis/meetingpage/ContentRightHandler';
const CsioEvents = require('../../../apis/csiortc/events/CsioEvents').CsioEvents;
class ContentRight extends React.Component {
  constructor(props) {
    super(props);
    this.contentRightHandler = new ContentRightHandler();
    this.state = this.contentRightHandler.getState();
    document.addEventListener(
      CsioEvents.UserEvent.Media.LOCALMEDIA,
      this.contentRightHandler.onLocalVideoStream.bind(this),
      false);
  }
  render() {
    const curStyle = {
      paddingLeft: '3%',
      color: '#442173'
    };
    const rowStyle = {
      paddingTop: '5%'
    };
    return (
      <div className={'col-xs-4'} style={curStyle}>
        <div className={'row'} style={rowStyle}>
          You name and settings
        </div>
        <div className={'row'} style={rowStyle}>
          <div className={'col-xs-7'}>
            <div className={'row'}>
              <div className={'col-xs-4'} style={{padding: '0px'}}>
                Your name
              </div>
              <div className={'col-xs-8'} style={{padding: '0px'}}>
                <div className="input-group">
                  <input className="form-control"
                    value={this.state.userName}
                    onChange={this.contentRightHandler.handleInputChange.bind(this)}
                    placeholder="Your name"/>
                </div>
              </div>
            </div>
            <div className={'row'} style={{paddingTop: '10%'}}>
              <div className={'col-xs-4'}>
                <a href='#' onClick={this.contentRightHandler.onAudioToggle.bind(this)}>
                  <span className={'glyphicon glyphicon-volume-up'} aria-hidden="true" style={{
                    fontSize: '22px',
                    color: this.state.audioMuted ? '#808080' : '#442173'
                  }}></span>
                </a>
              </div>
              <div className={'col-xs-4'}>
                <a href='#' onClick={this.contentRightHandler.onVideoToggle.bind(this)}>
                  <span className="glyphicon glyphicon-facetime-video" aria-hidden="true" style={{
                    fontSize: '22px',
                    color: this.state.videoMuted ? '#808080' : '#442173'
                  }}></span>
                </a>
              </div>
              <div className={'col-xs-4'}>
                <a href='#' onClick={this.contentRightHandler.onScreenShareToggle.bind(this)}>
                  <span className="glyphicon glyphicon-eye-open" aria-hidden="true" style={{
                    fontSize: '22px',
                    color: this.state.screenShared ? '#442173' : '#808080'
                  }}></span>
                </a>
              </div>
            </div>
          </div>
          <div className={'col-xs-5'}>
            <div align="center" className="embed-responsive embed-responsive-16by9">
              <Video key={'local'} name={'local'}
                stream={this.state.media}/>
            </div>
          </div>
        </div>
        <div className={'row'} style={{paddingTop: '10%'}}>
          <hr />
        </div>
        <div className={'row'}>
          Chat will go here
        </div>
      </div>
    );
  }
}

export default ContentRight;
