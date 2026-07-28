# Call Flow Integration Analysis

## Existing Architecture (DON'T CHANGE)

### Services Layer (Already Working)
- `src/services/call/webrtc.service.ts` - Core WebRTC logic
- `src/services/call/signaling.service.ts` - Socket signaling wrapper
- `src/services/call/call.store.ts` - Zustand call state
- `src/services/call/call.hooks.ts` - React hooks API
- `src/services/socket/socket.service.ts` - Shared Socket.IO instance
- `src/services/chat/chat.service.ts` - Chat API + socket flow

### UI Layer (Already Working)
- `src/components/Modal/ChatRequestModal.tsx` - Modal with type prop
- `src/screens/main/HomeScreen.tsx` - Handles chat/call button presses
- `src/screens/main/recomandedAstrologer/AstrologerCard.tsx` - Has both buttons

### Navigation (Already Working)
- `CallScreen` at `src/screens/main/call/CallScreen.tsx` - Used for voice calls
- Stack navigator in AppContent.tsx already has Call screen route

## Missing Integration Pieces

### 1. ChatRequestModal → sendChatRequest() (DIFFERENTIATE TYPES)
**Current:** `handleChatRequestSubmit` calls `sendChatRequest()` which only handles chat.
**Needed:** Pass `consultationType` to `sendChatRequest()` and branch logic.

**File:** `src/screens/main/HomeScreen.tsx`
- Line 180-206: `handleChatRequestSubmit`
- Currently stores astrologer in chat store and navigates to chatCall tab
- For calls: should start call flow instead

### 2. sendChatRequest() needs call branch
**File:** `src/services/chat/chat.service.ts`
- Lines 107-223: Current implementation only does chat flow
- Need to add:
  ```typescript
  if (input.consultationType === 'call') {
    // Generate callId, roomId
    // Emit webrtc_initiate_call via socket
    // Set call store status
    // Navigate to CallScreen
    return { success: true, isCall: true };
  }
  ```

### 3. Socket events for call flow
**Backend expects:**
- Outgoing: `incoming_call` (not `webrtc_initiate_call`)
- Then WebRTC signaling: `offer`, `answer`, `ice-candidate`
- Acceptance: `callAcceptedByAstrologer`
- End: `call_ended_by_user`, `call_ended_by_astrologer`

**Current code emits:** `webrtc_initiate_call` (wrong event name!)

**Need to use:** `incoming_call` for call initiation

### 4. Call acceptance handling
**Listen for:** `callAcceptedByAstrologer` (already in socket.types.ts)
**When received:**
- Create WebRTC offer
- Set local description
- Emit `offer` to remote peer

### 5. CallScreen parameters mismatch
**Current CallScreen expects:**
```typescript
{
  roomId: string;
  userId: string;
  targetId: string;
  targetName: string;
  callType: 'voice' | 'video';
  signalingUrl?: string;
}
```

**But call init data should provide:**
```typescript
{
  callId: string;
  callerId: string;
  callerName: string;
  callerImage?: string;
  calleeId: string;
  roomId: string;
  isIncoming?: boolean;
}
```

**This is a DIFFERENT CallScreen than the one in modules/call!**

## Two CallScreen Components Found

### A. `src/screens/main/call/CallScreen.tsx` (Simple audio UI)
- Used by our flow (line 302 in AppContent.tsx)
- Already has proper video/audio UI
- Uses `useCallConnection` hook from `src/modules/call/hooks/`

### B. `src/modules/call/screens/CallScreen.tsx` (Video call UI)
- Different implementation with camera controls
- Not in our navigation stack

**We are using A.**

## Integration Strategy

### Step 1: Update Types
**File:** `src/types/request.types.ts` (or create new)
Add:
```typescript
export type ConsultationType = 'chat' | 'call';
```

Update `ChatRequestInput` to include `consultationType`.

### Step 2: Update ChatRequestModal
**File:** `src/components/Modal/ChatRequestModal.tsx`
- Already has `type` prop
- Pass `type` as `consultationType` to `onSubmit`

