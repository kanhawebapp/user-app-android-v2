# Socket Implementation Documentation

## Overview

The DhwaniAstro app uses **Socket.IO Client v4.8.3** for real-time bidirectional communication between the mobile app and the backend server. The primary use case is handling chat requests and establishing real-time chat sessions between users and astrologers.

**Current Status:** The socket implementation has a critical integration bug where the `socketService` singleton is never initialized with the actual socket instance created by `SocketProvider`. This means all calls to `socketService.emit()` fail silently.

---

## Architecture

### High-Level Flow

```
┌─────────────────┐
│   App.tsx       │
│   (entry point) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  SocketProvider         │
│  (Context Provider)     │
│  - Creates socket       │
│  - Manages connection   │
│  - Exposes context      │
└────────┬────────────────┘
         │
         ├───────────┬────────────┐
         ▼           ▼            ▼
    ┌────────┐  ┌─────────┐  ┌─────────┐
    │ Home   │  │ Chat    │  │ Future  │
    │ Screen │  │ Screen  │  │ Screens │
    └────────┘  └─────────┘  └─────────┘
         │           │            │
         └───────────┴────────────┘
                     │
                     ▼
            ┌──────────────────┐
            │ socketService    │
            │ (Singleton)      │
            │ ❌ NOT CONNECTED │
            └──────────────────┘
```

### Key Components

| Component          | File                                    | Purpose                                                             |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------- |
| **SocketProvider** | `src/services/socket/SocketContext.tsx` | React context provider that creates and manages the socket instance |
| **useSocket**      | `src/services/socket/socket.context.ts` | Custom hook for consuming socket context                            |
| **socketService**  | `src/services/socket/socket.service.ts` | Singleton service wrapper for socket operations (currently broken)  |
| **ChatService**    | `src/services/chat/chat.service.ts`     | Business logic for sending chat requests via socket                 |
| **Types**          | `src/services/socket/socket.types.ts`   | TypeScript interfaces for socket events                             |

---

## File Structure

```
src/services/socket/
├── SocketContext.tsx    # Main context provider (ACTIVE)
├── socket.context.ts    # Custom hook (thin wrapper)
├── socket.service.ts    # Singleton service (BROKEN - not initialized)
└── socket.types.ts      # Event type definitions

src/services/chat/
└── chat.service.ts      # Uses socketService to emit chat_request

src/screens/main/HomeScreen.tsx
└── Listens to 'welcome' event via connectSocket()
```

---

## Socket Connection Configuration

### Connection URL

**File:** `src/services/socket/SocketContext.tsx:31`

```typescript
const SOCKET_URL = `${API_BASE_URL.DEVELOPMENT}dhwani-astro`;
// For production: 'https://dhwaniastro.com/dhwani-astro'
```

**Current Value:**

- Development: `https://dhwaniastro.com/dhwani-astro` (since `DEVELOPMENT` points to production URL)
- Staging would use: `https://staging-api.dhwaniastro.com/dhwani-astro`

⚠️ **Issue:** There are WebSocket base URL constants defined in `src/constants/api.constants.ts` (`WS_BASE_URL`) but they are **not used** in the actual socket connection. The socket URL construction bypasses these constants.

### Socket Options

```typescript
const socket = io(SOCKET_URL, {
  path: '/user-socket-service-v2/socket.io', // Custom endpoint path
  transports: ['websocket'], // Forces WebSocket transport (important for React Native)
  withCredentials: true, // Sends cookies/auth credentials
});
```

**Transport Note:** `transports: ['websocket']` is critical for React Native to avoid polling fallback issues.

---

## Event Definitions

### Server-to-Client Events

**File:** `src/services/socket/socket.types.ts:3-8`

| Event                   | Payload               | Description                                 | Current Usage                  |
| ----------------------- | --------------------- | ------------------------------------------- | ------------------------------ |
| `welcome`               | `any`                 | Server greeting on connection               | ✅ Used in `HomeScreen.tsx:90` |
| `chat_request_received` | `any`                 | Confirmation that chat request was received | ❌ Not used anywhere           |
| `room_joined`           | `any`                 | Confirmation of joining a chat room         | ❌ Not used anywhere           |
| `error`                 | `{ message: string }` | Error event from server                     | ❌ Not used anywhere           |

### Client-to-Server Events

