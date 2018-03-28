import React from 'react';

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
            <span className="glyphicon glyphicon-facetime-video" aria-hidden="true" style={glyStyle}></span>
            <br/><span className="glyphicon-class">Easy video calling</span>
          </div>
          <div className={'col-xs-6'} style={divStyle}>
            <span className="glyphicon glyphicon-share" aria-hidden="true" style={glyStyle}></span>
            <br/><span className="glyphicon-class">Share files and media with your friends</span>
          </div>
          <div className={'col-xs-3'} style={divStyle}>
            <span className="glyphicon glyphicon-comment" aria-hidden="true" style={glyStyle}></span>
            <br/><span className="glyphicon-class">Chat with anyone and everyone</span>
          </div>
        </div>
        <div className={'col-xs-2'}>
        </div>
      </div>
    );
  }
}

export default OtherComponentLayout;
