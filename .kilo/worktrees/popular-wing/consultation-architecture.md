# Consultation Architecture — Ownership Model (Chat + Call)

> Document purpose: define an ideal ownership model (who is responsible for what) for the consultation experience in DhwaniAstro.
> 
> Constraints: **no code changes**, **no refactors**, **no implementation**. This is only architecture documentation.

---

## 0. Scope & Terminology

**Consultation** covers both:
- **Chat initiation** → opening intake + requesting chat queue
- **Call initiation** → opening intake + requesting call queue + transitioning into the call UI
- **Modal state** → the “birth details / recent intake” modal flow
- **Selected astrologer state** → which astrologer the user is consulting with
- **Consultation request submission** → intake creation + socket emission
- **Queue handling** → waiting, queue position updates, acceptance/rejection transitions
- **Chat navigation** → showing the chat UI (tab vs direct render)
- **Call navigation** → navigating to the Call screen / call UI

**“Owner”** means the component/module that should hold the responsibility and drive the state changes.

---

## 1. Ownership Responsibilities (Current vs Recommended)

> Where “Current owner” is inferred from the existing codebase structure provided in the analysis, the doc still recommends a target ownership model. If current differs, the recommended owner remains the goal.

### 1.1 Chat initiation
- **Current owner:** `src/screens/main/chatcall/index.tsx` (ChatCallScreen) + `useConsultationFlow` (submission orchestration)
- **Recommended owner:** **Consultation Layer (facade/handoff)** — ideally a single orchestration entry (e.g., `submitConsultation(type='chat', ...)`) exposed to list screens
- **Reasoning:** Chat initiation requires coordinating:
  - auth gating
  - selected astrologer
  - consultationType
  - modal visibility
  - submission side effects
  Putting these in one orchestration boundary reduces divergence across screens.
- **Risk if ownership remains split:**
  - multiple screens implement “chat” initiation differently
  - inconsistent modal close timing
  - store state gets partially updated, causing chat UI to render in the wrong phase

### 1.2 Call initiation
- **Current owner:** `src/screens/main/chatcall/index.tsx` (ChatCallScreen) + `useConsultationFlow` + call queue logic inside `src/services/chat/chat.service.ts`
- **Recommended owner:** **Consultation Layer** (same boundary as chat initiation) with an internal call-queue sub-orchestrator
- **Reasoning:** Call initiation is more complex (queue resolution determines call vs queue bubble), so it must be centralized. Screens should only trigger “start call consultation” and supply inputs.
- **Risk if ownership remains split:**
  - queue-resolution and navigation become inconsistent across entry screens
  - call may transition too early/late relative to socket acceptance

### 1.3 Modal state
- **Current owner:** `ChatCallScreen` local `useState` (`showChatRequestModal`, `consultationType`, `selectedAstrologer`, `showLoginModal`)
- **Recommended owner:**
  - **Primary:** Screen-specific UI component owns **visibility** and **local UI state** for modal presentation
  - **Secondary (shared):** stores/services own the **consultation context** (selected astrologer, consultation type, user payload), not the open/close toggles
- **Reasoning:**
  - Modal is presentation-state; screens own open/close
  - But the modal needs stable context shared across submission + socket transitions
- **Risk if ownership remains split:**
  - stale selected astrologer when socket acceptance arrives
  - race conditions when unmounting modal before submission pipeline completes

### 1.4 Selected astrologer state
- **Current owner:**
  - Local component state `selectedAstrologer`
  - Additionally store context `useChatStore.state.selectedAstrologer` (used by ChatCallScreen for rendering)
- **Recommended owner:** **Store** is the single source of truth for the **selected astrologer context** during an active/queued consultation
- **Reasoning:** When queue/acceptance is async, relying on local state is fragile. Store context lets the chat/call UI render reliably when the socket event arrives.
- **Risk if ownership remains split:**
  - modal submits with one astrologer but queue acceptance updates for another
  - chat/call screen displays wrong astrologer details

### 1.5 Consultation request submission
- **Current owner:** `useConsultationFlow` (screen-level hook) calling `sendChatRequest` in `src/services/chat/chat.service.ts`
- **Recommended owner:** **Consultation Layer (business logic)** — one boundary responsible for:
  - create intake
  - construct intake payload
  - connect socket
  - emit the correct request events
  - update store state to the correct initial queue/waiting phase
- **Reasoning:** This is the highest coupling area (intake + socket + store staging + queue initiation). It must be centralized.
- **Risk if ownership remains split:**
  - inconsistent payload formatting
  - duplicated socket emissions
  - store transitions not matching what chat/call UI expects

### 1.6 Queue handling
- **Current owner:**
  - Chat queue events appear handled via socket listeners updating chat store (global in socket service and/or screen-level hooks)
  - Call queue resolution appears to be embedded in `sendChatRequest` (chat service)
- **Recommended owner:** **Queue Handler (Consultation Layer / Socket Orchestrator)**
  - **Global socket listener** owns queue-event normalization
  - **Store** owns queue state (position/status/timers)
  - **Screens** only render derived UI
