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
    const cusStyle = {
      backgroundColor: 'red'
    };
    return (
      <div className={'col-xs-4'} style={cusStyle}>
        <div className={'row'}>
              Your name and settings
        </div>
        <div className={'row'}>
          <div className={'col-xs-7'}>
            <div className={'row'}>
              Your name : [input box]
            </div>
            <div className={'row'}>
              Three control buttons
            </div>
          </div>
          <div className={'col-xs-5'}>
            Right Video
          </div>
        </div>
        <div className={'row'}>
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
