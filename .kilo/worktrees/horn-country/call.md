# DhwaniAstro Call Functionality Analysis

## Overview
This document analyzes the call functionality in the DhwaniAstro application, covering the architecture, components, data flow, and implementation details of the voice/video calling system.

## Call System Architecture

### Core Components
The call system is composed of several interconnected modules:

1. **WebRTC Service** (`src/services/call/webrtc.service.ts`) - Handles WebRTC peer connections, media streams, and signaling
2. **Signaling Service** (`src/services/call/signaling.service.ts`) - Manages Socket.IO communication for call setup and control
3. **Call Store** (`src/services/call/call.store.ts`) - Zustand-based state management for call state
4. **Call Hooks** (`src/services/call/call.hooks.ts`) - React hooks for consuming call functionality
5. **Call Initialization** (`src/services/call/call.init.ts`) - Sets up WebRTC listeners and signaling callbacks
6. **Call Types** (`src/services/call/call.types.ts`) - TypeScript interfaces and enums for call-related data

### Call Flow

#### 1. Outgoing Call Flow
```
User initiates call
        ↓
CallRequestData prepared (callId, callerId, calleeId, etc.)
        ↓
useCall.startCall() called
        ↓
Signaling service emits 'webrtc_initiate_call' to server
        ↓
WebRTC service:
  - Requests camera/microphone permissions
  - Gets local media stream
  - Creates RTCPeerConnection with ICE servers
  - Creates offer SDP
  - Sets local description
  - Sends offer via signaling ('webrtc_offer')
        ↓
Remote peer receives offer, creates answer, sends back via signaling
        ↓
Local peer sets remote description with answer
        ↓
ICE candidates exchanged via signaling
        ↓
Connection established, media streams flow
```

#### 2. Incoming Call Flow
```
Incoming call notification received via Socket.IO ('webrtc_incoming_call')
        ↓
Signaling service triggers onIncomingCall callback
        ↓
Call store updates participant info and callId
        ↓
Navigation to CallScreen with isIncoming=true
        ↓
CallScreen shows ringing UI
        ↓
User accepts call
        ↓
useCall.acceptCall() called
        ↓
WebRTC service:
  - Requests permissions (if not already granted)
  - Gets local media stream
  - Creates RTCPeerConnection
  - Sends call accepted signal via Socket.IO
        ↓
Remote peer receives accepted signal, proceeds with offer/answer exchange
        ↓
Connection established as in outgoing call flow
```

### Key Implementation Details

#### WebRTC Service (`webrtc.service.ts`)
- Manages RTCPeerConnection lifecycle
- Handles media stream acquisition (getUserMedia)
- Processes ICE candidates for NAT traversal
- Implements offer/answer signaling exchange
- Provides controls for mute, speaker, camera switching
- Emits state changes via callback mechanism

#### Signaling Service (`signaling.service.ts`)
- Registers Socket.IO event listeners for call-related events:
  - `webrtc_incoming_call` - Incoming call notification
  - `webrtc_call_accepted` - Call accepted by remote party
  - `webrtc_call_rejected` - Call rejected by remote party
  - `webrtc_call_end` - Call ended by remote party
  - `webrtc_offer` - WebRTC offer SDP
  - `webrtc_answer` - WebRTC answer SDP
  - `webrtc_ice_candidate` - ICE candidate exchange
- Provides methods to initiate calls and register/unregister callbacks

#### Call Store (`call.store.ts`)
- Uses Zustand for state management
- Tracks call state properties:
  - callId, callerId, calleeId, roomId
  - participant info (id, name, image)
  - status (idle, calling, ringing, connecting, connected, ended, rejected)
  - localStream, remoteStream (MediaStream objects)
  - isMuted, isSpeakerOn, isFrontCamera flags
  - callDuration timer
  - error state
- Provides setter methods and reset function

#### Call Hooks (`call.hooks.ts`)
- Exposes call functionality to React components:
  - startCall(data) - Initiate outgoing call
  - acceptCall(data) - Accept incoming call
  - rejectCall() - Reject incoming call
  - endCall() - End active call
  - toggleMute() - Toggle audio mute
  - switchCamera() - Switch between front/back camera
  - status, localStream, remoteStream, isMuted, participant, callId - State selectors
