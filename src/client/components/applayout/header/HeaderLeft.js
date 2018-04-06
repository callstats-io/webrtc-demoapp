import React from 'react';

class HeaderLeft extends React.Component {
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
export default HeaderLeft;
