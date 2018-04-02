import React from 'react';

class BrandLeft extends React.Component {
  render() {
    const customStyle = {
      width: '32px',
      height: '32px',
      marginTop: '-15%'
    };
    const navbarHeader = {
    };
    const navbarBrannd = {
    };
    return (
      <div className="navbar-header" style={navbarHeader}>
        <a className="navbar-brand" style={navbarBrannd}>
          <img alt="Brand" src={'/static/images/brand-logo.png'} style={customStyle}/>
        </a>
      </div>
    );
  }
}
export default BrandLeft;
