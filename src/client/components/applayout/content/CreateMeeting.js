import React from 'react';

class CreateMeetingLayout extends React.Component {
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
                <input className="form-control" placeholder="Meeting name"/>
              </div>
            </li>
            <li style={liCustomStyle}>
              <button type="button" className="btn btn-info dropdown-toggle"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Creating meeting</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default CreateMeetingLayout;
