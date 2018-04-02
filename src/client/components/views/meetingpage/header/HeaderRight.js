'use strict';

import React from 'react';
import HeaderRightHandler from '../../../handlers/meetingpage/HeaderRightHandler';

class HeaderRight extends React.Component {
  constructor(props) {
    super(props);
    this.headerRightHandler = new HeaderRightHandler();
    this.state = this.headerRightHandler.getState();
  }
  render() {
    return (
      <ul className="nav navbar-nav navbar-right">
        <li><a href="#" style={{color: '#FFFFFF', background: 'inherit'}}
          onClick={this.headerRightHandler.onClickShareButton.bind(this)}>
          <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
        </a></li>
        <li><a href="#" style={{color: '#FFFFFF', background: 'inherit'}}
          onClick={this.headerRightHandler.onClickCloseButton.bind(this)}>
          <span className="glyphicon glyphicon-off" aria-hidden="true"></span>
        </a></li>
      </ul>
    );
  }
}

export default HeaderRight;
