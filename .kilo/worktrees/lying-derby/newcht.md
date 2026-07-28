# New Chat Request Flow Documentation

## Overview
This document explains the complete flow of a new chat request in the DhwaniAstro application, from initiating the request to connecting with an astrologer.

## Flow Steps

### 1. Initiating Chat Request
- User clicks "Start Chat" with an astrologer
- `sendChatRequest()` function is called from `src/services/chat/chat.service.ts`
- Function validates inputs (astrologerId, userProfile.id)

### 2. API Intake Request
- Calls `createIntake()` API with user details:
  - Astrologer ID
  - User name, gender, DOB, birth time, birth place
  - Occupation
  - Request type: 'chat'
- API returns `intakeResponse` containing:
  - `roomId` - Unique identifier for the chat room
  - `chatTime` - Duration of chat session in minutes

### 3. Socket Connection & Payload Preparation
- Prepares socket payload with:
  - User details (name, ID, profile image)
  - Astrologer ID
  - Birth details (converted to ISO format)
  - Room ID from intake response
  - Maximum chat time
  - Phone number
- Connects to socket via `socketService.connectAndWait()`
- Sets initial chat status to 'waiting', then 'queued'

### 4. Socket Events Emitted
Two events are emitted upon successful socket connection:
1. `CHAT_REQUEST` - Sends the prepared payload to server
2. `JOIN_ROOM` - Joins the specific chat room

### 5. Queue Management
After emitting socket events:
- Chat status set to 'queued'
- Initial queue data set with:
  - Position: 1 (default)
  - Wait time: 60 seconds (default)
  - Estimated wait time: 60 seconds (default)
  - Astrologer info (empty initially)
  - Room ID
  - Message: "Connecting you with astrologer..."
- Queue timer started (60 seconds by default)

### 6. Server-to-Client Events Handling
The application listens for these key events:

#### QUEUE_POSITION (`queue_position`)
- Updates queue position and wait time
- If chat not active, starts queue timer with received wait time
- Updates queue data in store

#### QUEUE_UPDATE (`queue_update`)
- Updates queue position and timing information
- Calls `store.updateQueueData()` with new values

#### CHAT_ACCEPTED / CHAT_ACCEPTED_BY_ASTROLOGER
- Handles chat acceptance by astrologer
- Validates room ID matches current room
- Sets chat status to 'active'
- Sets `shouldNavigateToChat` to true
- Stores chat room details (room ID, astrologer info)

#### CHAT_REJECTED
- Handles chat rejection
- Sets chat status to 'rejected'
- Sets error message with reason

#### TYPING_STATUS
- Updates typing indicator when user/astrologer is typing

#### RECEIVE_MESSAGE
- Handles incoming messages
- Validates room ID matches current room
- Adds message to chat store

#### LEAVE_CHAT_EVENT / CHAT_COMPLETED_EVENT
- Handles chat ending
- Sets chat status to 'completed'
- May set error message if provided

### 7. Chat Store State Management
The chat store (`src/services/chat/chat.store.ts`) manages:

#### Key State Properties:
- `roomId`: Current chat room ID
- `messages`: Array of chat messages
- `queueData`: Queue information (position, wait time, etc.)
- `chatStatus`: Current status (idle, waiting, queued, active, rejected, completed)
- `timer` / `timeLeft`: Countdown timers
- `isConnected`: Socket connection status
- `error`: Error messages
- `shouldNavigateToChat`: Flag to navigate to chat screen
- `userData`: User information entered
- `selectedAstrologer`: Selected astrologer details

#### Key Actions:
- `setQueueData()`: Updates queue information
- `updateQueueData()`: Partially updates queue data
- `startTimer()`: Starts queue countdown timer
- `setChatStatus()`: Updates chat status
- `setShouldNavigateToChat()`: Controls navigation to chat
- `reset()`: Resets all state to initial values

### 8. Queue Display Information
When in 'queued' state, the UI displays:
- **Position**: Current position in queue (from `queueData.position`)
- **Wait Time**: Estimated time remaining (from `queueData.waitTime` or `estimatedWaitTime`)
- **Astrologer Info**: Name and details (from `queueData.astrologerName` and `astrologerId`)
- **Message**: Status message (from `queueData.message`)
- **Timer**: Countdown based on `queueTimeLeft`

### 9. Transition to Active Chat
When chat is accepted:
- Queue data is cleared or updated
- Chat status changes to 'active'
- Chat timer starts based on `chatDuration` (from intake response)
- UI navigates to chat screen
- Message exchange begins via `RECEIVE_MESSAGE` events

## Error Handling
- API failures: Chat status set to 'idle', error returned
- Socket connection failures: Handled by socket service reconnection logic
- Invalid room IDs: Events ignored if room ID doesn't match current room
- Chat rejections: Status set to 'rejected' with reason
- Disconnections: Appropriate error messages shown

## Socket Service Details
The socket service (`src/services/socket/socket.service.ts`):
- Manages socket.io connection
- Handles automatic reconnection
- Registers/deregisters event listeners
- Normalizes room ID variations (roomId, roomid, room_id)
- Provides emit functionality with validation
- Manages connection state and callbacks

## Data Flow Summary
```
User Action → sendChatRequest() → Intake API → Socket Connection → 
Emit CHAT_REQUEST/JOIN_ROOM → Queue Position Updates → 
Chat Accepted → Active Chat → Message Exchange
```

## Files Involved
1. `src/services/chat/chat.service.ts` - Main chat request logic
2. `src/services/socket/socket.service.ts` - Socket connection management
3. `src/services/socket/socket.events.ts` - Socket event constants
4. `src/services/chat/chat.store.ts` - State management
5. `src/services/chat/chat.hooks.ts` - Custom hooks (if any)
6. `src/screens/main/chat/ChatScreen.tsx` - Main chat UI
7. `src/components/QueueBubble/QueueBubble.tsx` - Queue display component