# Chat/Call Flow Architecture Deep Analysis (Architecture Report — NO CODE CHANGES)

> Scope: Astrology app React Native codebase. This report documents the existing Chat & Call journey starting from `ChatCallScreen`, tracing chat/call hooks, stores, socket wiring, navigation triggers, and related modals. No implementation proposals are made.

---

## 1. High-Level Architecture

### 1.1 Core flow components

**Primary “entry” screen**
- `src/screens/main/chatcall/index.tsx` — `ChatCallScreen`
  - Fetches astrologers list
  - Transforms astrologer API objects into “card-ready” objects
  - Provides search + filter UI (via `useChatCall` + `FilterSection`)
  - Handles user actions (chat/call/profile) with auth gating
  - Opens `ChatRequestModal`
  - On successful consultation request, either:
    - Navigates into `Call` screen (call path), or
    - Switches into chat experience via `ChatCall` tab + store flags (chat path)
    - Renders chat directly when `chatStatus === 'active'` and `roomId` exists.

**Conversation/consultation orchestration**
- `src/screens/main/..../call/hooks/useConsultationFlow.ts`
  - Uses `sendChatRequest` to create an intake and emit correct socket requests
  - Controls navigation into `Call` and triggers store-based chat navigation

**Socket-based realtime layers**
- `src/services/socket/socket.service.ts`
  - Owns socket.io client lifecycle (`connectAndWait`, `getSocket`, global listener registration)
  - Registers server-to-client events for chat (queue/chat accepted/chat rejected/messages/typing/etc.)
  - Normalizes room IDs and updates the chat store

**Chat rendering layer**
- `src/screens/main/chat/ChatScreen.tsx`
  - Uses chat hooks to subscribe to socket events and drive message list UI
- `src/services/chat/chat.store.ts`
  - Zustand store for chat status, queue state, messages, and selected astrologer
- `src/services/chat/chat.hooks.ts`
  - Hook composition:
    - `useChatSocket` (event listeners)
    - `useChatMessages` (message state + sendMessage support)
    - `useChatFlow` (UI actions such as end/recharge/rating)
    - `useChatTimer`, etc.

**Call realtime layer**
- `src/screens/main/call/CallScreen.tsx`
  - Uses WebRTC + call store
- `src/services/call/call.store.ts`
  - Zustand store for call status, local/remote streams, mute/speaker
- `src/services/call/call.hooks.ts`
  - `useCall` hook handles start/end/cancel + connects WebRTC listeners

**Category-based screen existence**
- `src/screens/main/ProblemBaseAstroScreen.tsx`
  - Already fetches astrologers and filters by `skills`
  - It currently *does not* integrate with the full chat/call flow shown in `ChatCallScreen` (based on observed code).

### 1.2 “Visual” flow (as implemented today)

```text
Astrologer API
   ↓ (useAstrologers)
ChatCallScreen
   ↓ transform (map into card model)
useChatCall (filter/search)
   ↓
AstrologerCard (UI actions)
   ↓ (onChat/onCall)
Login check gating (LoginRequiredModal)
   ↓
ChatRequestModal
   ↓ onSubmit
useConsultationFlow
   ↓
sendChatRequest (creates intake + emits socket events)
   ↓
Socket events
   ↓
Chat store updates (queue → active → completed)
   ↓
ChatScreen UI (messages, typing, rating, recharge)

(For call path)
   ↓
call.store status transitions
   ↓
Navigation -> Call screen
   ↓
WebRTC call controls + lifecycle
```

---

## 2. Chat Flow Analysis (Complete journey)

### 2.1 User trigger: Chat button on astrologer card
**Files**
- `src/screens/main/chatcall/index.tsx`
- `src/screens/main/chatcall/components/AstrologerCard/index.tsx`
- `src/screens/main/chatcall/components/AstrologerCard/types.ts`
- `src/screens/main/chatcall/components/FilterSection/index.tsx`

