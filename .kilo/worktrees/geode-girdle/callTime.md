# Call Timer Running Faster Than Real Time - Root Cause Analysis

## Executive Summary

**Root Cause:** The call timer runs approximately 2x faster than wall clock time due to **duplicate `setInterval` timers being created when `status` transitions to `'connected'` multiple times during the WebRTC connection flow.**

---

## Investigation Date
2026-05-25

## Symptom Description
- Call timer UI displays correctly
- Initial time from backend is correct
- But countdown decreases too fast: 2 real seconds reduce in ~1 second
- Timer runs approximately 2x faster than actual wall clock time

---

## Complete Timer Lifecycle Analysis

### 1. Zustand Timer State Flow

**Primary Store: `src/services/call/call.store.ts`**
```typescript
// Line 33: Initial state
callDurationRemaining: 0,

// Lines 48-49: Setter
setCallDurationRemaining: callDurationRemaining =>
  set({ callDurationRemaining }),

// Line 50: Reset
resetCallTimer: () => set({ callDurationRemaining: 0 }),
```

**Duplicate Store Found: `src/stores/call.store.ts`**
- This is a SEPARATE store file with identical state shape
- Exported from `src/stores/index.ts` line 16
- Both stores implement `callDurationRemaining` independently

### 2. Timer Creation Flow - `setInterval` Calls

**File: `src/services/call/call.hooks.ts` (Lines 98-132)**
```typescript
useEffect(() => {
  if (status !== 'connected') {
    return;
  }

  console.log('[Timer] Connected — starting countdown');

  countdownTimerInterval.current = setInterval(() => {
    const remaining = useCallStore.getState().callDurationRemaining;
    // ...
    setCallDurationRemaining(remaining - 1);
  }, 1000);

  return () => {
    if (countdownTimerInterval.current) {
      clearInterval(countdownTimerInterval.current);
      countdownTimerInterval.current = null;
    }
  };
}, [status, setCallDurationRemaining]);
```

### 3. WebRTC Status Flow - Where `connected` is Emitted

**File: `src/services/call/webrtc.service.ts`**

**Location 1 - Line 457 (Inside `ontrack` callback):**
```typescript
(pc as any).ontrack = (event: any) => {
  // ... remote stream handling ...
  this.emitState('connected');  // <-- Status set to 'connected'
};
```

**Location 2 - Line 837 (Inside `toggleMute` method):**
```typescript
toggleMute(): boolean {
  // ...
  this.emitState('connected');  // <-- Status set to 'connected' AGAIN
  return !newState;
}
```

### 4. State Callback Registration

**File: `src/services/call/call.hooks.ts` (Lines 54-91)**
```typescript
useEffect(() => {
  setupWebRTCListeners();

  webRTCService.setStateCallback(state => {
    useCallStore.setState({
      localStream: state.localStream,
      remoteStream: state.remoteStream,
      isMuted: state.isMuted,
      error: state.error,
      status: state.status,  // <-- This triggers the countdown effect
    });
    if (state.status === 'connected') {
      stopRingbackSafely();
    }
  });

  return () => {
    signalingService.unregisterListeners();
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    if (countdownTimerInterval.current) {
      clearInterval(countdownTimerInterval.current);
    }
  };
}, [setCallDurationRemaining, resetCallTimer]);  // <-- Only runs ONCE on mount
```

### 5. Socket Event Flow

**File: `src/services/socket/socket.service.ts`**
- `setupWebRTCListeners()` is called ONCE during hook initialization
- Socket listeners are registered with guards to prevent duplicates
- However, the WebRTC `'connected'` status can be emitted multiple times

---

## Root Cause Identification

### The Core Problem: Multiple `connected` Status Emissions

The `webRTCService.emitState('connected')` is called from **TWO locations**:

1. **Line 457** - When remote stream is received (`ontrack` event) - This is the CORRECT trigger
2. **Line 837** - Inside `toggleMute()` method - This is HIGHLY SUSPICIOUS

**Evidence of problematic code (line 837):**
```typescript
toggleMute(): boolean {
  // ...
  const newState = !audioTrack.enabled;
  audioTrack.enabled = newState;
  InCallManager.setMicrophoneMute(!newState);
  this.emitState('connected');  // <-- WHY is this here? Bug!
  return !newState;
}
```

### Why This Causes 2x Speed

