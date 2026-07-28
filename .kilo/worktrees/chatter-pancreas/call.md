# CALL FLOW ARCHITECTURE DOCUMENT

**Generated:** May 22, 2026  
**Purpose:** Single source of truth for call system debugging and fixes

---

## 1. CALL FLOW OVERVIEW

### High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   UI Layer      │     │  Service Layer  │     │  WebRTC Layer   │
│   (Screens)     │◄───►│  (Hooks, Store) │◄───►│  (Peer Conn)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                       ▲                        ▲
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Navigation      │     │ Socket Service  │◄───►│ Signaling       │
│ (React Nav)     │     │ (socket.io)     │     │ (ICE/Offer)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Outgoing Call Flow

1. **User initiates call** → `CallScreen` receives route params
2. **Permission check** → `useCallPermissions.checkAndRequestAudioPermission`
3. **Start ringback** → `InCallManager.startRingback()` + store status = 'calling'
4. **Socket connect** → `socketService.connectAndWait()` if not connected
5. **Call info stored** → `webRTCService.setCallInfo()` + `useCallStore.setState()`
6. **TODO: Missing** → `socket.emit('join_call')` should be emitted to signal astrologer
7. **Wait for peer_joined** → Server sends `peer_joined` when astrologer accepts
8. **Create offer** → `webRTCService.handlePeerJoined()` → `createOffer()`
9. **Send offer** → `socket.emit('offer', {room_id, offer})`
10. **Wait for answer** → Status = 'waiting_answer'
11. **Receive answer** → `setupWebRTCListeners.on('answer')` → `handleAnswer()`
12. **ICE exchange** → `onicecandidate` → `socket.emit('ice-candidate')`
13. **Connected** → Status = 'connected' via `onconnectionstatechange`

### Incoming Call Flow

1. **Server sends `incoming_call`** or `webrtc_call_accepted` to signaling channel
2. **Navigation to CallScreen** with `isIncoming: true`
3. **User accepts** → `webRTCService.acceptCall()` → `socket.emit('webrtc_call_accepted')`
4. **Wait for offer** → `setupWebRTCListeners.on('offer')` → `handleOffer()`
5. **Create answer** → `webRTCService.handleOffer()` → `createAnswer()`
6. **Send answer** → `socket.emit('answer', {room_id, answer})`
7. **Connected** → Status = 'connected'

### End-to-End Lifecycle

```
idle → calling → connecting → creating_offer → waiting_answer 
     → waiting_connection → connected → ended/rejected
```

---

## 2. DIRECTORY STRUCTURE

### Core Call Files

```
src/
├── services/call/
│   ├── call.hooks.ts          # Main call hook (useCall)
│   ├── call.store.ts          # Zustand store for call state
│   ├── call.types.ts          # TypeScript types
│   ├── call.init.ts           # Call initialization hook
│   ├── webrtc.service.ts      # WebRTC peer connection logic
│   ├── signaling.service.ts   # Socket signaling handlers
│   └── index.ts               # Public exports
│
├── screens/main/call/
│   ├── CallScreen.tsx         # Main call UI screen
│   ├── hooks/
│   │   ├── useCallStatus.ts   # Derive UI status from store
│   │   ├── useCallActions.ts  # User actions (end, mute, etc.)
│   │   ├── useCallTimer.ts    # Call duration countdown
│   │   ├── useCallLifecycle.ts # Navigation on end/reject
│   │   ├── useCallPermissions.ts # Audio permission handling
│   │   └── useUnansweredCallTimer.ts # 60s timeout for unanswered calls
│   └── components/
│       ├── StaticCallUI/      # UI components (participant, status badge)
│       └── CallControls/      # Mute, speaker, end call buttons
│
├── services/socket/
│   ├── socket.service.ts      # Socket.io client wrapper
│   ├── socket.types.ts        # Socket event types
│   └── socket.events.ts       # Event name constants
│
└── modules/call/
    ├── hooks/
    │   ├── useWebRTC.ts       # Alternative WebRTC hook
    │   └── useCallConnection.ts # Call connection hook
    ├── services/
    │   └── signaling.service.ts # WebSocket-based signaling (unused?)
    └── utils/mediaPermissions.ts # Permission utilities
```

---

## 3. STATE MANAGEMENT FLOW

### Zustand Store Structure (`src/services/call/call.store.ts`)

```typescript
interface CallState {
  callId: string | null;
  callerId: string | null;
  calleeId: string | null;
  roomId: string | null;
  participant: CallParticipant | null;
  status: 'idle' | 'calling' | 'connecting' | 'creating_offer' | 
          'waiting_answer' | 'waiting_connection' | 'connected' | 
          'ended' | 'rejected';
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isSpeakerOn: boolean;
  callDuration: number;
  callDurationRemaining: number;
  error: string | null;
}
```

