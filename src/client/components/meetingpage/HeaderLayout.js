import React from 'react';

class BrandLRight extends React.Component {
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
        <a className="navbar-brand" href="#" style={navbarBrannd}>
          <img alt="Brand" src={'/static/images/brand-logo.png'} style={customStyle}/>
        </a>
      </div>
    );
  }
}
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
class HeaderLayout extends React.Component {
  render() {
    return (
      <nav className="navbar" style={{backgroundColor: '#442173', marginBottom: '0px'}}>
        <div className="container-fluid">
          <BrandLRight/>
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
