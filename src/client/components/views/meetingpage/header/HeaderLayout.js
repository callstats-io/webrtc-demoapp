import React from 'react';

import BrandLeft from './BrandLeft';
import HeaderRight from './HeaderRight';
import HeaderLeft from './HeaderLeft';
class HeaderLayout extends React.Component {
  render() {
    return (
      <nav className="navbar" style={{backgroundColor: '#442173', marginBottom: '0px'}}>
        <div className="container-fluid">
          <BrandLeft/>
          <div id="navbar" className="navbar-collapse collapse">
            <HeaderLeft/>
            <HeaderRight/>
          </div>
        </div>
      </nav>
    );
  }
}

export default HeaderLayout;