### State Transitions

| Current Status | Event | New Status | Handler |
|----------------|-------|------------|---------|
| idle | startCall | calling | `call.hooks.ts:startCall` |
| calling | peer_joined | creating_offer | `webrtc.service.ts:handlePeerJoined` |
| creating_offer | offer sent | waiting_answer | `webrtc.service.ts:_createAndSendOffer` |
| waiting_answer | answer received | waiting_connection | `webrtc.service.ts:handleAnswer` |
| waiting_connection | ICE connected | connected | `webrtc.service.ts:onconnectionstatechange` |
| connected | timer=0 | - | `call.hooks.ts:useCallTimer` emits `call_ended_by_user` |
| any | call_ended_by_astrologer | ended | `signaling.service.ts:call_ended_by_astrologer` |
| any | call_cancel_by_astrologer | ended | `signaling.service.ts:call_cancel_by_astrologer` |

### State Consumers

| Component | Subscribed State | Action |
|-----------|-----------------|--------|
| `CallScreen.tsx` | `isMuted`, `isSpeakerOn`, `callDurationRemaining` | UI rendering |
| `useCallStatus.ts` | `status`, `remoteStream` | Derive UI status |
| `useCallTimer.ts` | `status`, `callDurationRemaining` | 1s countdown |
| `useCallLifecycle.ts` | `status` | Navigate back on end |
| `webrtc.service.ts` | via `setStateCallback` | Sync localStream, remoteStream, status |

---

## 4. SOCKET FLOW

### Socket Initialization (`socket.service.ts`)

```
connectAndWait()
  ↓
io(SOCKET_URL, { transports: ['websocket'] })
  ↓
socket.on('connect') → registerGlobalListeners()
```

### Listener Registration

**Location:** `setupWebRTCListeners()` in `webrtc.service.ts:942-1023`

```javascript
// Registers on socket instance
socket.on('peer_joined')     → handlePeerJoined()
socket.on('answer')          → handleAnswer()
socket.on('ice-candidate')   → handleIceCandidate()
```

**CRITICAL:** Listeners are cleared on each call via:
```javascript
socket.off('offer');
socket.off('answer');
socket.off('ice-candidate');
socket.off('peer_joined');
```

### Listener Cleanup

| Location | Method |
|----------|--------|
| `useCall` cleanup (`call.hooks.ts:79-87`) | `signalingService.unregisterListeners()` |
| `setupWebRTCListeners` cleanup | `socket.off()` for each event |

### Reconnect Handling

**Buffer mechanism** (`socket.service.ts:78-114`):
- Signaling events (`join_call`, `offer`, `answer`, `ice-candidate`) are buffered when socket disconnected
- On reconnect (`onReconnect`), buffered events are flushed

### Socket Events Flow

#### Outgoing Events (Client → Server)

| Event | Location | Payload |
|-------|----------|---------|
| `join_call` | NOT FOUND - Missing in current flow | `{room_id}` |
| `offer` | `webrtc.service.ts:678` | `{room_id, offer: {type, sdp}}` |
| `answer` | `webrtc.service.ts:760` | `{room_id, answer: {type, sdp}}` |
| `ice-candidate` | `webrtc.service.ts:421` | `{room_id, candidate}` |
| `call_ended_by_user` | `call.hooks.ts:356` | `{room_id, astro_id}` |
| `cancel_call_request` | `call.hooks.ts:339` | `{room_id, astroid, user_id, type}` |
| `autodisconnect` | `call.hooks.ts:137` | `{room_id, astroid, type}` |

#### Incoming Events (Server → Client)

| Event | Handler | Action |
|-------|---------|--------|
| `peer_joined` | `setupWebRTCListeners` | Start offer flow |
| `offer` | NOT REGISTERED in setupWebRTCListeners | handleOffer (missing) |
| `answer` | `setupWebRTCListeners` | Apply answer to peerConnection |
| `ice-candidate` | `setupWebRTCListeners` | Add ICE candidate |
| `call_ended_by_astrologer` | `signaling.service.ts` | Cleanup + navigate back |
| `call_cancel_by_astrologer` | `signaling.service.ts` | Cleanup + navigate back |

### Duplicate Listener Risks

**HIGH RISK:** `setupWebRTCListeners` uses module-level flag `listenersSetup` but:
1. `socket.off()` is called before each `socket.on()` (good)
2. BUT `signalingService.registerCallbacks()` also registers `webrtc_call_accepted`, `webrtc_call_rejected` without deduplication guard

---

## 5. WEBRTC FLOW

### PeerConnection Creation

**Flow:** `webrtc.service.ts:_createPeerConnection():137-516`

