import React from 'react';

import HeaderLayout from './header/HeaderLayout';
import FooterLayout from './footer/FooterLayout';
import ContentLayout from './content/ContentLayout';
import JoinRoomPopup from './popup/JoinRoom';
export class AppLayout extends React.Component {
  render() {
    return (
      <div className={'container-fluid'}>
        <HeaderLayout/>
        <ContentLayout/>
        <FooterLayout/>
        <JoinRoomPopup/>
      </div>
    );
  }
}

export default AppLayout;
