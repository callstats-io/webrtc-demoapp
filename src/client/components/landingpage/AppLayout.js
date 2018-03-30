import React from 'react';

import HeaderLayout from './header/HeaderLayour';
import FooterLayout from './footer/FooterLayout';
import ContentLayout from './content/ContentLayout';
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