### Step 3: Update HomeScreen handler
**File:** `src/screens/main/HomeScreen.tsx`
- `handleChatRequestSubmit` receives `type` from modal
- Pass `consultationType` to `sendChatRequest()`
- Branch logic:
  - If 'chat': current flow (store in chat store, navigate to chatCall)
  - If 'call': new flow (call init, navigate to CallScreen)

### Step 4: Update chat.service.ts
**File:** `src/services/chat/chat.service.ts`
- Add `consultationType` to `ChatRequestInput`
- Branch on `consultationType`:
  - 'chat': existing flow
  - 'call': new flow:
    - Generate callId (UUID)
    - Use same intake API (roomId from response)
    - Emit `incoming_call` via socket (NOT `webrtc_initiate_call`)
    - Set call store state (status: 'calling', participant info)
    - Navigate to Call screen
    - Return `{ success: true, isCall: true, callId, roomId }`

### Step 5: Call Store Integration
**File:** `src/services/call/call.store.ts`
- Already has all needed state
- Need to set initial state when call starts:
  ```typescript
  setCallId(callId)
  setParticipant({ id: astrologerId, name, image })
  setStatus('calling')
  setCallerId(userId)
  setCalleeId(astrologerId)
  setRoomId(roomId)
  ```

### Step 6: Navigation to CallScreen
From `handleChatRequestSubmit` (call branch):
```typescript
navigation.navigate('Call' as never, {
  callId,
  participant: {
    id: astrologerId,
    name: astrologer.name,
    image: astrologer.profilePic,
  },
  isIncoming: false,
} as never);
```

### Step 7: Incoming Call Handling (Already exists but needs wiring)
**File:** `src/services/call/call.init.ts`
- Already registers `onIncomingCall` callback
- Already navigates to CallScreen
- BUT: uses `signalingService` which listens to `webrtc_incoming_call`
- Backend sends `incoming_call` not `webrtc_incoming_call`!

**Fix in signaling.service.ts:**
Add listener for `incoming_call` event (backend event) and map to callback.

### Step 8: WebRTC Offer/Answer after acceptance
When `callAcceptedByAstrologer` received:
- WebRTC service creates offer
- Sets local description
- Emits `offer` via socket

When `offer` received (from astrologer):
- Caller: sets remote description
- Creates answer
- Sets local description
- Emits `answer`

When `answer` received:
- Callee: sets remote description

### Step 9: ICE Candidate Exchange
Both peers:
- Listen: `ice-candidate` → `addIceCandidate()`
- Emit: on `icecandidate` event → send via socket

### Step 10: Call End Handling
- User ends: emit `call_ended_by_user`
- Astrologer ends: listen `call_ended_by_astrologer` → cleanup

## Minimal Changes Required

### Files to Modify:

1. **`src/types/request.types.ts`** (or create if missing)
   - Add `ConsultationType` type
   - Update `ChatRequestInput` to include `consultationType`

2. **`src/components/Modal/ChatRequestModal.tsx`**
   - No change needed (already has `type` prop and passes to onSubmit)

3. **`src/screens/main/HomeScreen.tsx`**
   - Update `handleChatRequestSubmit` to:
     - Accept `consultationType` from modal
     - Pass to `sendChatRequest()`
     - Branch on type for navigation

4. **`src/services/chat/chat.service.ts`**
   - Add `consultationType` to `ChatRequestInput` interface
   - Add `consultationType` to `ChatRequestResult` interface
   - Branch logic in `sendChatRequest()`:
     - chat: existing flow
     - call: new flow (call initiation via socket)

5. **`src/services/call/signaling.service.ts`**
   - Add listener for `incoming_call` (backend event) and forward as `onIncomingCall`
   - Already has `webrtc_incoming_call` for WebRTC signaling - keep it

6. **`src/services/call/call.hooks.ts`**
   - Need to add `callAcceptedByAstrologer` listener
   - When received: create offer via webRTCService, emit via signaling

7. **`src/services/call/webrtc.service.ts`**
   - Already has methods: `startCall()`, `acceptCall()`, `handleOffer()`, `handleAnswer()`, `handleIceCandidate()`
   - Need to ensure offer creation after acceptance works

## Call Flow Sequence

### Outgoing Call (User → Astrologer)

