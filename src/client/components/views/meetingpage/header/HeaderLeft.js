'use strict';

import React from 'react';

class HeaderLeft extends React.Component {
  render() {
    return (
      <ul className="nav navbar-nav">
        <li><a style={{fontSize: '35px', color: '#FFFFFF', background: 'inherit'}}>Bonjour</a></li>
        <li><a style={{color: '#FFFFFF', background: 'inherit'}}>Meeting room: {this.props.roomName}</a></li>
      </ul>
    );
  }
}

export default HeaderLeft;
