import React from 'react';
import {Redirect} from 'react-router-dom';
import CreateMetingHandler from '../../../handlers/landingpage/CreateMeetingHandler';

class CreateMeetingLayout extends React.Component {
  constructor(props) {
    super(props);
    this.createMeetingHandler = new CreateMetingHandler();
    this.state = this.createMeetingHandler.getState();
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
                  placeholder="Meeting name"
                  value={this.state.roomName}
                  onChange={this.createMeetingHandler.handleInputChange.bind(this)}/>
              </div>
            </li>
            <li style={liCustomStyle}>
              <button type="button" className={'btn btn-info dropdown-toggle'}
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                disabled={!this.state.createRoomButtonEnabled}
                onClick={this.createMeetingHandler.handleCreateRoomClick.bind(this)}>
              Creating meeting</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default CreateMeetingLayout;
