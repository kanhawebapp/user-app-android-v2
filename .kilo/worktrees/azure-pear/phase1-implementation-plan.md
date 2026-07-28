# Phase-1 Implementation Plan (MINIMAL RISK)

## Goal
Allow the following screens to use the exact same consultation flow:

- ChatCallScreen
- ProblemBasedAstroScreen

without duplicating:
- Chat button logic
- Call button logic
- Login gating
- Modal state
- Selected astrologer state
- Consultation submission flow

while keeping:
- APIs unchanged
- Socket logic unchanged
- Stores unchanged
- ChatScreen unchanged
- CallScreen unchanged

## Scope Constraints (Phase-1)
- **LOW-RISK refactor only**: restructure responsibility boundaries without changing runtime behavior.
- **Frozen files (do not modify in Phase-1)**
  - socket.service.ts
  - chat.service.ts
  - chat.store.ts
  - call.store.ts
  - chat.hooks.ts
  - call.hooks.ts
  - ChatScreen.tsx
  - CallScreen.tsx

This document proposes **architecture and responsibility movement only** (no code).

---

## 0) Information Gathered (from current code)

### ChatCallScreen (`src/screens/main/chatcall/index.tsx`)
Current responsibilities include:
- Builds/normalizes astrologer list for UI.
- Uses `useChatCall(astrologers)` for UI filtering/search.
- Owns **modal presentation state**:
  - `showLoginModal`, `modalMessage`
  - `showChatRequestModal`, `selectedAstrologer`, `consultationType`, and `showChatScreen`
- Owns **auth gating** via local `handleRestrictedAction`.
- Owns **queue-to-navigation rendering bridge**:
  - Watches `chatStatus === 'active'` and `roomId`
  - Sets `showChatScreen(true)` and renders `ChatScreen` directly.
- Owns **consultation submission orchestration**:
  - Uses `useConsultationFlow()` and calls `submitConsultationRequest({ astrologer, consultationType, formData, onClose })`.

### ProblemBaseAstroScreen (`src/screens/main/ProblemBaseAstroScreen.tsx`)
Current responsibilities include:
- Fetches astrologers via `useAstrologers()`.
- Applies **category skill filtering** (local `CATEGORY_SKILL_MAP`).
- Renders list cards.
- The current screen does **not** implement the consultation flow (no chat/call buttons wired to modals/submit).

### ChatRequestModal (`src/components/Modal/ChatRequestModal.tsx`)
- Owns the **birth details intake UX** and performs only form validation + calls `onSubmit(data)`.
- It also has a `type` prop (`chat` or `call`) and triggers dynamic import for call screen when `type === 'call'`.

### MainNavigator (`src/navigation/mainNavigation/MainNavigator.tsx`)
- Owns chat tab switching when `useChatStore.state.shouldNavigateToChat` is true and `roomId` exists.
- Separately also renders `ProblemBaseAstroScreen` when `isProblemBaseAstroScreenVisible` is true.

---

## 1) Exact Files To Modify (Phase-1)

1. **`src/screens/main/chatcall/index.tsx`**
   - **Current responsibility:** Entire consultation flow: modal state, auth gating, selected astrologer state, submission orchestration, and queue-to-UI transition.
   - **New responsibility:** Keep list/filter/search + presentation UI; delegate consultation initiation + modal coordination to a reusable consultation layer.
   - **Reason for change:** To remove duplicated consultation-flow logic and make ChatCallScreen share the exact same initiation contract as ProblemBasedAstroScreen.

2. **`src/screens/main/ProblemBaseAstroScreen.tsx`**
   - **Current responsibility:** Category filtering + list rendering only; no wired consultation flow.
   - **New responsibility:** Keep category filtering + list UI; delegate consultation initiation (chat/call) + modal presentation coordination to the same reusable consultation layer contract used by ChatCallScreen.
   - **Reason for change:** To enable ProblemBasedAstroScreen to trigger the same chat/call flow without re-implementing button logic, auth gating, modal state, or submission orchestration.

3. **(New file) `src/screens/main/consultation/ConsultationFlowLayer.tsx` (name placeholder)**
   - **Current responsibility:** (Not existing)
   - **New responsibility:** Provide a reusable “consultation initiation facade” responsible for:
     - keeping/owning the shared state needed to coordinate modal + selected astrologer + consultation type
     - exposing handlers like `onStartChat(astrologer)` and `onStartCall(astrologer)`
     - owning the `submitConsultationRequest` call into `useConsultationFlow`
     - ensuring login gating is performed consistently
   - **Reason for change:** Both screens must use a single, shared consultation orchestration boundary to prevent duplication.

