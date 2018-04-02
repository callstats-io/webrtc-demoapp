import React from 'react';

import CompanyDetails from './CompanyDetails';
import JoinMeeting from './JoinMeeting';

class HeaderLayout extends React.Component {
  render() {
    return (
      <div className={'header clearfix container'}>
        <CompanyDetails/>
        <JoinMeeting/>
      </div>
    );
  }
}

export default HeaderLayout;