**Journey**
1. `AstrologerCard` renders a **Chat** button.
   - It calls `onChatPress?.(astrologer)` when tapped.
2. `ChatCallScreen` provides `handleChatPress` to `AstrologerCard`.
3. `handleChatPress` calls `handleRestrictedAction(...)`.
4. `handleRestrictedAction` checks auth:
   - If `isAuthenticated`: calls the callback immediately.
   - Else: sets `modalMessage` and opens `LoginRequiredModal`.
5. On success (authenticated):
   - `consultationType` set to `'chat'`
   - `selectedAstrologer` set
   - `showChatRequestModal = true`

### 2.2 Modal step: capture birth details
**File**
- `src/components/Modal/ChatRequestModal.tsx`

**Journey**
1. `ChatRequestModal` receives:
   - `visible`
   - `type` = `'chat'`
   - `astrologer` object
   - `loading` = `consultationLoading`
   - `onSubmit(formData)` from `ChatCallScreen`
2. Modal displays:
   - Recent intake picker via `useRecentIntakes()` (recent consultation inputs)
   - Or “new details” form (Name, Gender, DOB, Place of Birth, Birth Time)
3. On submit:
   - It validates form locally
   - Calls parent `onSubmit({name, gender, dateOfBirth, placeOfBirth, birthTime})`

### 2.3 Consultation request submission (chat request)
**File**
- `src/screens/main/call/hooks/useConsultationFlow.ts`

**Journey**
1. `ChatCallScreen` calls:
   - `submitConsultationRequest({ astrologer, consultationType: 'chat', formData, onClose })`
2. `useConsultationFlow` calls:
   - `sendChatRequest({ ... })` from `src/services/chat/chat.service.ts`
3. `submitConsultationRequest` (on success):
   - closes modal via `onClose?.()`
   - calls `onNavigateToTab?.('chatCall')` (optional)
   - sets `useChatStore.getState().setSelectedAstrologer(...)` for chat UI context
   - returns `{ success: true }`

### 2.4 Core backend integration + socket emission for chat
**File**
- `src/services/chat/chat.service.ts`

**Journey**
1. `sendChatRequest` performs:
   - `resetChatAcceptedFlag()` (dedup guard for chat accepted)
2. It validates required inputs:
   - `astrologerId`
   - `userProfile.id`
3. Builds an **intake API payload** (`IntakeInput`) using:
   - gender mapping `male/female/other` → `MALE/FEMALE/OTHER`
   - date/time formatting
   - includes user location info (placeOfBirth)
   - uses `requestType` = `input.consultationType`
4. Calls intake API:
   - `createIntake(apiPayload)`
5. After receiving `intakeResponse.roomId`, it executes **CHAT FLOW**:
   - Prepares socket payload via `prepareSocketPayload`
   - Updates chat store in a staged way:
     - `setRoomId(intakeResponse.roomId)`
     - `setChatStatus('waiting')`
     - `setChatDuration`, `setTimeLeft`, `setTimer`
     - sets user context (`setUserData`, `setUserPayload`)
   - Connects to socket:
     - `socketService.connectAndWait()`
   - Emits two socket events:
     - `chat_request` (with user+intake payload)
     - `join_room` (with roomId)
   - Sets chat store to queued state and starts a queue timer

### 2.5 Realtime queue management and chat acceptance
**Files**
- `src/services/socket/socket.service.ts`
- `src/services/chat/chat.store.ts`
- `src/services/chat/chat.hooks.ts`

#### A) Global socket listeners (SocketService)
`socket.service.ts` registers handlers for:
- `queue_position`
- `queue_update`
- `chatAcceptedByAstrologer` (and server alias `CHAT_ACCEPTED`)
- `chat_rejected` / `CHAT_REJECTED`
- `receive_message`
- `typing` / `TYPING_STATUS`
- `leave_chat` / `LEAVE_CHAT_EVENT`
- `chatCompleted` / `CHAT_COMPLETED_EVENT`
- `user_disconnected` / `USER_DISCONNECTED`
- `error`