> Note: Phase-1 requires only responsibility extraction; the actual file/module name can be adjusted to match repo conventions.

---

## 2) Exact Files To Leave Untouched (Phase-1)

These files must remain unchanged to satisfy the “frozen constraints”:
- `socket.service.ts`
- `chat.service.ts`
- `chat.store.ts`
- `call.store.ts`
- `chat.hooks.ts`
- `call.hooks.ts`
- `ChatScreen.tsx`
- `CallScreen.tsx`

Additional “do not change” guidance (not strictly frozen by your constraints, but required by LOW-RISK approach):
- **`src/components/Modal/ChatRequestModal.tsx`**
  - Reason: Its intake UX and `type` behavior are already working; keeping it frozen ensures the refactor only affects orchestration.
- **`src/navigation/mainNavigation/MainNavigator.tsx`**
  - Reason: Chat navigation behavior exists and must not regress.

(If you later approve higher phases, we can rationalize navigation ownership more aggressively.)

---

## 3) Consultation Layer Extraction Plan (Responsibility Movement Only)

### 3.1 Logic currently inside `ChatCallScreen` to move into reusable consultation layer
Move responsibility (not code) for:
1. **Auth gating for consultation start**
   - The logic inside `handleRestrictedAction` that checks `isAuthenticated` and opens `LoginRequiredModal`.
2. **Consultation initiation state**
   - `consultationType` (`'chat' | 'call'`)
   - `selectedAstrologer`
   - `showChatRequestModal`
3. **Modal submission orchestration**
   - Using `useConsultationFlow()`
   - Calling `submitConsultationRequest({ astrologer, consultationType, formData, onClose })`
   - Closing the modal and clearing selected astrologer on completion
4. **Modal message selection**
   - The `modalMessage` computation for login required

### 3.2 Logic that should remain inside `ChatCallScreen`
Keep responsibility for:
- **Astrologer list/search/filter UI** driven by `useChatCall(astrologers)`
- The **AstrologerCard rendering wiring** (passing handlers like `onChatPress` and `onCallPress` to the card)
- The **Chat UI rendering trigger bridge** (queue → render `ChatScreen`) for Phase-1 safety, unless the architecture decision is to fully delegate this to a later phase

### 3.3 Logic that should remain inside `ProblemBasedAstroScreen`
Keep responsibility for:
- **Category filtering** (`CATEGORY_SKILL_MAP` + `filteredAstrologers`)
- The **header/banner/list UI**
- Provide button handlers that call the consultation layer’s `startChat/startCall` contract

---

## 4) Modal Ownership Plan

### Current owners (as-is)
- `ChatRequestModal`
  - **Owner:** `ChatCallScreen` (state: `showChatRequestModal`, `selectedAstrologer`, `consultationType`)
  - Also similar concept exists in `HomeScreen` via its local `showChatRequestModal`, `consultationType`, and `chatTargetAstrologer`.

- `LoginRequiredModal`
  - **Owner:** `ChatCallScreen` (state: `showLoginModal`, `modalMessage`)
  - Also similar concept exists in `HomeScreen`.

- `selectedAstrologer`
  - **Owner:** `ChatCallScreen` local state
  - Additionally mirrored in `useChatStore.state.selectedAstrologer` for rendering safety.

- `consultationType`
  - **Owner:** `ChatCallScreen` local state

- Modal open/close state
  - **Owner:** `ChatCallScreen` local state for both modals

### Future owners (target after Phase-1)
- `ChatRequestModal`
  - **Future owner (presentation):** The reusable **Consultation Layer** wrapper/module (it owns visibility + passes required props)
  - **Still receives:** `ChatRequestModal` remains unchanged

- `LoginRequiredModal`
  - **Future owner:** Same reusable Consultation Layer

- `selectedAstrologer`
  - **Single source rule for orchestration:** Consultation Layer owns the “selected for request” value while modal is open.
  - **Store remains authoritative for active session rendering**: `useChatStore.state.selectedAstrologer` remains used by `ChatCallScreen` (unchanged in Phase-1).

- `consultationType`
  - **Owner:** Consultation Layer

- Modal open/close state
  - **Owner:** Consultation Layer

---

## 5) Screen Responsibilities After Phase-1

### 5.1 ChatCallScreen should do
- Render astrologer list UI (including search + filters).
- Use Consultation Layer-provided callbacks:
  - When user taps Chat/Call on an astrologer card, invoke consultation layer initiation (no local duplication of login gating/modal/submission).
- Keep the existing queue acceptance → `ChatScreen` rendering bridge for safety.
- Continue to read from store for `roomId`, `chatStatus`, and `userData` (frozen store logic).