1. Check if `peerConnection` exists (re-use)
2. Create `new RTCPeerConnection(ICE_CONFIG)`
3. Setup event handlers:
   - `onicecandidate` → emit `ice-candidate` to socket
   - `ontrack` → set `remoteStream`, call callbacks, set status = 'connected'
   - `oniceconnectionstatechange` → log stats
   - `onconnectionstatechange` → update status, handle failed state

### getUserMedia Flow

**Method:** `getLocalStream() webrtc.service.ts:302-348`

```
mediaDevices.getUserMedia({audio: {...}, video: false})
  ↓
Store in this.localStream
  ↓
If peerConnection exists → addTrack to PC
```

### Offer/Answer Lifecycle

| Step | Method | Socket Event |
|------|--------|--------------|
| 1 | `handlePeerJoined()` isCaller=true | - |
| 2 | `_createAndSendOffer()` | `socket.emit('offer')` |
| 3 | Status = 'waiting_answer' | - |
| 4 | `handleAnswer()` | `socket.emit('answer')` |
| 5 | `_flushICECandidates()` | - |

### ICE Candidate Flow

```
onicecandidate fires
  ↓
socket.emit('ice-candidate', {room_id, candidate})
  ↓
Server forwards to remote peer
  ↓
Remote peer: handleIceCandidate() → addIceCandidate()
```

### Connection State Changes

| State | Handler | Action |
|-------|---------|--------|
| 'connected' | `onconnectionstatechange` | Set status = 'connected' |
| 'failed' | `onconnectionstatechange` | Skip reconnect if in intermediate state |
| 'completed' | `oniceconnectionstatechange` | Log stats |

---

## 6. UI FLOW

### Screens Involved

1. **`CallScreen.tsx`** - Main call UI

### Status Text Flow

**Source:** `StaticCallUI.tsx:CallStatusBadge:46-59`

```typescript
const getStatusText = () => {
  switch (status) {
    case 'ringing':
      return isIncoming ? 'Incoming call...' : 'Calling...';
    case 'connecting':
      return 'Connecting...';
    case 'connected':
      return formatDuration(callDurationRemaining) || 'Connected';
  }
};
```

### Loader/Shimmer Flow

**No shimmer/loading states** - Status text serves as UI state indicator

### Timer Flow

1. `useCallTimer.ts` starts 1s interval when `status === 'connected'`
2. Decrements `callDurationRemaining` each tick
3. At 0, emits `call_ended_by_user`

### Connecting State

- UI shows "Connecting..." when `derivedStatus() === 'connecting'`
- Triggered by states: `connecting`, `creating_offer`, `sending_offer`, `waiting_answer`, `creating_answer`, `waiting_connection`

### Cleanup Flow

1. `performCallCleanup()` called
2. Stop ringback via `stopRingbackSafely()`
3. `webRTCService.cleanup()`
4. `useCallStore.reset()`

---

## 7. NAVIGATION FLOW

### Entry Points

| Source | Navigation | Params |
|--------|------------|--------|
| User initiates call | To `CallScreen` | `{callId, participant, isIncoming: false}` |
| Incoming call received | To `CallScreen` | `{callId, participant, isIncoming: true}` |

### Exit Points

| Trigger | Handler | Action |
|---------|---------|--------|
| status = 'ended' | `useCallLifecycle.ts:33-41` | `navigation.goBack()` |
| status = 'rejected' | `useCallLifecycle.ts:33-41` | `navigation.goBack()` |
| Cancel button | `call.hooks.ts:cancelCallRequest` | `navigation.goBack()` |

---

## 8. TIMER FLOW

### Unanswered Timer

**File:** `useUnansweredCallTimer.ts:16-36`
- Starts when `!isIncoming && status === 'calling'`
- 60 second timeout
- On timeout: emit `autodisconnect`, cleanup, navigate back

### Call Duration Timer

**File:** `useCallTimer.ts:15-48`
- Starts when `status === 'connected'`
- 1 second interval
- Decrements `callDurationRemaining`
- At 0: emit `call_ended_by_user`

### Reconnect Timer

**None** - WebRTC handles via connection state

---

## 9. CALLKEEP FLOW

**NOT IMPLEMENTED** - No CallKeep integration found in codebase.

---

## 10. RECONNECT FLOW

### Socket Disconnect

**Handler:** `socket.service.ts:537-542`
- Sets `connected = false`
- Resets `listenersRegistered = false`
- Resets `chatAcceptedHandled = false`

### Reconnect

**Handler:** `socket.service.ts:519-528`
- `listenersRegistered = false` triggers re-registration
- `onReconnect()` flushes buffered signaling events

### UI State Resync

**NOT IMPLEMENTED** - No explicit state resync on reconnect.