1. User presses Call button
2. ChatRequestModal opens with type='call'
3. User submits → `handleChatRequestSubmit(type='call')`
4. `sendChatRequest({..., consultationType: 'call'})`
5. Chat service:
   - Calls intake API → gets roomId, chatTime
   - Generates callId (UUID)
   - Emits socket: `incoming_call` with {room_id, callerId, callerName, callerImage, receiverId}
   - Sets call store: status='calling', participant=astrologer
   - Navigates to CallScreen with {callId, participant, isIncoming: false}
6. CallScreen mounts → `useCall` hook registers socket listeners
7. `useCallInitialization` already sets up callbacks
8. Wait for `callAcceptedByAstrologer` event
9. On acceptance:
   - `callAcceptedByAstrologer` received
   - Create WebRTC offer (via `webRTCService.startCall()` was already called? No!)
   - **Actually:** Need to initiate WebRTC only after acceptance
   - So on `callAcceptedByAstrologer`: call `webRTCService.startCall()` with call data
10. WebRTC:
    - Creates RTCPeerConnection
    - Gets local audio stream
    - Creates offer SDP
    - Sets local description
    - Emits `offer` via socket
11. Astrologer receives `offer`, creates answer, sends `answer`
12. User receives `answer`, sets remote description
13. ICE candidates exchanged via `ice-candidate` events
14. Connection established → status='connected'

### Incoming Call (Astrologer → User)

1. Backend sends `incoming_call` socket event
2. Signaling service receives → `onIncomingCall` callback
3. Call store updates: callId, participant, status='ringing'
4. Navigation to CallScreen with `isIncoming: true`
5. CallScreen shows "Incoming call..." UI
6. User accepts (automatic for incoming? Or manual?)
   - If manual: CallScreen needs Accept/Reject buttons for incoming
   - Current CallScreen only has mute/end/camera - NO accept/reject!
7. On accept: call `webRTCService.acceptCall()`
8. Accept emits `webrtc_call_accepted` to backend
9. Backend tells astrologer → astrologer sends offer
10. Callee receives offer → `handleOffer()` → creates answer → emits `answer`
11. Offerer receives answer → `handleAnswer()` → connection established

## Critical Issues Found

### Issue 1: Incoming call UI missing
Current `CallScreen` (src/screens/main/call/CallScreen.tsx) only shows:
- Local/remote video
- Mute/end/camera buttons
- Status text

For **incoming** calls, needs:
- Accept button
- Reject button
- Different UI state

**Solution:** May need IncomingCallScreen or modify CallScreen to handle both.

Actually there's `IncomingCallScreen` in `src/modules/call/screens/IncomingCallScreen.tsx`!
That screen handles incoming calls with accept/reject.

So flow should be:
- `incoming_call` → navigate to IncomingCallScreen
- User accepts → IncomingCallScreen navigates to CallScreen

But `call.init.ts` currently navigates directly to CallScreen for incoming calls.
That's wrong for incoming calls - should go to IncomingCallScreen first.

### Issue 2: Duplicate CallScreen implementations
Two CallScreens exist:
- `src/screens/main/call/CallScreen.tsx` (simple, audio-focused)
- `src/modules/call/screens/CallScreen.tsx` (video with many controls)

Which one is used? AppContent.tsx imports from `src/screens/main/call` → so uses first one.

But `IncomingCallScreen` uses the second one? Let's check imports.

IncomingCallScreen imports from '../hooks/useCallConnection' - that's modules/call/hooks.

So there are TWO separate call architectures:
1. **Main architecture** - `src/services/call/` (simple, Zustand-based)
2. **Modules architecture** - `src/modules/call/` (complex, custom hook-based)

We must use **main architecture** because:
- Already integrated in AppContent
- Already uses Zustand (consistent with app)
- Already has CallScreen in navigation stack

So IncomingCallScreen is from different architecture - IGNORE IT.

We need our own incoming call handling using main architecture.

### Issue 3: Socket event names mismatch
Backend events per requirements:
- `incoming_call` (call request)
- `callAcceptedByAstrologer` (acceptance)
- `call_ended_by_user` (user ended)
- `call_ended_by_astrolger` (astro ended)
- WebRTC: `offer`, `answer`, `ice-candidate`

Current signaling.service.ts expects:
- `webrtc_incoming_call` (wrong!)
- `webrtc_call_accepted` (wrong!)
- etc.

