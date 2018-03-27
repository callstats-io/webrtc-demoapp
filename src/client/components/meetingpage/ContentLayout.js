import React from 'react';

class LayoutLeft extends React.Component {
  render() {
    const cusStyle = {
      backgroundColor: 'black'
    };
    return (
      <div className={'col-xs-8'} style={cusStyle}>
          She
      </div>
    );
  }
}
class LayoutRight extends React.Component {
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
            <div align="center" class="embed-responsive embed-responsive-16by9">
              <video autoplay loop class="embed-responsive-item">
                <source src="http://techslides.com/demos/sample-videos/small.mp4" type="video/mp4"/>
              </video>
            </div>
          </div>
        </div>
        <div className={'row'} style={{paddingTop: '10%'}}>
          <hr />
        </div>
      </div>
    );
  }
}
class ContentLayout extends React.Component {
  render() {
    return (
      <div className={'container-fluid'}>
        <div className={'row'}>
          <LayoutLeft/>
          <LayoutRight/>
        </div>
      </div>
    );
  }
}

export default ContentLayout;
