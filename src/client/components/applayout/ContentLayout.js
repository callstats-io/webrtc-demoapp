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

class OtherComponentLayout extends React.Component {
  render() {
    const customStyle = {
      backgroundColor: '#FFFFFF',
      paddingTop: '60px'
    };
    const glyStyle = {
      fontSize: '32px'
    };
    const divStyle = {
      display: 'block',
      textAlign: 'center',
      color: '#3D87B1'
    };
    return (
      <div className={'row'} style={customStyle}>
        <div className={'col-xs-2'}>
        </div>
        <div className={'col-xs-8'}>
          <div className={'col-xs-3'} style={divStyle}>
            <span className="glyphicon glyphicon-facetime-video" ariaHidden="true" style={glyStyle}></span>
            <br/><span class="glyphicon-class">Easy video calling</span>
          </div>
          <div className={'col-xs-6'} style={divStyle}>
            <span className="glyphicon glyphicon-share" ariaHidden="true" style={glyStyle}></span>
            <br/><span class="glyphicon-class">Share files and media with your friends</span>
          </div>
          <div className={'col-xs-3'} style={divStyle}>
            <span class="glyphicon glyphicon-comment" aria-hidden="true" style={glyStyle}></span>
            <br/><span class="glyphicon-class">Chat with anyone and everyone</span>
          </div>
        </div>
        <div className={'col-xs-2'}>
        </div>
      </div>
    );
  }
}

class ContentLayout extends React.Component {
  render() {
    return (
      <div className={'container-fluid'}>
        <CreateMeetingLayout/>
        <OtherComponentLayout/>
      </div>
    );
  }
}

export default ContentLayout;
