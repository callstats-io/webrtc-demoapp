### Callstats.io WebRTC demo application API ###

##### API Libraries #####

This library abstracts the whole process of signaling and WebRTC. A call can be started and left easily, and events inform about what is happening.

```
    csiostats   - callstats wrapper
    rtc         - webrtc wrapper
    signaling   - socket.po wrapper
    utils       - utility class
```

### Usage ###

To initialize global state handler the application imports this library in ```index.js``` file.

``` import {} from './apis/CsioRTCClient'; ```

### Functions ###
All the functions are event based. They executes based on event

### Events ###
All events fired in a json format. Sample event object  -

``` 
const newEvent = new CustomEvent(name, {'detail': detail}); 
```

And to get details from an event binder -
``` 
const detail = e.detail
```
    
- ### UI ###
        -     ON_MEETING_PAGE_LOADED: 'meetingpage.onmeetingpageloaded',
              ON_SHARE_MEETING_LINK: 'meetingpage.onsharemeetinglink',
              ON_MEETING_CLOSE_CLICKED: 'meetingpage.onmeetingcloseclicked',
              ON_TOGGLE_MEDIA_STATE: 'meetingpage.ontogglemediastate',
              VIDEO_FOCUS_CHANGE: 'meetingpage.videoFocusChanged',
              RESIZE_VIDEO_VIEW: 'meetingpage.resizevideoview',
              ON_FEEDBACK_PROVIDED: 'meetingpage.onfeedbackprovided'
              ON_SCREEN_SHARE_OPTION_SELECTED: 'ffscreenshare.onscreenshareoptionselected'
              ON_JOIN_MEETING_ROOM_LINK_CLICK: 'landingpage.onjoinmeetingroomlinkclick'
- #### WebRTC ####
        -      ON_PEERCONNECTION_CREATED: 'csiopeerconnection.onpeerconnectioncreated',
               ON_PEERCONNECTION_CLOSED: 'csiopeerconnection.onPeerConnectionClosed',
               ON_WEBRTC_ERROR: 'csiopeerconnection.onWebrtcError',
               ON_REMOTE_STREAM: 'csiopeerconnection.onRemoteStream',
               ON_WERTC_ERROR: 'csiopeerconnection.webrtcError',
               SEND_MESSAGE: 'csiopeerconnection.sendMessage',
               SEND_CHANNEL_MESSAGE: 'csiopeerconnection.sendChannelMessage',
               ON_CHANNEL_MESSAGE: 'csiopeerconnection.onChannelMessage',
               ON_APPLICATION_LOG: 'csiopeerconnection.applicationLogEvent',
               ON_ICE_FAILED: 'csiopeerconnection.onicefailed'  
- #### Signaling ####
        -      CONNECT: 'connect',
               JOIN: 'join',
               LEAVE: 'leave',
               MESSAGE: 'message',
               GENERATE_TOKEN: 'generateToken'  