| Event          | Payload              | Description                           | Current Usage                        |
| -------------- | -------------------- | ------------------------------------- | ------------------------------------ |
| `message`      | `any`                | Generic message                       | ❌ Not used                          |
| `chat_request` | `ChatRequestPayload` | Sends a chat request to an astrologer | ✅ Used in `chat.service.ts:165,172` |
| `join_room`    | `{ roomId: string }` | Request to join a chat room           | ❌ Not used                          |

### ChatRequestPayload Structure

**File:** `src/services/socket/socket.types.ts:16-32`

```typescript
export interface ChatRequestPayload {
  name: string; // User's name
  user_id: string; // User profile ID
  astro_id: string; // Astrologer ID
  room_id: string; // Room ID from intake API
  maximum_time: number; // Chat duration in minutes
  phoneNumber: string; // Full phone with country code
  userName: string; // Same as name?
  gender: string; // 'MALE', 'FEMALE', or 'OTHER'
  dateOfBirth?: string; // ISO date format
  birthTime?: string; // HH:mm format (24h)
  location: string; // Place of birth
  is_promotional?: boolean; // Optional flag
  user_image?: string; // Profile picture URL
}
```

---

## Component Deep Dive

### 1. SocketProvider (`SocketContext.tsx`)

**Role:** Creates and manages the socket connection. Provides socket instance and connection state via React Context.

**Props:**

```typescript
interface SocketProviderProps {
  children: ReactNode;
}
```

**Context Value:**

```typescript
interface SocketContextType {
  socket: Socket | null; // The socket instance
  connectSocket: () => Socket | null; // Function to connect
  connected: boolean; // Connection status
}
```

**Lifecycle:**

1. On mount: Socket is not immediately created
2. `connectSocket()` is called by child components (e.g., `InitializeSocket` in App.tsx)
3. Creates socket with `io()` config
4. Attaches event listeners for `connect`, `connect_error`, `disconnect`
5. Stores socket in `useRef` to persist across renders
6. Updates `connected` state on connect/disconnect

**Key Code (lines 47-75):**

```typescript
const connectSocket = () => {
  if (socketRef.current && socketRef.current.connected) {
    console.log('Socket Already connected');
    return socketRef.current;
  }

  const socket = io(SOCKET_URL, {
    path: '/user-socket-service-v2/socket.io',
    transports: ['websocket'],
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Socket Connected:', socket.id);
    setConnected(true);
  });

  socket.on('connect_error', (err: Error) => {
    console.log('Error:', err.message);
  });

  socket.on('disconnect', (reason: string) => {
    console.log('Disconnected:', reason);
    setConnected(false);
  });

  socketRef.current = socket;
  return socket;
};
```

---

### 2. useSocket Hook (`socket.context.ts`)

**Purpose:** Simple wrapper around `useContext(SocketContext)` for easy consumption.

**Usage:**

```typescript
import {useSocket} from '../services/socket/socket.context';

const MyComponent = () => {
  const {socket, connectSocket, connected} = useSocket();
  // ...
};
```

**Note:** Returns `null` or warns in console if used outside `SocketProvider`.

---

### 3. socketService (`socket.service.ts`)

**Purpose:** Intended to be a centralized singleton for socket operations (emit, listeners, state).

**Current State: BROKEN**

**The Problem:**

- `socketService` is instantiated as a singleton at module load
- Its internal `socket` and `connected` properties start as `null` and `false`
- **No code ever calls** `socketService.setSocket()` to inject the actual socket instance
- Therefore, all `socketService.emit()` calls fail because `this.socket === null`

**Key Methods:**

```typescript
class SocketService {
  // Sets the socket instance (NEVER CALLED)
  setSocket(socket: Socket) {
    this.socket = socket;
    console.log('[SocketService] Socket instance set');
  }

  // Updates connection status (NEVER CALLED)
  setConnected(status: boolean) {
    this.connected = status;
    console.log('[SocketService] Connection status:', status);
  }

  // Emits an event (called but fails silently)
  emit(event: string, data: any): boolean {
    if (!this.socket) {
      console.log('[SocketService] ERROR: Socket not initialized');
      return false; // Returns false, but caller may ignore
    }
    if (!this.socket.connected) {
      console.log('[SocketService] ERROR: Socket not connected');
      return false;
    }
    this.socket.emit(event, data);
    return true;
  }

  // Checks if connected (called but always returns false)
  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}
```