### 5.2 ProblemBasedAstroScreen should do
- Render category header/banner and filtered list.
- When user taps Consult on a card:
  - Present the same consultation flow as ChatCallScreen by calling Consultation Layer `startChat/startCall` depending on the intended UX (or by choosing a single “Consult” path that defaults to the correct type, consistent with product requirements).
- Keep category filtering logic local.

### 5.3 Consultation Layer should do
- Provide a single shared consultation initiation contract usable by both screens:
  1. Auth gating (open LoginRequiredModal if unauthenticated)
  2. Capture consultation context: consultation type + selected astrologer
  3. Open/close ChatRequestModal consistently
  4. Call `useConsultationFlow().submitConsultationRequest` with the exact payload contract expected
  5. Ensure completion closes modal and clears orchestration state

---

## 6) Astrologer Mapping Strategy

### Current astrologer mapping logic
- **ChatCallScreen:** maps API `data` into a UI astrologer structure with:
  - pricing extraction for CHAT/CALL
  - default availability flags
  - normalizing fields like `chatRate`, `callRate`, `experience`, `skills`, `languages`, etc.

- **ProblemBaseAstroScreen:** does not normalize pricing/availability; it filters by `astrologer.skills` using `CATEGORY_SKILL_MAP`.

### Whether it should be reused
- **Category filtering** (ProblemBaseAstroScreen) should remain local because it is category-specific.
- **UI mapping for rates/availability** is ChatCallScreen-specific today.

### Whether it should be extracted
- Phase-1 extraction target is **consultation initiation orchestration**, not list normalization.
- However, both screens must supply the “selected astrologer” object expected by `ChatRequestModal`/`submitConsultationRequest`.

### Which screen should own filtering
- **ProblemBasedAstroScreen** owns category filtering.

### Which screen should own category filtering
- **ProblemBasedAstroScreen** owns category filtering (skills → category skill map).

---

## 7) Migration Order (Exact Steps + Risk Levels)

Step 1 (Low): Add the reusable Consultation Layer wrapper/module contract (no behavior change)
- Create the abstraction boundary (even if it internally delegates to existing hooks/state at first).
- Ensure it exposes a stable interface for:
  - `startChat(astrologer)`
  - `startCall(astrologer)`
  - modal rendering coordination

Step 2 (Low): Refactor ChatCallScreen to delegate consultation initiation to the Consultation Layer
- Remove duplicated local states for:
  - `showLoginModal`, `modalMessage`
  - `showChatRequestModal`, `selectedAstrologer`, `consultationType`
  - `submitConsultationRequest` call wiring
- Keep:
  - list/search/filter UI
  - queue acceptance → `ChatScreen` rendering bridge

Step 3 (Low): Refactor ProblemBasedAstroScreen to integrate the same Consultation Layer
- Wire card “Consult” action(s) to the Consultation Layer callbacks.
- Keep category filtering and list rendering.

Step 4 (Medium): Validate navigation/queue transitions across both entry screens
- Confirm that after acceptance the app transitions exactly as it does today for ChatCallScreen.

Step 5 (Medium): Remove any remaining duplicated consultation initiation logic in ProblemBasedAstroScreen and ChatCallScreen
- Ensure both screens share the same orchestration boundary.

---

## 8) Rollback Plan

If Phase-1 causes issues:

### Safely revert (isolated)
- Revert changes in:
  - `src/screens/main/ProblemBaseAstroScreen.tsx`
  - `src/screens/main/chatcall/index.tsx`

Because these are UI-layer responsibility changes.

### Risky
- Any partial changes that alter:
  - how `ChatCallScreen` decides to render `ChatScreen`
  - how `shouldNavigateToChat` is handled in MainNavigator

### Isolated (non-frozen)
- The new Consultation Layer module/file can be deleted or restored easily because it doesn’t touch frozen socket/services/stores.

---

## 9) Success Criteria (Measurable)

1. **Chat works from both screens**
   - User starts chat from ChatCallScreen → receives ChatRequestModal → request submission succeeds → Chat UI appears.
   - User starts chat from ProblemBasedAstroScreen → same flow works.

2. **Call works from both screens**
   - If ProblemBasedAstroScreen exposes a call path (chat/call choice), call initiation works with the same orchestration.

3. **Login gating works consistently**
   - If unauthenticated, both screens show LoginRequiredModal with correct message.

4. **No frozen layer regression**
   - Confirm:
     - No changes to socket logic
     - No changes to stores
     - No changes to ChatScreen/CallScreen

5. **No navigation regressions**
   - After acceptance, chat UI transitions exactly once.

---

## Phase-1 Deliverable
- `phase1-implementation-plan.md` created/updated with the above architecture plan.