**What changes in store**
- On queue_position:
  - updates `queueData` and sets `chatStatus='queued'`
  - starts queue timer via `startTimer(waitTime)`
- On queue_update:
  - updates `queueData`
  - when `position === 0 && waitTime <= 0`:
    - stops timer
    - clears queue
    - sets chat status `'queued'` (note: acceptance transition is handled via acceptance handler + store flags)
- On chat accepted:
  - checks chat status guard (only accept during queued/waiting states)
  - stops timer + clears queue
  - sets `chatStatus='active'`
  - sets `shouldNavigateToChat=true`
  - sets `chatRoom` with roomId/astrologer identity

#### B) Screen-level socket listeners (`useChatSocket`)
In parallel to `SocketService`’s global listeners, `ChatScreen` uses `useChatSocket`.
- It registers event listeners again, scoped to `roomId` and updates store:
  - `QUEUE_POSITION` → `queued` and `startTimer`
  - `QUEUE_UPDATE` → updates queue data; transitions logic for acceptance
  - `CHAT_ACCEPTED` → sets `chatRoom` and `chatStatus='active'`
  - `CHAT_REJECTED` → sets `rejected` and error
  - `RECEIVE_MESSAGE` → appends messages
  - `TYPING_STATUS` → updates typingStatus
  - `LEAVE_CHAT_EVENT` → sets completed
  - `ERROR`, `USER_DISCONNECTED`

> Practical implication: there are **two listener layers** in the codebase (global in `socket.service.ts` and screen-level in `useChatSocket`). This is important for duplication analysis.

### 2.6 Navigation: how ChatScreen appears
Two mechanisms exist:

#### Mechanism 1: Store-driven tab navigation in MainNavigator
**File**
- `src/navigation/mainNavigation/MainNavigator.tsx`

**Flow**
- `MainNavigator` watches `useChatStore(state => state.shouldNavigateToChat)` and `roomId`.
- When `shouldNavigateToChat && chatRoomId`:
  - calls `handleNavigateToTab('chatCall')`

This mechanism ensures the app shows the correct tab when chat is accepted.

#### Mechanism 2: Direct render inside ChatCallScreen
**File**
- `src/screens/main/chatcall/index.tsx`

**Flow**
- It reads:
  - `chatStatus`
  - `roomId`
  - `shouldNavigateToChat`
  - also holds a local ref `hasNavigatedRef` to prevent duplicate transition.
- When:
  - `chatStatus === 'active'`
  - `roomId` is valid
  - and `!hasNavigatedRef.current`
- Then:
  - sets `showChatScreen = true`
- When `showChatScreen && astroToUse && userData`:
  - it renders `ChatScreen` directly.

### 2.7 ChatScreen runtime (messages, typing, completion)
**File**
- `src/screens/main/chat/ChatScreen.tsx`

**Primary responsibilities**
- Pulls store state:
  - `roomId`, `chatRoom`, `chatStatus`, `chatDuration`, `stopChatTimer`, etc.
- Establishes socket:
  - `socketService.getSocket()`
- Builds message capabilities:
  - `useChatMessages({ socket, roomId, userId, astrologerId, astrologerName, chatStatus })`
- Builds flow capabilities:
  - `useChatFlow({...})`
- Subscribes to:
  - `useChatSocket({...})` for realtime events
  - `useChatTimer({chatStatus, chatDuration})`
  - `useRechargeTrigger(...)` for low-time recharge flows
  - `useRatingModalController(...)` for rating modal timing

**Completion**
- On `onChatCompleted` from socket layer:
  - `stopChatTimer()`
  - `setChatStatus('completed')`
  - `setRechargeModal(false)`

**User-driven end chat**
- `ChatHeader` calls `completeChat` (from `useChatActions`) which:
  - emits `chatCompleted` via socket
  - performs local cleanup first
  - optionally emits `leaveChat`