- Manages WebRTC state callback and signaling service listeners

#### Call Screen (`src/screens/main/call/CallScreen.tsx`)
- Displays local and remote video feeds using RTCView
- Shows call status and duration timer
- Provides controls for muting, camera switching, and ending call
- Handles app state changes (background/foreground)
- Automatically navigates back when call ends

### Data Models

#### CallRequestData
```typescript
{
  callId: string;
  callerId: string;
  callerName: string;
  callerImage?: string;
  calleeId: string;
  roomId: string;
}
```

#### CallState
```typescript
{
  callId: string | null;
  callerId: string | null;
  calleeId: string | null;
  roomId: string | null;
  participant: CallParticipant | null;
  status: 'idle' | 'calling' | 'ringing' | 'connecting' | 'connected' | 'ended' | 'rejected';
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isFrontCamera: boolean;
  callDuration: number;
  error: string | null;
}
```

#### CallParticipant
```typescript
{
  id: string;
  name: string;
  image?: string;
}
```

### Integration Points

#### App Initialization
- `App.tsx` renders the application structure
- Call initialization happens via `useCallInitialization` hook in `call.init.ts`
- This hook sets up WebRTC configuration and signaling listeners when the app starts

#### Socket.IO Integration
- Uses shared socket service from `src/services/socket/socket.service.ts`
- WebRTC signaling events are prefixed with 'webrtc_'
- Socket connection is established elsewhere and shared across services

#### Navigation
- Incoming calls trigger navigation to 'Call' screen via React Navigation
- Call screen receives route parameters: callId, participant, isIncoming
- Call ending triggers automatic navigation back after 1.5 second delay

### Permissions Handling
- Camera and microphone permissions requested via `mediaDevices.getUserMedia`
- Permission errors are caught and call state is set to 'ended' with appropriate error message
- Permissions are requested both for outgoing and incoming calls before media stream acquisition

### Error Handling
- WebRTC errors are caught and call state is updated with error message
- Socket.IO disconnections would affect signaling but are handled by the socket service layer
- ICE connection failures trigger 'ended' state with 'Connection lost' error
- Permission denied errors are explicitly handled

### Configuration
- Default ICE servers: Google STUN servers (stun:stun.l.google.com:19302, stun:stun1.l.google.com:19302)
- TURN server configuration available but requires manual setup with credentials
- Logging enabled in development mode (__DEV__)
- Video constraints: ideal width 640px, height 480px

## Call Flow Summary

1. **Initialization**: App starts, WebRTC service configured, signaling listeners registered
2. **Outgoing Call**: 
   - User initiates call → signaling emits initiate → WebRTC creates offer → offer sent via signaling
3. **Incoming Call**:
   - Server sends webrtc_incoming_call → signaling triggers callback → call store updates → navigates to CallScreen
   - User accepts → WebRTC creates answer → answer sent via signaling
4. **Media Exchange**:
   - Offer/answer exchange establishes peer connection
   - ICE candidates exchanged for NAT traversal
   - Media streams flow between peers once connection established
5. **Call Controls**:
   - Mute/unmute: toggles audio track enabled state
   - Camera switch: stops current video track, gets new stream with different facingMode, replaces track
   - Speaker: handled at OS level (not implemented in WebRTC service)
6. **Call Termination**:
   - Either party ends call → signaling emits webrtc_call_end → both peers clean up resources → call state set to ended

## Dependencies
- react-native-webrtc: WebRTC implementation for React Native
- Socket.IO client: For signaling communication
- Zustand: State management
- React Native: Core framework

## Files Involved
- `src/services/call/webrtc.service.ts` - Core WebRTC logic
- `src/services/call/signaling.service.ts` - Socket.IO signaling
- `src/services/call/call.store.ts` - State management
- `src/services/call/call.hooks.ts` - React hooks API
- `src/services/call/call.init.ts` - Initialization
- `src/services/call/call.types.ts` - TypeScript definitions
- `src/screens/main/call/CallScreen.tsx` - UI component