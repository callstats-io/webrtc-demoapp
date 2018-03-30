'use strict';

import React from 'react';

class HeaderRight extends React.Component {
  render() {
    return (
      <ul className="nav navbar-nav navbar-right">
        <li><a href="#" style={{color: '#FFFFFF', background: 'inherit'}}>
          <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
        </a></li>
        <li><a href="#" style={{color: '#FFFFFF', background: 'inherit'}}>
          <span className="glyphicon glyphicon-off" aria-hidden="true"></span>
        </a></li>
      </ul>
    );
  }
}

export default HeaderRight;