### 2.8 Chat request modal close timing
**File**
- `src/components/Modal/ChatRequestModal.tsx`
- `src/screens/main/call/hooks/useConsultationFlow.ts`

Key behavior:
- `ChatRequestModal` on submit does not close immediately.
- In `useConsultationFlow`, modal is closed only after `sendChatRequest` returns success:
  - `onClose?.()` happens after success

This is used to avoid race conditions between modal unmount and socket/navigation pipeline.

---

## 3. Call Flow Analysis (Complete journey)

### 3.1 User trigger: Call button on astrologer card
**Files**
- `src/screens/main/chatcall/index.tsx`
- `src/screens/main/chatcall/components/AstrologerCard/index.tsx`

**Journey**
1. `AstrologerCard` renders a **Call** button and calls `onCallPress?.(astrologer)`.
2. `ChatCallScreen` handles via `handleCallPress`.
3. `handleCallPress` uses `handleRestrictedAction`:
   - requires auth (else `LoginRequiredModal`)
4. On success:
   - `consultationType='call'`
   - set `selectedAstrologer`
   - opens `ChatRequestModal` with `type='call'`

### 3.2 Modal step: capture birth details
**File**
- `src/components/Modal/ChatRequestModal.tsx`

Call path differs only in messaging + call-specific dynamic import behavior:
- `type === 'call'`
- The header text and submit button label become call-specific
- Modal includes:
  - recent intake selection
  - “new details” form

### 3.3 Consultation submission: call request path
**File**
- `src/screens/main/call/hooks/useConsultationFlow.ts`
- `src/services/chat/chat.service.ts`

**Journey**
1. `useConsultationFlow.submitConsultationRequest(...)` calls `sendChatRequest` with `consultationType='call'`.
2. `sendChatRequest` detects call type and performs:
   - intake API call (`createIntake`) like chat
   - then a specialized “call queue management” path

### 3.4 Call queue & socket logic (specialized)
**File**
- `src/services/chat/chat.service.ts`

Call flow is embedded inside `sendChatRequest` rather than in call-specific API layers.

**Observed steps**
1. Creates a client-side `callId` locally.
2. Sets call store state via `useCallStore.setState(...)`:
   - `callId`, `callerId`, `calleeId`, `roomId`
   - `participant: { id, name, image }`
   - `status='queue_checking'`
3. Connects socket:
   - `socketService.connectAndWait()`
4. Prepares socket payload (intake-based payload plus call payload):
   - sets `consultationType: 'call'`
5. Queue management promise:
   - attaches listeners for:
     - `queue_position`
     - `queue_update`
   - defines a 45s inactivity timeout
   - on queue resolution (position 0, waitTime <= 0):
     - sets `callStore.setStatus('calling')`
     - clears chat queue
     - sets `chatStore.setShouldNavigateToCall(true)`
     - resolves as call-ready
   - emits `call_request` after registering listeners
6. After queue promise resolves successfully, `useConsultationFlow` navigates to `Call` screen if `isCall && !isQueued`.

### 3.5 Navigation to Call screen
**File**
- `src/screens/main/call/hooks/useConsultationFlow.ts`

**Flow**
- On success result `isCall:
  - if isQueued`:
    - `onNavigateToTab?.('chatCall')`
    - returns (queue bubble presumably remains on chatCall)
  - else:
    - `navigation.navigate('Call', { callId, participant, isIncoming:false })`

**Primary observation**
- Direct navigation into the call screen occurs only for non-queued direct call path.

### 3.6 Call screen lifecycle and end/cancel
**File**
- `src/screens/main/call/CallScreen.tsx`

**Journey**
1. Extracts route params:
   - `callId`
   - `participant` (id, name, image)
   - `isIncoming` flag
2. Uses `useCall()` hook to access:
   - `startCall`, `endCall`, `toggleMute`, `remoteStream`, etc.
3. Outgoing calls:
   - on mount (effect), triggers `startCall({ callId, callerId, calleeId, room_id, ... })`
