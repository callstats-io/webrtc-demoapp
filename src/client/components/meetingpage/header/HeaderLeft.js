'use strict';

import React from 'react';

class HeaderLeft extends React.Component {
  render() {
    return (
      <ul className="nav navbar-nav">
        <li><a href="#" style={{fontSize: '35px', color: '#FFFFFF', background: 'inherit'}}>Bonjour</a></li>
        <li><a href="#" style={{color: '#FFFFFF', background: 'inherit'}}>Maria’s meeting</a></li>
      </ul>
    );
  }
}

export default HeaderLeft;
