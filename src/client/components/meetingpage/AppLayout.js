import React from 'react';

import HeaderLayout from './HeaderLayout';
import ContentLayout from './ContentLayout';

export class AppLayout extends React.Component {
  render() {
    return (
      <div className={'container-fluid'}>
        <HeaderLayout/>
        <ContentLayout/>
      </div>
    );
  }
}

export default AppLayout;