4. End-call UI button:
   - if connected: calls `endCall({ roomId, astroId })`
   - if not connected: calls `cancelCallRequest({ roomId, astroId, userId })`
5. Also auto-ends:
   - unanswered call timer (60s) for outgoing calls
   - when `callDurationRemaining <= 0` while connected
6. When call status becomes `ended` or `rejected`:
   - navigation.goBack() if possible

### 3.7 WebRTC and socket signaling inside call hooks
**File**
- `src/services/call/call.hooks.ts`

Responsibilities:
- `useCall` sets up WebRTC listeners via:
  - `setupWebRTCListeners()`
- `signalingService.registerCallbacks(...)`
- `startCall(data)`:
  - sets call status to `calling`
  - starts ringback (InCallManager)
  - sets WebRTC call info
  - ensures socket connected
  - registers `once` handlers for:
    - `callAcceptedByAstrologer` → reads `callTime` and transitions to `connecting`, then emits `join_call`
    - `call_rejected_by_astrologer` → performs cleanup + sets status 'rejected'
- `cancelCallRequest(...)` and `endCall(...)` emit server events:
  - `cancel_call_request`
  - `call_ended_by_user`

---

## 4. Duplication Analysis (where ProblemBasedAstroScreen would duplicate Chat/Call logic)

A new `ProblemBasedAstroScreen` is expected to display category-filtered astrologers (Career/Love/etc.). If it implements its own chat/call UI logic today, the following duplications are likely.

### 4.1 Chat Button Handling
Currently:
- `ChatCallScreen` handles chat button taps via:
  - `handleChatPress` → `handleRestrictedAction` → set state → open `ChatRequestModal`
- `AstrologerCard` itself is generic UI and triggers callbacks.

If `ProblemBasedAstroScreen` re-creates its own logic:
- it would need the same auth gating and `consultationType` management.
- duplication risk: mismatched gating or different modal close timing.

### 4.2 Call Button Handling
Currently:
- `handleCallPress` mirrors chat logic but sets `consultationType='call'`.

Duplication risk:
- call queue/race handling is sensitive (see `sendChatRequest` call path).
- if multiple screens implement call logic differently, queue readiness could mismatch navigation timing.

### 4.3 Login Checks
Currently:
- `handleRestrictedAction` centralizes auth checking and opens `LoginRequiredModal` with localized messages.

Duplication risk:
- inconsistent messages or missing login-required gating on one of the action buttons.

### 4.4 Wallet Checks
The visible `ChatCallScreen` does not explicitly do wallet validation, but chat runtime uses recharge triggers:
- `useRechargeTrigger` and `RechargePaymentModal` exist in `ChatScreen`.

If a new screen duplicates chat/call navigation and wallet gating, there is a high risk of:
- performing recharge/wallet checks at the wrong step
- double-charging or missing recharge triggers

### 4.5 Consultation Request Logic
Currently:
- `useConsultationFlow` is the orchestration boundary.
- `sendChatRequest` contains both chat and call initiation and their socket/queue logic.

Duplication risk:
- re-implementing send/queue navigation logic leads to divergent socket emissions and inconsistent store state.
- `ChatRequestModal` close timing matters because it depends on `sendChatRequest` success.

### 4.6 Modal Handling
Currently:
- `ChatRequestModal` and `LoginRequiredModal` are used in `ChatCallScreen`.

Duplication risk:
- if multiple screens manage modal state, you can get:
  - stale `selectedAstrologer`
  - race conditions with queue acceptance
  - modal unmount issues mid-socket acceptance

### 4.7 Navigation Logic
Currently:
- Two navigation/transition mechanisms exist for chat:
  - `MainNavigator` reacts to `shouldNavigateToChat`
  - `ChatCallScreen` directly renders `ChatScreen` based on `chatStatus` and `roomId`
- Call navigation:
  - `useConsultationFlow` does `navigation.navigate('Call', params)`

Duplication risk:
- new screens could create conflicting transitions (tab switch vs direct render) unless they reuse the same store flags and transitions.

