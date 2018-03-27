import React from 'react';

import HeaderLayout from './HeaderLayout';

export class AppLayout extends React.Component {
  render() {
    return (
      <div className={'container-fluid'}>
        <HeaderLayout/>
      </div>
    );
  }
}

export default AppLayout;