**Where it's used:**

- `src/services/chat/chat.service.ts:159` calls `socketService.isConnected()`
- `src/services/chat/chat.service.ts:165,172` calls `socketService.emit('chat_request', payload)`

**What happens:** Both calls fail because `socketService.socket` is null. The `emit` returns `false` and nothing is sent over the network, but the app continues as if it succeeded.

---

### 4. ChatService (`chat.service.ts`)

**Purpose:** Orchestrates the chat request flow: create intake via GraphQL API → emit socket event.

**Main Function:** `sendChatRequest(input: ChatRequestInput): Promise<ChatRequestResult>`

**Flow:**

1. Transforms user input into `IntakeInput` format
2. Calls `createIntake()` GraphQL mutation
3. Receives `intakeResponse` containing `roomId` and `chatTime`
4. Prepares socket payload (`ChatRequestPayload`) from intake response + user profile
5. Checks `socketService.isConnected()` (always returns `false`)
6. Attempts `socketService.emit('chat_request', socketPayload)` (fails)
7. Returns `success: true` even though socket emission failed

**Bug:** Line 175-179:

```typescript
return {
  success: true, // Lies - says success even if socket failed
  intakeResponse,
  socketEmitted, // This will be false
};
```

The chat request is **never actually sent** to the astrologer via socket, even though the UI navigates to the chat screen.

---

## Integration Issues (Critical Bugs)

### Issue 1: socketService Not Initialized

**Severity:** Critical

**Problem:** `SocketProvider` creates the socket but never passes it to `socketService`. The two systems are completely decoupled.

**Impact:** Any code using `socketService.emit()` fails. Currently only `chat.service.ts` uses it, so chat requests are never delivered via socket.

**Fix Location:** `SocketContext.tsx` in `connectSocket()` after socket creation:

```typescript
// Add after: socketRef.current = socket;
socketService.setSocket(socket);
socketService.setConnected(true); // Or attach listener
```

Also need to update on disconnect:

```typescript
socket.on('disconnect', (reason: string) => {
  console.log('Disconnected:', reason);
  setConnected(false);
  socketService.setConnected(false); // Add this
});
```

---

### Issue 2: Unused WS_BASE_URL Constants

**Severity:** Low (maintenance)

**Problem:** WebSocket URL constants exist in `api.constants.ts` but are ignored. The socket URL is built using `API_BASE_URL.DEVELOPMENT` which points to an HTTP endpoint, not a WebSocket endpoint.

**Current:**

```typescript
const SOCKET_URL = `${API_BASE_URL.DEVELOPMENT}dhwani-astro`;
// Results in: https://dhwaniastro.com/dhwani-astro
```

**Expected (per constants):**

```typescript
const SOCKET_URL = `${WS_BASE_URL.DEVELOPMENT}/dhwani-astro`;
// Should be: wss://dev-ws.dhwaniastro.com/dhwani-astro
```

---

### Issue 3: Events Declared But Not Implemented

**Severity:** Medium

- `chat_request_received` event defined but no listener
- `room_joined` event defined but no listener
- `join_room` client event never emitted
- `message` client event never emitted

These are likely needed for actual chat messaging functionality which is not yet implemented.

---

### Issue 4: Inconsistent Event Names

**Severity:** Low

In `socket.types.ts`, the server event for chat request is named `chat_request_received`, but the client event is named `chat_request`. This is correct naming (server receives `chat_request`, sends back `chat_request_received`), but there's no code handling the response event.

---

## Usage Guide

### Connecting to Socket

**Automatic Connection (Current Approach):**

In `App.tsx:12-23`:

```typescript
const InitializeSocket: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { connectSocket } = useSocket();

  useEffect(() => {
    console.log('[App] Initializing socket connection...');
    connectSocket();
  }, [connectSocket]);

  return <>{children}</>;
};
```

This wrapper calls `connectSocket()` on mount and establishes connection.

---

### Listening to Events

**Example from `HomeScreen.tsx:87-97`:**

```typescript
useEffect(() => {
  const s = connectSocket();

  s?.on('welcome', _data => {
    console.log('Server:', _data);
  });

  return () => {
    s?.off('welcome');
  };
}, [connectSocket]);
```

⚠️ **Caution:** This pattern creates a new listener on every render cycle if `connectSocket` reference changes. Better to call once in a top-level component.

---