### 4.8 Astrologer Mapping Logic
Currently:
- `ChatCallScreen` maps the astrologer listing API model into list/card properties:
  - finds pricing entries for CHAT and CALL
  - defaults availability flags
  - normalizes rate fields

Duplication risk:
- new screen could map differently causing:
  - wrong price display
  - wrong disabled state (isAvailableForChat/isAvailableForCall)
  - incorrect active tab header/subtitle messaging

### 4.9 Search Logic + Filter Logic
Currently:
- `useChatCall(astrologers)` provides:
  - search query
  - filter state: availability, rating, priceRange, languages
  - computed `filteredAstrologers`

Duplication risk:
- implementing additional filters for categories (ProblemBasedAstroScreen) might conflict with existing chat/call filters.
- maintenance risk: different filter semantics across screens.

### Why duplication is dangerous
- **Socket/queue correctness** depends on consistent store transitions and listener lifecycles.
- There are already multiple socket listener layers (global + screen hook). Duplicating orchestration in another screen increases the likelihood of:
  - race conditions
  - duplicate event handling
  - stale store values
  - incorrect navigation based on incomplete state

---

## 5. Reusable UI Candidates (existing components usable across screens)

### 5.1 High-confidence reusable components
- `src/components/Modal/ChatRequestModal.tsx`
  - Generic form used for both chat and call (`type` prop)
  - Handles recent intake selection
  - Validates and calls `onSubmit(formData)`
- `src/components/Modal/LoginRequiredModal` (imported by `ChatCallScreen`)
  - Auth gating modal
- `src/screens/main/chatcall/components/AstrologerCard/index.tsx`
  - Accepts callback props for chat/call/profile actions
  - Displays rating/pricing/skills and availability indicators
- `src/screens/main/chatcall/components/FilterSection/index.tsx`
  - Generic filter chips for availability/rating/price/language
  - Driven entirely by `filters` and callbacks.

### 5.2 Current reusability level (what’s already “parameterized”)
- `ChatRequestModal` is clearly parameterized by:
  - `visible`, `type`, `astrologer`, `loading`, and `onSubmit`.
- `AstrologerCard` is clearly parameterized by:
  - `astrologer` model, `activeTab`, callbacks.
- `FilterSection` is parameterized by:
  - `filters`, `onFiltersChange`, `availableLanguages`.

---

## 6. Reusable Business Logic Candidates (hooks + responsibilities)

### 6.1 `useConsultationFlow`
**File**
- `src/screens/main/call/hooks/useConsultationFlow.ts`

Responsibilities today:
- orchestrates consultation submission
- calls `sendChatRequest`
- shows toast success/error
- closes modal (`onClose?.()`) after success
- decides navigation for call vs chat:
  - call: `navigation.navigate('Call', ...)` (non-queued)
  - chat: sets selected astrologer in chat store, relies on tab/store logic

### 6.2 `sendChatRequest`
**File**
- `src/services/chat/chat.service.ts`

Responsibilities today (important coupling boundary):
- creates intake (`createIntake`)
- emits socket events for both chat and call
- manages call queue and decides readiness
- updates chat store for chat queue

This is the single most critical “business logic” boundary.

### 6.3 `useChatCall`
**File**
- `src/screens/main/chatcall/hooks/useChatCall.ts`

Responsibilities:
- purely list-level filtering/search transformation
- does not implement network or socket behavior

### 6.4 Chat runtime hooks
**File**
- `src/services/chat/chat.hooks.ts`

Responsibilities:
- `useChatSocket` — binds socket events to chat store
- `useChatActions` — join/cancel/leave/complete chat emits
- `useChatTimer` — timer updates
- plus additional hooks imported by ChatScreen.

### 6.5 Call runtime hooks
**File**
- `src/services/call/call.hooks.ts`

Responsibilities:
- WebRTC initialization and signaling callbacks
- start/cancel/end call events
- ringback handling and status transitions

---

## 7. Dependency Graph (ChatCallScreen)

