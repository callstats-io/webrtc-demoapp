import React from 'react';

import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';

class HeaderLayout extends React.Component {
  render() {
    return (
      <div className={'header clearfix container'}>
        <HeaderLeft/>
        <HeaderRight/>
      </div>
    );
  }
}

export default HeaderLayout;