**Need to add listeners for actual backend events.**

## Revised Implementation Plan

### Keep existing main architecture:
- `src/services/call/` (Zustand-based)
- `src/screens/main/call/CallScreen.tsx`

### Add to signaling.service.ts:
```typescript
// Backend call events (different from WebRTC signaling)
socket.on('incoming_call', (data) => {
  this.callbacks?.onIncomingCall(data);
});

socket.on('callAcceptedByAstrologer', (data) => {
  this.callbacks?.onCallAccepted(data);
});

socket.on('call_ended_by_astrologer', (data) => {
  this.callbacks?.onCallEnded(data);
});
```

### Update call.hooks.ts:
Add listener for `callAcceptedByAstrologer`:
```typescript
const handleCallAccepted = useCallback(() => {
  // Now create the WebRTC offer
  webRTCService.startCall({
    callId: callId,
    callerId: userId, // need user ID
    calleeId: participant?.id || '',
    roomId: roomId, // need roomId
    callerName: userName,
    callerImage: userImage,
  });
  setStatus('connecting');
}, []);
```

But `startCall` expects `CallRequestData` which includes callerName, callerImage.
Need to store these in call store when initiating.

### Update HomeScreen call flow:
```typescript
// After successful intake for call:
const callId = generateUUID();
const roomId = intakeResponse.roomId;

// 1. Set call store
useCallStore.getState().setCallId(callId);
useCallStore.getState().setParticipant({
  id: astrologer.id,
  name: astrologer.name,
  image: astrologer.profilePic,
});
useCallStore.getState().setCallerId(user.id);
useCallStore.getState().setCalleeId(astrologer.id);
useCallStore.getState().setRoomId(roomId);
useCallStore.getState().setStatus('calling');

// 2. Emit incoming_call socket event
socketService.emit('incoming_call', {
  room_id: roomId,
  callerId: user.id,
  callerName: user.name,
  callerImage: user.profilePic,
  receiverId: astrologer.id,
});

// 3. Navigate to CallScreen
navigation.navigate('Call' as never, {
  callId,
  participant: {
    id: astrologer.id,
    name: astrologer.name,
    image: astrologer.profilePic,
  },
  isIncoming: false, // outgoing call
} as never);
```

### For incoming calls (backend → incoming_call):
```typescript
// in call.init.ts onIncomingCall handler:
useCallStore.setState({
  callId: data.callId,
  participant: {
    id: data.callerId,
    name: data.callerName,
    image: data.callerImage,
  },
  roomId: data.roomId,
  callerId: data.callerId,
  calleeId: currentUserId,
  status: 'ringing',
});

// Navigate to CallScreen with isIncoming: true
navigation.navigate('Call' as never, {
  callId: data.callId,
  participant: {
    id: data.callerId,
    name: data.callerName,
    image: data.callerImage,
  },
  isIncoming: true,
} as never);
```

But CallScreen needs to handle incoming differently - show accept/reject.
Current CallScreen doesn't support incoming call UI!

Need to either:
1. Modify CallScreen to handle incoming state
2. Use separate IncomingCallScreen (but that uses different architecture)

**Decision:** Modify existing CallScreen (main version) to handle both incoming/outgoing.

### Modify CallScreen (main version):
Add based on `isIncoming` prop:
- If incoming: show Accept/Reject buttons
- If outgoing: show end call only
- Both: show timer, mute, speaker

But wait - CallScreen params currently are:
```typescript
type CallScreenRouteParams = {
  callId: string;
  participant: { id: string; name: string; image?: string };
  isIncoming?: boolean;
};
```

It receives `isIncoming` but doesn't use it for UI!

Need to update CallScreen to:
- If incoming: show accept/reject initially (status='ringing')
- On accept: call `acceptCall()` or trigger WebRTC
- On reject: call `rejectCall()`

But `useCall` hook already has `acceptCall` and `rejectCall`.

So CallScreen just needs to:
- Check `isIncoming` and `status`
- If incoming and status='ringing': show accept/reject
- If user accepts: call `acceptCall()` → starts WebRTC → status becomes 'connecting' → 'connected'
- If outgoing: auto-start WebRTC on mount? No, wait for acceptance.