> Graph reflects *observed* dependencies from traced imports and store/network usage.

### 7.1 Dependency tree

```text
ChatCallScreen (src/screens/main/chatcall/index.tsx)
├─ UI / List
│  ├─ useAstrologers()
│  │  └─ API: src/services/api/recomandedAstrologer/astrologer.hooks (not opened here)
│  ├─ useChatCall(astrologers) (src/screens/main/chatcall/hooks/useChatCall.ts)
│  │  └─ internal filter/search computations
│  ├─ AstrologerCard (src/screens/main/chatcall/components/AstrologerCard/index.tsx)
│  └─ FilterSection (src/screens/main/chatcall/components/FilterSection/index.tsx)
│
├─ Auth gating
│  └─ LoginRequiredModal (from src/components/Modal export)
│
├─ Consultation modal
│  └─ ChatRequestModal (src/components/Modal/ChatRequestModal.tsx)
│     └─ uses useRecentIntakes()
│
├─ Consultation submission
│  └─ useConsultationFlow() (src/screens/main/call/hooks/useConsultationFlow.ts)
│     └─ sendChatRequest() (src/services/chat/chat.service.ts)
│        ├─ createIntake API
│        ├─ chat socket emits: chat_request, join_room
│        └─ call socket emits + queue management for call_request
│
├─ Chat runtime
│  ├─ useChatStore selectors (src/services/chat/chat.store.ts)
│  ├─ conditional rendering of ChatScreen
│  │  └─ ChatScreen (src/screens/main/chat/ChatScreen.tsx)
│  │     ├─ uses chat socket + hooks (src/services/chat/chat.hooks.ts)
│  │     └─ uses socketService (src/services/socket/socket.service.ts)
│  └─ MainNavigator tab switching based on store flag
│     └─ MainNavigator (src/navigation/mainNavigation/MainNavigator.tsx)
│
└─ Call runtime
   └─ navigation.navigate('Call', ...) handled by useConsultationFlow
      └─ CallScreen (src/screens/main/call/CallScreen.tsx)
         └─ useCall() (src/services/call/call.hooks.ts)
            └─ WebRTC signaling and call store transitions
```

### 7.2 Key shared state dependencies
- `useChatStore` drives:
  - queue state
  - active/complete state
  - `shouldNavigateToChat`
  - store payload context

- `useCallStore` drives:
  - call status and WebRTC streams

- `socketService` is a cross-cutting dependency for:
  - chat sockets (global)
  - call queue management and call_request emission
  - message events

---

## 8. ProblemBasedAstroScreen Impact Assessment (if new screen reuses same chat/call needs)

Assume a new screen `ProblemBasedAstroScreen`:
- Displays only category-filtered astrologers.
- Must provide identical chat & call experience as `ChatCallScreen`.

### 8.1 What can be reused already
- **Reusable UI**
  - `AstrologerCard` can render the same card UI (if category screen maps astrologers into same card model).
  - `ChatRequestModal` can be used unchanged.
  - `LoginRequiredModal` can be used unchanged.

- **Reusable business logic**
  - `useConsultationFlow` + `sendChatRequest` should be reusable as they are centralized.
  - `socketService`, `useChatStore`, `useCallStore`, `ChatScreen`, `CallScreen` are reusable runtime layers.

### 8.2 What would likely be duplicated
If the new screen does not adopt `ChatCallScreen`’s internal boundaries, it may duplicate:
- action handlers:
  - auth gating `handleRestrictedAction`
  - set `consultationType` + `selectedAstrologer`
  - modal open/close
- mapping logic:
  - extracting pricing entries and producing card model
- list filtering/search:
  - if category filtering is layered on top of `useChatCall` filters, there may be duplicated state logic
- navigation coordination:
  - direct render of ChatScreen vs relying on tab navigation

### 8.3 Maintenance risks
- Store-driven transitions are subtle:
  - chat acceptance uses `shouldNavigateToChat` + chat status and roomId.
  - there are two socket listener systems (global + screen-level).
