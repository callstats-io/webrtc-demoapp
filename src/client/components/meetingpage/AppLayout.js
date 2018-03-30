import React from 'react';

import HeaderLayout from './header/HeaderLayout';
import ContentLayout from './content/ContentLayout';

export class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    const roomName = this.props.match.params.roomName;
    window.csioRTC.setRoomName(roomName);
    const mediaConstrain = window.csioRTC.getMediaConstrain();
    if (mediaConstrain !== undefined) {
      window.csioRTC.initializeLocalMedia(mediaConstrain).then(
        (stream) => {
          window.csioRTC.setLocalStream(stream);
          if (roomName !== undefined) {
            window.csioRTC.joinRoom(roomName);
          }
        },
        (err) => {
          console.error(err);
        });
    }
  }
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