For outgoing:
- On mount: already in 'calling' status (set by chat service)
- Wait for `callAcceptedByAstrologer` event
- On that event: start WebRTC (create offer)

For incoming:
- On mount: status='ringing' (set by init callback)
- Show accept/reject
- On accept: call `acceptCall()` → starts WebRTC (creates answer, sends acceptance signal)

## Summary of Required Code Changes

### 1. Add ConsultationType type definition
**File:** `src/types/request.types.ts` (new file or existing)
```typescript
export type ConsultationType = 'chat' | 'call';
```

### 2. Update ChatRequestInput in chat.service.ts
Add `consultationType: ConsultationType;`

### 3. Update HomeScreen.tsx
- Pass `consultationType` from modal type to `sendChatRequest`
- In `handleChatRequestSubmit`:
  - After result, check `consultationType`
  - If 'call': navigate to CallScreen directly (not chatCall tab)
  - If 'chat': existing flow

### 4. Update chat.service.ts sendChatRequest()
Add branch:
```typescript
if (input.consultationType === 'call') {
  const callId = uuidv4(); // need to import uuid or use crypto.randomUUID()
  const userId = getUserId(); // from auth store
  
  // Set call store
  useCallStore.getState().setCallId(callId);
  useCallStore.getState().setParticipant({...});
  useCallStore.getState().setCallerId(userId);
  useCallStore.getState().setCalleeId(input.astrologerId);
  useCallStore.getState().setRoomId(intakeResponse.roomId);
  useCallStore.getState().setStatus('calling');
  
  // Emit incoming_call socket event
  const emitted = socketService.emit('incoming_call', {
    room_id: intakeResponse.roomId,
    callerId: userId,
    callerName: input.name,
    callerImage: userProfile.profilePic,
    receiverId: input.astrologerId,
  });
  
  return { success: true, isCall: true, callId, roomId: intakeResponse.roomId };
}
```

### 5. Update ChatRequestModal submit
Already passes type as consultationType via onSubmit.

### 6. Add incoming_call listener to signaling.service.ts
```typescript
socket.on('incoming_call', (data: any) => {
  this.callbacks?.onIncomingCall({
    callId: data.callId || generateUUID(), // backend might not send callId
    callerId: data.callerId,
    callerName: data.callerName,
    callerImage: data.callerImage,
    calleeId: data.receiverId,
    roomId: data.room_id,
  });
});
```

### 7. Update call.init.ts onIncomingCall handler
Should also store roomId, callerId, calleeId in call store.

### 8. Add callAcceptedByAstrologer listener
In `call.hooks.ts` or `call.init.ts`:
```typescript
signalingService.getSocket()?.on('callAcceptedByAstrologer', () => {
  // Start WebRTC offer
  const state = useCallStore.getState();
  webRTCService.startCall({
    callId: state.callId!,
    callerId: state.callerId!,
    calleeId: state.calleeId!,
    roomId: state.roomId!,
    callerName: state.participant?.name || '',
    callerImage: state.participant?.image || '',
  });
});
```

### 9. Update CallScreen to handle incoming UI
Add accept/reject buttons if `isIncoming` and status='ringing'.

### 10. Handle call end events
Listen for `call_ended_by_astrologer` to cleanup.

### 11. Generate UUID
Need a way to generate callId. Use `crypto.randomUUID()` or a simple timestamp-based ID.

## Files to Modify (Minimal Set)

1. `src/types/request.types.ts` (new) - Add ConsultationType
2. `src/services/chat/chat.service.ts` - Add consultationType param and call branch
3. `src/screens/main/HomeScreen.tsx` - Pass consultationType, handle call navigation
4. `src/services/call/signaling.service.ts` - Add incoming_call listener
5. `src/services/call/call.hooks.ts` - Add callAcceptedByAstrologer listener, start WebRTC
6. `src/services/call/call.init.ts` - Store full call data in store
7. `src/screens/main/call/CallScreen.tsx` - Add incoming call UI (accept/reject)
8. `src/App.tsx` or `AppContent.tsx` - Ensure socket connection for calls (maybe already via chat)

That's 8 files modified, minimal and focused.

Let me implement.