- If ProblemBasedAstroScreen manages chat transitions differently from ChatCallScreen, you can get:
  - double listeners
  - duplicate `ChatScreen` renders
  - race conditions between modal close and socket acceptance

---

## 9. Architecture Recommendations (No implementation; only boundaries)

### 9.1 Strengths in current architecture
- `useConsultationFlow` + `sendChatRequest` act as a conceptual “consultation orchestration boundary”.
- `ChatRequestModal` supports both chat and call via `type`.
- `ChatScreen` uses modular hooks:
  - sockets, timers, rating, recharge triggers.
- `CallScreen` encapsulates call UI and relies on `useCall` for signaling/WebRTC.

### 9.2 Weaknesses / coupling points
1. **Chat acceptance & navigation are split across multiple mechanisms**
   - `MainNavigator` reacts to `shouldNavigateToChat`
   - `ChatCallScreen` directly renders `ChatScreen` via local `showChatScreen` and `hasNavigatedRef`

2. **Socket listener duplication risk**
   - `socketService.ts` registers global chat listeners.
   - `useChatSocket` registers similarly named chat listeners again inside `ChatScreen`.
   - Multiple listener layers can produce unexpected state transitions.

3. **Call queue logic lives inside chat service**
   - `sendChatRequest` contains complex call queue management.
   - This is coupling between “consultation request” and “call queue lifecycle”.

4. **Astrologer mapping is embedded inside `ChatCallScreen`**
   - This makes reuse in new list screens more difficult unless a shared mapping layer exists.

### 9.3 Recommended reusable boundaries (conceptual)
- **Boundary A: “Consultation initiation”**
  - Centralize and reuse `useConsultationFlow` + `sendChatRequest` without duplicating UI state.

- **Boundary B: “Action gating”**
  - Auth gating should be consistent across screens (currently implemented in ChatCallScreen).

- **Boundary C: “Queue/acceptance → UI transition contract”**
  - Decide single source of truth for navigation/transition into chat.
  - Today it’s split across `MainNavigator` and `ChatCallScreen` direct rendering.

---

## 10. Final Summary


### A) What is already reusable
- `ChatRequestModal` (`src/components/Modal/ChatRequestModal.tsx`) for both chat and call.
- `AstrologerCard` for list rendering and chat/call button UI.
- `useConsultationFlow` + `sendChatRequest` as the orchestration mechanism.
- `ChatScreen` and `CallScreen` as runtime UI.
- Socket and stores:
  - `socketService`
  - `useChatStore`
  - `useCallStore`

### B) What is currently tightly coupled
- `ChatCallScreen` tightly couples:
  - astrologer API mapping
  - modal visibility state
  - navigation transition into chat
  - auth gating logic
- `sendChatRequest` tightly couples:
  - chat intake creation + chat queue + call queue management

### C) What should be isolated before multiple astrologer-list screens are added
- A single “consultation action facade” for list screens:
  - unify auth gating + open modal + call `useConsultationFlow`
- A single “chat transition contract”:
  - avoid double navigation logic between MainNavigator and ChatCallScreen direct rendering
- A shared “astrologer-to-card model mapper” boundary:
  - so ProblemBasedAstroScreen can reuse card-ready shape without reimplementing mapping.

### D) Estimated effort required for proper reuse (analysis-level estimate)
Given the current architecture, reuse is possible but fragile.
- Low effort if ProblemBasedAstroScreen:
  - fully reuses `AstrologerCard` + `ChatRequestModal` + `useConsultationFlow`
  - delegates chat/call state transitions entirely to existing store logic
- Medium effort if it must replicate ChatCallScreen’s local transition approach (direct ChatScreen rendering + `hasNavigatedRef`).
- Higher effort if it adds additional socket listener wiring or duplicates navigation triggers.

Primary cost driver is reducing duplication around:
- auth gating
- modal state + selected astrologer
- navigation transition into chat
- call queue readiness handling.

