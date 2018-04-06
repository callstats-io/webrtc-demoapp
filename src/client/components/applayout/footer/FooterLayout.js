import React from 'react';

class FooterLayout extends React.Component {
  render() {
    const customLayout = {
      position: 'absolute',
      bottom: '0',
      backgroundColor: '#f5f5f5',
      width: '100%'
    };
    const ulCustomStyle = {
      listStyleType: 'none',
      marginTop: '5px',
      marginBottom: '5px'
    };
    return (
      <div className={'row'} style={customLayout}>
        <ul className= {'text-center'} style={ulCustomStyle}>
          <li>Brought to you by Callstats.io</li>
          <li><a href="https://www.callstats.io/">www.callstats.io</a></li>
          <li>Made by hand in Finland</li>
        </ul>
      </div>
    );
  }
}

export default FooterLayout;