1. When `status` becomes `'connected'` the first time:
   - `setInterval` starts counting down every 1000ms
   - Timer interval reference stored in `countdownTimerInterval.current`

2. When `status` becomes `'connected'` a SECOND time (from `toggleMute`):
   - The effect's dependency `[status, setCallDurationRemaining]` triggers
   - **BUT** the cleanup function only runs when the component UNMOUNTS or status changes to non-'connected'
   - Since status is still 'connected', no cleanup occurs
   - NEW `setInterval` is created and assigned to `countdownTimerInterval.current`
   - OLD interval is LOST (reference overwritten) but still running!

3. Result: **Two intervals decrementing the same counter every 1000ms** = 2x speed

---

## Exact Event Chain Leading to Duplicate Intervals

```
1. Call connects -> status = 'calling' -> 'connecting' -> 'connected'
   |
   v
2. WebRTC ontrack fires -> emitState('connected') [Line 457]
   |
   v
3. useCall hook effect triggers -> setInterval created (Interval #1)
   |
   v
4. User mutes call during conversation -> toggleMute() called
   |
   v
5. toggleMute() calls emitState('connected') [Line 837] - BUG!
   |
   v
6. useCall hook effect sees status='connected' (still true)
   |
   v
7. NO CLEANUP (old interval still running) -> NEW setInterval created (Interval #2)
   |
   v
8. Both intervals decrement callDurationRemaining every second
   |
   v
9. Timer runs 2x faster
```

---

## Additional Concerns

### Duplicate Store Issue

**File: `src/stores/call.store.ts`** - This is a completely separate store from `src/services/call/call.store.ts`

- Same state shape with `callDurationRemaining`
- Both exported from `src/stores/index.ts`
- Could cause confusion if different parts of app import different stores
- The `useCallStore` in `call.hooks.ts` imports from `./call.store` (the correct one)

### Stale Closure Risk

In `call.hooks.ts` line 106:
```typescript
const remaining = useCallStore.getState().callDurationRemaining;
```
- This correctly uses `getState()` inside the interval callback
- Not a source of the current bug, but good practice confirmed

---

## Reproduction Flow

1. User initiates a call
2. Call connects successfully (status becomes 'connected')
3. Timer starts (1 interval)
4. User mutes/unmutes microphone during call
5. `toggleMute()` calls `emitState('connected')` 
6. Second interval is created without cleaning up first
7. Timer now runs 2x speed
8. Each subsequent mute operation adds another interval (3x, 4x, etc.)

---

## Conclusion

### Exact Root Cause
**File:** `src/services/call/webrtc.service.ts`
**Line:** 837
**Code:** `this.emitState('connected');` inside `toggleMute()` method

This line incorrectly emits `'connected'` status every time the user toggles mute, causing the countdown effect in `useCall()` to create additional `setInterval` timers without cleaning up previous ones.

### Fix Required
Either:
1. Remove `this.emitState('connected');` from `toggleMute()` (recommended - mute state change doesn't warrant status change)
2. OR change to `this.emitState('connected');` with only the muted state update, not the full status reset

### Secondary Issue
The duplicate `useCallStore` in `src/stores/call.store.ts` should be investigated for removal or renaming to avoid confusion.

---

## Debug Logging Plan (For Verification)

Add temporary logs to verify:

```typescript
// In call.hooks.ts, countdown effect:
useEffect(() => {
  if (status !== 'connected') {
    return;
  }

  console.log('[Timer] Connected — starting countdown, current remaining:', 
    useCallStore.getState().callDurationRemaining);
  console.log('[Timer] Active intervals count (should be 1):', 
    countdownTimerInterval.current ? '1+' : '0');

  countdownTimerInterval.current = setInterval(() => {
    const remaining = useCallStore.getState().callDurationRemaining;
    console.log('[Timer Tick]', {
      remaining,
      now: Date.now(),
      intervalId: countdownTimerInterval.current,
    });
    setCallDurationRemaining(remaining - 1);
  }, 1000);
  // ...
}, [status, setCallDurationRemaining]);

// In webrtc.service.ts, toggleMute:
toggleMute(): boolean {
  // ...
  console.log('[WebRTC] toggleMute called - should NOT emit connected');
  // this.emitState('connected');  // COMMENTED OUT FOR TEST
  return !newState;
}
```