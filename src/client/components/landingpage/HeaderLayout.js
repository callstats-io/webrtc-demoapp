import React from 'react';

class HeaderLeft extends React.Component {
  render() {
    const customStyle = {
      maxHeight: '60px'
    };
    return (
      <a className={'pull-left'}><img src={'/static/images/logo.png'} style={customStyle}/></a>
    );
  }
}

class HeaderRight extends React.Component {
  render() {
    const customeStyle = {
      textDecoration: 'none',
      background: 'inherit'
    };
    return (
      <nav>
        <ul className={'nav nav-pills pull-right'}>
          <li role={'presentation'}>
            <a href="#" className={'btn btn-link'} style={customeStyle}>Join a meeting</a></li>
        </ul>
      </nav>
    );
  }
}
class HeaderLayout extends React.Component {
  render() {
    return (
      <div className={'header clearfix container'}>
        <HeaderRight/>
        <HeaderLeft/>
      </div>
    );
  }
}

export default HeaderLayout;
