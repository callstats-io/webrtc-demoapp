import React from 'react';

class CreateMeetingLayout extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeRoomName = this.handleChangeRoomName.bind(this);
    this.handleCreateRoomButtonClick = this.handleCreateRoomButtonClick.bind(this);
    this.state = {
      roomName: '',
      disableButton: true
    };
  }
  handleChangeRoomName(e) {
    const roomName = e.target.value;
    const needDisable = roomName.length < 1;
    this.setState({
      roomName: roomName,
      disableButton: needDisable
    });
  }
  handleCreateRoomButtonClick(e) {
    const roomName = this.state.roomName;
    console.log('room name', roomName);
    this.setState({
      roomName: '',
      disableButton: true
    });
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
                  onChange={this.handleChangeRoomName}/>
              </div>
            </li>
            <li style={liCustomStyle}>
              <button type="button" className={'btn btn-info dropdown-toggle'}
                disabled={this.state.disableButton}
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                onClick={this.handleCreateRoomButtonClick}>
              Creating meeting</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default CreateMeetingLayout;