- **Reasoning:** Queue semantics are not UI concerns. They are domain state transitions.
- **Risk if ownership remains split:**
  - duplicate listeners produce double transitions (queued → active twice)
  - timers start/stop inconsistently
  - acceptance event triggers navigation before store is ready

### 1.7 Chat navigation
- **Current owner:** Split between:
  - store-driven navigation in `MainNavigator` (via `shouldNavigateToChat`)
  - direct render inside `ChatCallScreen` (local `showChatScreen` guarded by `hasNavigatedRef`)
- **Recommended owner:** **Single navigation contract**:
  - Either: **MainNavigator owns tab navigation**
  - Or: **ChatCallScreen owns direct render**
  - Not both.
  Store should only expose state such as `chatStatus`, `roomId`, `shouldNavigateToChat`.
- **Reasoning:** Navigation is cross-cutting; split navigation logic causes duplicated renders.
- **Risk if ownership remains split:**
  - double-rendering ChatScreen
  - inconsistent back navigation behavior
  - hard-to-reproduce bugs due to timing (queue acceptance race)

### 1.8 Call navigation
- **Current owner:** `useConsultationFlow` decides `navigation.navigate('Call', ...)` based on queue readiness
- **Recommended owner:** **Consultation Layer navigation decision** (still centralized) or **MainNavigator route switch** (preferred if consistent with architecture), but always single-owner
- **Reasoning:** Call transition is queue-dependent. Keeping the decision in one orchestration layer prevents divergence.
- **Risk if ownership remains split:**
  - call screen navigates while still queued
  - call screen receives incomplete params (callId/participant)

---

## 2. What Belongs Where (Reusable Consultation Layer vs Screen/Store/Services)

### 2.1 What should belong to a **reusable Consultation Layer**
This layer should be reusable across any screen that can start a chat/call.

**Include:**
1. **Consultation entrypoints**
   - `startChatConsultation(astrologerContext, formData)`
   - `startCallConsultation(astrologerContext, formData)`
2. **Consultation request submission pipeline**
   - build/validate intake payload
   - create intake API call
   - socket connect + emit request events
3. **Queue initialization & handling rules**
   - decide initial store phase (e.g., waiting/queued)
   - normalize queue events into store transitions
4. **Queue → acceptance transition contract**
   - what must be true in store for chat/call UI to transition
   - when to set flags like `shouldNavigateToChat` / `shouldNavigateToCall`
5. **Navigation decision contract**
   - either: produce navigation intents for a single navigation owner
   - or: own navigation directly (but then the nav owner must not be duplicated elsewhere)

**Exclude:**
- list search/filter UI state
- modal visibility state local to a screen
- chat message rendering UI
- call UI controls (mute/speaker/WebRTC specifics)

### 2.2 What should remain **screen-specific**
Each entry screen may present the astrologers and show presentation-level state.

**Keep in screen:**
- list/search UI (query, chips, filters)
- modal visibility toggles (open/close)
- local animation state specific to presentation
- wiring callbacks from buttons to Consultation Layer entrypoints
- “back button” UI behavior for the screen itself

**Do not keep in screen:**
- socket event semantics
- queue transition logic
- intake payload construction
- global store staging rules

### 2.3 What should remain inside **ChatScreen**
**Keep in ChatScreen:**
- rendering of messages, typing indicator UI, end/chat UI components
- Chat-specific UI composition (header, composer, rating/recharge modals)
- calling chat hooks for:
  - UI actions (send message, leave, complete)
  - message rendering state derivation

**ChatScreen should depend on: 
- store state** for room/chat status
- socket services** for message events** (but not queue semantics)

**Avoid in ChatScreen:**
- ownership of queue state transitions for acceptance
- deciding when navigation should happen (should be driven by store contract)

### 2.4 What should remain inside **CallScreen**
**Keep in CallScreen:**
- rendering call UI (ringing/connecting/connected controls)
- display of participant info
- wiring UI buttons to call hooks (end, cancel, mute, speaker)

**Avoid in CallScreen:**
- queue resolution rules (queued vs calling)
- intake payload construction

### 2.5 What should remain inside **stores**
Stores must represent **domain state** needed across components.

**Inside stores (recommended):**
- **Consultation context**:
  - selected astrologer (source of truth)
  - consultationType (chat/call)
  - roomId/callId mapping (as appropriate)
  - userPayload needed for chat/call UI
- **Chat store**:
  - chatStatus lifecycle (queued/waiting/active/completed/rejected)
  - queue data snapshot (position/waitTime)
  - timer state needed by UI (or derived contract)
  - chat messages + typing state
- **Call store**:
  - call status lifecycle (initiated/calling/connecting/connected/ended/rejected)
  - RTC connection status (muted/speaker/local/remote streams)
  - call timers relevant to UI

**Avoid in stores:**
- UI visibility state (modal open/close)
- navigation logic side effects
- socket event registration/unregistration

### 2.6 What should remain inside **socket services**
Socket services must own:
- connection lifecycle
- event registration (global listeners)
- event normalization into store updates (or dispatching to store actions)

**Socket services should include:**
- registering server event names and mapping into domain events
- preventing duplicate listeners (single source of truth)
- guaranteeing idempotent updates

