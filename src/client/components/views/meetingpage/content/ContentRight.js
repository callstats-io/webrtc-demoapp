'use strict';
import React from 'react';
import Video from './Video';
import ChatLayout from './ChatWindow';
import ContentRightHandler from '../../../handlers/meetingpage/ContentRightHandler';
import { CsioEvents } from '../../../../events/CsioEvents';

class ContentRight extends React.Component {
  constructor(props) {
    super(props);
    this.contentRightHandler = new ContentRightHandler();
    this.saveUserName = this.contentRightHandler.saveUserName.bind(this);
    this.checkChromeExtInstalled = this.contentRightHandler.checkChromeExtInstalled.bind(this);
    this.state = this.contentRightHandler.getState();
    document.addEventListener(
      CsioEvents.CsioMediaCtrl.ON_LOCAL_USER_MEDIA,
      this.contentRightHandler.onLocalVideoStream.bind(this),
      false);
    document.addEventListener(
      CsioEvents.MEETING_PAGE.ON_TOGGLE_MEDIA_STATE,
      this.contentRightHandler.onToggleMediaState.bind(this),
      false);
    window.addEventListener('resize',
      this.contentRightHandler.onResizeWindow.bind(this), false);
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
      <div className={'col-xs-4'} style={curStyle} ref={(el) => { this.rightContainer = el; } }>
        <div className={'row'} style={rowStyle}>
            You name and settings
        </div>
        <div className={'row'} style={rowStyle}>
          <div className={'col-xs-7'}>
            <div className={'row'}>
              <a href='#' style={{color: '#442173'}} title="click to enter a name"
                onClick={this.contentRightHandler.onClickUserName.bind(this)}>
                <div className={'col-xs-4'} style={{padding: '0px', paddingTop: '3%'}}>
                Your name
                </div>
              </a>
              <div className={'col-xs-8'} style={{padding: '0px'}}>
                <div className="input-group">
                  <input className="form-control"
                    disabled={this.state.userNameInput}
                    value={this.state.userName}
                    onChange={this.contentRightHandler.handleInputChange.bind(this)}
                    placeholder="Your name"
                    onKeyUp={this.contentRightHandler.onKeyUp.bind(this)}/>
                </div>
              </div>
            </div>
            <div className={'row'} style={{paddingTop: '10%'}}>
              <div className={'col-xs-3'}>
                <a href='#' onClick={this.contentRightHandler.onAudioToggle.bind(this)}>
                  <span className={'glyphicon glyphicon-volume-up'} aria-hidden="true" style={{
                    fontSize: '22px',
                    color: this.state.audioMuted ? '#808080' : '#442173'
                  }}></span>
                </a>
              </div>
              <div className={'col-xs-3'}>
                <a href='#' onClick={this.contentRightHandler.onVideoToggle.bind(this)}>
                  <span className="glyphicon glyphicon-facetime-video" aria-hidden="true" style={{
                    fontSize: '22px',
                    color: this.state.videoMuted ? '#808080' : '#442173'
                  }}></span>
                </a>
              </div>
              <div className={'col-xs-3'}>
                <a href='#' onClick={this.contentRightHandler.onScreenShareToggle.bind(this)}>
                  <span className="glyphicon glyphicon-eye-open" aria-hidden="true" style={{
                    fontSize: '22px',
                    color: this.state.screenShared ? '#442173' : '#808080'
                  }}></span>
                </a>
              </div>
              <div className={'col-xs-3'}>
                <a href="#" style={{color: '#FFFFFF', background: 'inherit'}}
                  onClick={this.contentRightHandler.onClickCloseButton.bind(this)}>
                  <img alt="Hangup" src={'/static/images/hangup.png'}/>
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
        <div className={'row'} style={{paddingTop: '5%'}}>
          <hr />
        </div>
        <div className={'row'}>
          <ChatLayout/>
        </div>
      </div>
    );
  }
}

export default ContentRight;
