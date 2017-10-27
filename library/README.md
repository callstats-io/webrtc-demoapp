# WebRTC-DemoApp library
This library abstracts the whole process of signaling and WebRTC.
A call can be started and left easily, and events inform about what is happening.

### Requirement:
  ```window.localStream``` - has to be set to the local media (e.g. with getUserMedia API)

### Usage
#### Create
  * ```var lib = new CsioWebrtcApp()```
  * optional parameter: array of datachannel labels
  
#### Functions
  * ```call(room)``` - initiate the call to a room (room from UI) (room is also conferenceId for cs.js).
                       All users in a room communicate with each other.
  * ```hangup()``` - leave the call
  * ```sendChannelMessageAll(label, message)``` - send a message to all users in the room
                       (over one of the datachannel labels given during object creation)
  * ```generateToken(userId, callback)``` - for JWT authentication

#### Emitted events
##### for UI
  * ```addRemoteVideo({'pc', 'userId', 'stream'})``` - a remote media stream has become available
  * ```removeRemoteVideo({'userId'})``` - a remote media has become unavailable
  * ```channelMessage({'label', 'userId', 'message'})``` - a 'message' arrived from 'userId' on channel 'label'
##### for cs.js
  * ```localName({'localname'})``` - the local user name is available
  * ```newPeerConnection({'userId', 'pc'})``` - a new PeerConnection was created
  * ```closePeerConnection({'userId', 'pc'})``` - a PeerConnection was closed
  * ```webrtcError({'type', 'userId', 'pc', 'error'})``` - a webRTC error occured