### Emitting Events (BROKEN)

**Incorrect Way (current):**

```typescript
import {socketService} from '../services/socket/socket.service';

socketService.emit('chat_request', payload); // ❌ Returns false, never sent
```

**Correct Way (if socketService were fixed):** Would work after initializing socketService in SocketProvider.

**Alternative Way (direct - not recommended):**

```typescript
const {socket} = useSocket();
socket?.emit('chat_request', payload); // ✅ Would work, but bypasses socketService
```

---

## Configuration Constants

**File:** `src/constants/api.constants.ts`

```typescript
export const WS_BASE_URL = {
  PRODUCTION: 'wss://ws.dhwaniastro.com',
  STAGING: 'wss://staging-ws.dhwaniastro.com',
  DEVELOPMENT: 'wss://dev-ws.dhwaniastro.com',
} as const;
```

These are **not used**. Current socket URL uses HTTP base URL instead.

---

## Recommended Fixes

### Fix 1: Integrate socketService with SocketProvider

**File:** `src/services/socket/SocketContext.tsx`

After line 73 (`socketRef.current = socket;`), add:

```typescript
// Initialize socketService with the socket instance
import {socketService} from './socket.service';
socketService.setSocket(socket);
socketService.setConnected(true);
```

And in the disconnect handler (after line 70):

```typescript
socketService.setConnected(false);
```

### Fix 2: Use Proper WebSocket URL

Replace line 31:

```typescript
const SOCKET_URL = `${WS_BASE_URL.DEVELOPMENT}/dhwani-astro`;
```

(Import `WS_BASE_URL` from constants)

### Fix 3: Listen for Chat Request Response

Add listener for `chat_request_received` in `chat.service.ts` to confirm delivery and handle errors.

### Fix 4: Add Room Join Logic

After successfully creating intake and emitting chat_request, emit `join_room` with `{ roomId: intakeResponse.roomId }` to enter the chat room.

---

## Observations & Recommendations

1. **Context vs Service Disconnect:** The app has both a React context (`SocketProvider`) and a singleton service (`socketService`) that are not synced. Choose one pattern:
   - **Option A (Recommended):** Use context everywhere. Remove `socketService` and use `useSocket()` in all components.
   - **Option B:** Keep `socketService` but properly initialize it in `SocketProvider`.

2. **Error Handling:** `socketService.emit()` returns a boolean but callers ignore it. Add proper error handling and retry logic.

3. **Event Documentation:** No central documentation of all socket events. Keep `socket.types.ts` up to date.

4. **Socket Lifecycle:** No explicit disconnect on app close or background. Consider handling app state changes.

5. **Type Safety:** All event payloads use `any`. Define proper interfaces for each event payload.

6. **Testing:** No socket tests exist. Consider adding integration tests with a mock server.

7. **Reconnection:** Default Socket.IO reconnection is enabled but not customized. Could add explicit reconnection logic or user notifications if connection drops.

8. **Authentication:** Socket connections use `withCredentials: true` but no auth token is passed. If the backend requires session cookies, ensure they're sent. Consider passing auth token in connection query params for better security.

---

## Socket.IO Server Expectations

Based on client configuration:

- **Server URL:** `/user-socket-service-v2/socket.io` relative to base URL
- **Expected Events from Server:** `welcome`, `chat_request_received`, `room_joined`, `error`
- **Expected Events to Server:** `chat_request`, `join_room`, `message`
- **Authentication:** Likely uses session cookie via `withCredentials: true`

---

## Testing the Socket

To test if socket is actually connecting:

1. Add a console log in `SocketContext.tsx` after socket creation to see `socket.id`
2. Check server logs for incoming connections to `/user-socket-service-v2/socket.io`
3. Use a network inspector to check WebSocket traffic

**Quick Debug:**

```typescript
// In SocketContext.tsx after socket creation
console.log('[Socket] Attempting connection to', SOCKET_URL);
```

---

## Summary

The socket implementation is **partially complete** with a **critical bug** preventing actual socket communication. The architecture has redundant layers (`SocketProvider` and `socketService` are not integrated). The chat request flow attempts to emit via `socketService` but fails silently, so users never receive astrologer chat responses over socket (though the app may fall back to HTTP polling elsewhere).

**Priority:** Fix the `socketService` initialization to make socket emission functional.

---

_Document generated from codebase analysis on 2026-04-18_
