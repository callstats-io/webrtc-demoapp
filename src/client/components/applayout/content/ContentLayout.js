import React from 'react';

import CreateMeetingLayout from './CreateMeeting';
import OtherComponentLayout from './Others';

class ContentLayout extends React.Component {
  render() {
    return (
      <div className={'container-fluid'}>
        <CreateMeetingLayout/>
        <OtherComponentLayout/>
      </div>
    );
  }
}

export default ContentLayout;
