import React from 'react';

import LayoutLeft from './ContentLeft';
import LayoutRight from './ContentRight';

class ContentLayout extends React.Component {
  render() {
    return (
      <div className={'container-fluid'}>
        <div className={'row'}>
          <LayoutLeft/>
          <LayoutRight/>
        </div>
      </div>
    );
  }
}

export default ContentLayout;