---

## 11. OLD VS NEW ARCHITECTURE DIFFERENCE

**Note:** No `oldsrc` directory found. Comparison based on code analysis reveals:

### Identified Issues

| Area | Problem | Evidence |
|------|---------|----------|
| Missing join_call | `join_call` emit is never called | `startCall()` doesn't emit `join_call` |
| offer handler missing | Incoming calls won't work | No `socket.on('offer')` in setupWebRTCListeners |
| Dual stores | Two `useCallStore` definitions | `stores/call.store.ts` and `services/call/call.store.ts` |
| Timer duplication | Two countdown timers | `call.hooks.ts:93-126` AND `useCallTimer.ts:15-48` |
| startCall incomplete | Returns before socket emit | `startCall()` returns after permission check, no offer flow |

---

## 12. CURRENT KNOWN BUGS

1. **MISSING `join_call` EMIT** - `startCall()` never emits `join_call` to notify server to send `peer_joined`
2. **MISSING `offer` LISTENER** - `setupWebRTCListeners` doesn't handle incoming `offer` for callee
3. **INCOMPLETE startCall** - Returns after ringback start, never creates offer or waits for peer_joined
4. **DUAL CALL STORES** - Two separate stores (`stores/call.store.ts` vs `services/call/call.store.ts`) with different interfaces
5. **TIMER DUPLICATION** - Countdown timer logic exists in both `call.hooks.ts` and `useCallTimer.ts`
6. **STATUS MISMATCH** - `useCallStatus.ts` maps `ended` → `'connected'` for UI status

---

## 13. ROOT CAUSE ANALYSIS

### Why UI Gets Stuck on "Connecting"

**Primary Cause:** `join_call` is never emitted

**Lifecycle Trace:**

1. User navigates to CallScreen (outgoing call)
2. `handleMount` → `checkAndRequestAudioPermission()` ✓
3. `startCall()` called:
   - Sets status = 'calling' ✓
   - Starts ringback ✓
   - Stores call info ✓
   - Checks socket connection ✓
   - **RETURNS WITHOUT EMITTING `join_call`** ❌
4. Server never receives notification to send `peer_joined`
5. `peer_joined` listener never fires
6. No offer is created
7. Status remains 'calling' (mapped to UI 'ringing' then 'connecting')

**Secondary Cause:** Missing `offer` handler for incoming calls

---

## 14. SAFE FIX STRATEGY

### Fix 1: Emit join_call in startCall

**File:** `src/services/call/call.hooks.ts:183-266`

Add after permission check and before ringback:
```typescript
// Emit join_call to notify server
socketService.emit('join_call', {
  room_id: data.room_id,
});
```

### Fix 2: Add offer listener

**File:** `src/services/call/webrtc.service.ts:942-1023`

Add in `setupWebRTCListeners`:
```typescript
(socket as any).on('offer', async (data: any) => {
  await svc.handleOffer({
    sdp: data.offer,
    callId: data.callId,
    callerId: data.callerId,
  });
});
```

### Fix 3: Complete startCall offer flow

**File:** `src/services/call/call.hooks.ts:startCall`

After socket ready, emit `join_call` and wait for `peer_joined`, then:
```typescript
await svc.handlePeerJoined({
  callId: data.callId,
  callerId: data.callerId,
  calleeId: data.calleeId,
  room_id: data.room_id,
});
```

### Fix 4: Consolidate stores

Remove `src/stores/call.store.ts` and use only `src/services/call/call.store.ts`

---

## APPENDIX: Key Function Signatures

### call.hooks.ts

| Function | Params | Description |
|----------|--------|-------------|
| `useCall()` | - | Main hook returning all call actions |
| `startCall()` | `{callId, callerId, calleeId, room_id, ...}` | Initiates outgoing call |
| `acceptCall()` | `{callId, callerId, ...}` | Accepts incoming call |
| `endCall()` | `{roomId, astroId}` | Ends active call |
| `cancelCallRequest()` | `{roomId, astroId, userId}` | Cancels outgoing call |

### webrtc.service.ts

| Method | Params | Description |
|--------|--------|-------------|
| `setCallInfo()` | `{callId, callerId, calleeId, room_id}` | Store call metadata |
| `getLocalStream()` | - | Get user media |
| `createPeerConnection()` | - | Create RTCPeerConnection |
| `handlePeerJoined()` | `CallRequestData` | Handle peer_joined event |
| `handleOffer()` | `{sdp, callId, callerId}` | Process incoming offer |
| `handleAnswer()` | `{sdp, room_id}` | Process incoming answer |
| `handleIceCandidate()` | `{candidate, room_id}` | Add ICE candidate |
| `cleanup()` | - | Destroy connection |

---

*End of Document*