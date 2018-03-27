import React from 'react';

import HeaderLayout from './HeaderLayout';
import FooterLayout from './FooterLayout';
import ContentLayout from './ContentLayout';
export class AppLayout extends React.Component {
  render() {
    return (
      <div className={'container-fluid'}>
        <HeaderLayout/>
        <ContentLayout/>
        <FooterLayout/>
      </div>
    );
  }
}

export default AppLayout;