**Avoid in socket services:**
- UI decisions (what screens to show)
- list/search/filter UI concerns

---

## 3. Target Architecture Diagram (Ownership View)

```text
+--------------------------------------------------------------+
|                        Entry Screen(s)                      |
|  - Astrologer list/search/filter UI                          |
|  - Auth gating UI (login modal visibility)                  |
|  - ChatRequestModal visibility + presentation state       |
|  - Calls Consultation Layer entrypoints                     |
+-------------------------------+------------------------------+
                                |
                                | startChat/startCall + formData
                                v
+--------------------------------------------------------------+
|                Consultation Layer (Reusable)                |
|  - intake creation & validation                             |
|  - socket connect & emit consultation requests            |
|  - queue handler rules & acceptance contract              |
|  - sets store context + emits intents/flags for nav        |
+-------------------------------+------------------------------+
                                |
                                | global realtime events
                                v
+--------------------------------------------------------------+
|                       Socket Services                       |
|  - socket lifecycle/connectAndWait                          |
|  - global server listener registration                      |
|  - normalize queue/message/call signaling events          |
|  - dispatch results into stores                            |
+-------------------------------+------------------------------+
                                |
                                v
+-------------------------+----------------------+--------------+
|        Stores           |                      |             |
|  - Chat Store           |  - Call Store        |             |
|    queue + room state   |  call + RTC state   |             |
|    messages/typing       |                      |             |
+-------------------------+----------------------+--------------+
                                |
                                | derived state
                                v
+-------------------------+----------------------+--------------+
|              Navigation Layer / Router                      |
|  - Single navigation contract for Chat + Call              |
+-------------------------+----------------------+--------------+
                                |
                                v
+--------------------------------------------------------------+
|                          ChatScreen                           |
|  - message rendering + typing UI                             |
|  - chat actions via chat hooks (send/leave/complete)        |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
|                           CallScreen                          |
|  - call UI controls (end/cancel/mute/speaker)              |
|  - depends on useCall hook for WebRTC lifecycle            |
+--------------------------------------------------------------+
```

---

## 4. Migration Phases (No Implementation — Target Roadmap)

### Phase 1 — Freeze current contracts (documentation only)
- Confirm and document:
  - exact store fields used for queue/acceptance
  - navigation triggers currently used for chat/call
  - which modules register which socket listeners

**Exit criteria:** ownership map is validated by the team against actual runtime.

### Phase 2 — Consolidate Consultation Layer responsibilities
- Create a single conceptual “consultation entrypoint” contract (even if implemented later) that screens call.
- Ensure intake + socket emission live in that boundary.

**Exit criteria:** screens stop owning request submission semantics.

### Phase 3 — Single queue listener ownership
- Decide and enforce single listener strategy:
  - global socket service only
  - or screen hooks only
  - not both

**Exit criteria:** no duplicated queue/acceptance transitions.

### Phase 4 — Single navigation contract
- Choose one:
  - store → MainNavigator tab navigation
  - OR store → ChatCallScreen direct render
- Ensure the other mechanism no longer drives UI transitions.

**Exit criteria:** chat renders exactly once on acceptance.

### Phase 5 — Align Call queue → navigation contract
- Centralize call queue readiness → navigation to CallScreen through one owner.

**Exit criteria:** call screen never navigates while queued state is unresolved.

---

## 5. Refactor Order (From least risky to highest risk)

> Even though implementation is out of scope, this is the order recommended if refactoring is later approved.

1. **Define/lock the Consultation Layer interface** (read-only; documentation + API contract)
2. **Move/centralize intake & socket emission logic** behind the Consultation Layer
3. **Unify queue listener ownership** (remove duplication)
4. **Unify navigation contract for Chat**
5. **Unify navigation contract for Call**
6. **Harden store context as single source of truth** (selected astrologer, room/call ids)

---

## 6. Risk Assessment (If ownership stays split)

### 6.1 Duplicated socket listeners
- **Symptoms:** double transitions (queued→active twice), repeated timers, repeated message append.
- **Severity:** high (user-visible, timing-dependent bugs)

### 6.2 Split navigation logic
- **Symptoms:** ChatScreen renders twice, back navigation inconsistencies, blank screen when one mechanism triggers before store is ready.
- **Severity:** high (navigation timing + async state)

### 6.3 Split consultation context
- **Symptoms:** selected astrologer mismatch between modal submission and socket acceptance.
- **Severity:** critical (wrong astrologer data is a trust issue)

### 6.4 Queue semantics in UI screens
- **Symptoms:** screens re-implement queue logic slightly differently; different screens behave inconsistently.
- **Severity:** medium→high (depends on number of screens using the flow)

---

## Appendix A — Final “Single Source of Truth” Rules

1. **Selected astrologer context**: store-owned during an active/queued consultation.
2. **Intake + socket emission**: Consultation Layer-owned.
3. **Queue semantics**: Socket/Consultation Layer-owned, with store as the state snapshot.
4. **Navigation decisions**: exactly one navigation owner for chat and one for call.
5. **Chat and Call screens**: render UI from store + provide user actions; do not own queue semantics.
