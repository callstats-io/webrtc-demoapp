/**
 * Create meeting layout for demo application
 * All application logic for demo application is handled by CreateMeetingHandler
 * Once user give a username the react router redirect the user to conference page
 */
'use strict';
import React from 'react';
import {Redirect} from 'react-router-dom';
import CreateMetingHandler from '../../../handlers/landingpage/CreateMeetingHandler';

class CreateMeetingLayout extends React.Component {
  constructor(props) {
    super(props);
    this.joinMeetingHandler = new CreateMetingHandler();
    this.state = this.joinMeetingHandler.getState();
  }
  render() {
    const customStyle = {
      backgroundColor: '#442173'
    };
    const customLi = {
      fontSize: '32px'
    };
    const ulCustomStyle = {
      listStyleType: 'none',
      color: '#FFFFFF'
    };
    const liCustomStyle = {
      paddingBottom: '5%'
    };
    const shouldRedirectToMeetingPage = this.state.shouldRedirectToMeetingPage;
    if (shouldRedirectToMeetingPage) {
      const roomName = `/${this.state.roomName}`;
      return <Redirect push to={roomName}/>;
    }
    return (
      <div className={'row'} style={customStyle}>
        <div className={'col-xs-2'}></div>
        <div className={'col-xs-2'} style={{paddingTop: '3%'}}>
          <ul style={ulCustomStyle}>
            <li style={customLi}>Bonjour</li>
            <li>No hassle, just people</li>
          </ul>
        </div>
        <div className={'col-xs-3'}></div>
        <div className={'col-xs-5'} style={{paddingTop: '2%'}}>
          <ul style={ulCustomStyle}>
            <li style={liCustomStyle}>Create your meeting by giving it a name</li>
            <li style={liCustomStyle}>
              <div className="input-group">
                <input className="form-control"
                  id="join-meeting-name-input"
                  placeholder="Meeting name"
                  value={this.state.roomName}
                  onChange={this.joinMeetingHandler.handleInputChange.bind(this)}
                  onKeyUp={this.joinMeetingHandler.onKeyUp.bind(this)}/>
              </div>
            </li>
            <li style={liCustomStyle}>
              <button type="button" className={'btn btn-info dropdown-toggle'}
                id="join-meeting-btn"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                disabled={!this.state.createRoomButtonEnabled}
                onClick={this.joinMeetingHandler.handleCreateRoomClick.bind(this)}>
              Creating meeting</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default CreateMeetingLayout;
