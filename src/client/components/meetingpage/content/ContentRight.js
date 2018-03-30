'use strict';
import React from 'react';

import Video from './VideoSmall';
const CsioEvents = require('./../../../apis/events/CsioEvents').CsioEvents;
class ContentRight extends React.Component {
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
    const curStyle = {
      paddingLeft: '3%',
      color: '#442173'
    };
    const glyStyle = {
      fontSize: '22px'
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
                  <input className="form-control" placeholder="Your name"/>
                </div>
              </div>
            </div>
            <div className={'row'} style={{paddingTop: '10%'}}>
              <div className={'col-xs-4'}>
                <span className="glyphicon glyphicon-volume-up" aria-hidden="true" style={glyStyle}></span>
              </div>
              <div className={'col-xs-4'}>
                <span className="glyphicon glyphicon-facetime-video" aria-hidden="true" style={glyStyle}></span>
              </div>
              <div className={'col-xs-4'}>
                <span className="glyphicon glyphicon-eye-open" aria-hidden="true" style={glyStyle}></span>
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
