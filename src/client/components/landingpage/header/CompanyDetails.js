import React from 'react';

class CompanyDetails extends React.Component {
  render() {
    const customStyle = {
      maxHeight: '60px'
    };
    return (
      <a className={'pull-left'}><img src={'/static/images/logo.png'} style={customStyle}/></a>
    );
  }
}

export default CompanyDetails;
