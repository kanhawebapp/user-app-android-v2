# DhwaniAstro - Application Architecture & Code Flow

## Overview

DhwaniAstro is a React Native astrology consultation mobile application that connects users with expert astrologers for personalized predictions and guidance. The app supports real-time chat and voice/video calls with astrologers.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React Native 0.73.6 |
| State Management | Zustand 5.0.11 |
| Navigation | React Navigation (Native Stack, Bottom Tabs) |
| GraphQL Client | Axios-based custom client |
| Real-time Communication | Socket.IO 4.8.3 |
| WebRTC | react-native-webrtc 118.0.7 |
| Data Fetching | TanStack React Query 5.90.21 |
| Storage | MMKV (react-native-mmkv) |
| Notifications | OneSignal |
| Analytics | Firebase Analytics |
| Audio | react-native-sound |
| Animations | react-native-reanimated, lottie-react-native |

## Project Structure

```
src/
├── App.tsx                          # App entry point
├── components/                      # Shared UI components
│   ├── Modal/                       # Modal components
│   ├── Text/                        # Text component
│   ├── Icon/                        # Icon wrapper
│   └── Card/                        # Card component
├── constants/                       # App constants
│   ├── api.constants.ts            # API endpoints & config
│   ├── app.constants.ts            # Storage keys, etc.
│   └── config.constants.ts         # App configuration
├── features/                        # Feature modules
│   ├── dailyPuja/                  # Daily puja feature
│   ├── free-services/              # Free astrology services
│   ├── about/                      # About screen
│   └── my-following/               # Followed astrologers
├── modules/                         # Core modules
│   └── call/                       # Voice/Video calling module
├── screens/                         # Screen components
│   ├── main/                       # Main tab screens
│   │   ├── HomeScreen.tsx
│   │   ├── chat/                   # Chat screens
│   │   ├── chatcall/               # Chat call screen
│   │   ├── home/                   # Home components
│   │   └── recomandedAstrologer/   # Astrologer list/profile
├── services/                        # Business logic & data
│   ├── api/                         # API layer
│   ├── auth/                        # Authentication
│   ├── chat/                        # Chat service
│   ├── socket/                      # Socket.IO service
│   └── storage/                     # Storage utilities
├── stores/                          # Zustand stores
├── theme/                           # Theme system
└── navigation/                      # Navigation setup
```

## Core Architecture

### State Management (Zustand)

The app uses Zustand for global state management with the following key stores:

**Chat Store** (`src/services/chat/chat.store.ts`):
- Manages chat state: messages, queue data, typing status
- Chat status: idle, waiting, queued, active, rejected, completed, cancelled
- Timer management for queue wait time and chat duration
- Room ID and chat room information

**Auth Store** (`src/stores/auth.store.ts`):
- User authentication state
- Access token management
- Login/logout state

**Call Store** (`src/stores/call.store.ts`):
- WebRTC call state management
- Call status, duration, connection state

### Navigation Flow

**App Entry** (`App.tsx`):
```
SafeAreaProvider
  └── ThemeProvider
      └── ToastProvider
          └── ErrorBoundary
              └── AppContent (Auth stack or Main stack)
```

**Main Navigator** (`src/navigation/mainNavigation/MainNavigator.tsx`):
- Bottom tab navigation with conditional rendering
- Sidebar for profile/menu
- Modal management (gift, profile completion, login required)

**Tab Structure**:
- Home (default tab)
- Free Services
- About
- ChatCall (real-time chat interface)

### Real-time Communication

**Socket Service** (`src/services/socket/socket.service.ts`):
- Socket.IO connection to `${API_BASE_URL}dhwani-astro`
- Event handling for:
  - `queue_position` - Position in chat queue
  - `chat_accepted` / `chatAcceptedByAstrologer` - Chat accepted
  - `chat_rejected` - Chat request rejected
  - `receive_message` - New message received
  - `typing_status` - Typing indicator
  - `leave_chat` / `chatCompleted` - Session ended

**WebRTC Call** (`src/modules/call/`):
- `useCallConnection` hook manages WebRTC connection
- Signaling service for call setup
- Media permissions handling
- Call controls: mute, video toggle, speaker, switch camera

## Key Features & Flows

### 1. Home Screen Flow

```
HomeScreen
  ├── HeroBanner - App banner/CTA
  ├── OngoingLive - Live sessions (onSessionPress triggers login check)
  ├── UpcomingLive - Scheduled sessions
  ├── HomeAstrologers - Recommended astrologers list
  │   ├── onAstrologerPress → AstrologerProfileScreen (overlay)
  │   └── onChatPress → ChatRequestModal
  ├── ProblemCategories - Category-based problems
  ├── FeatureHealings - Remedies/products
  ├── Shop - Shopping section
  ├── Blog - Articles
  └── Testimonials - User reviews
```

### 2. Chat Flow

```
User presses chat on astrologer card
  │
  ├── ChatRequestModal opens
  │   └── handleChatRequestSubmit
  │       ├── Set selected astrologer in chat store
  │       └── Navigate to chatCall tab
  │
  └── ChatCallScreen (QueueBubble)
      ├── Shows queue position and wait time
      ├── Socket connects, emits join_queue
      │
      └── On chat_accepted
          ├── ChatScreen renders
          ├── Messages can be exchanged via socket
          └── Timer counts down based on wallet balance
```

### 3. Call Flow

```
User initiates call
  │
  ├── Request camera/microphone permissions
  ├── initiateCall() in call store
  ├── WebRT connection established
  │
  └── CallScreen
      ├── LocalVideoView + RemoteVideoView
      ├── CallControls (mute, video, speaker, end)
      └── CallTimer
```

### 4. Daily Puja Flow

```
DailyPujaScreen
  ├── Door animation on mount
  ├── God selection (swipeable cards)
  ├── Puja items selection
  ├── Start Puja button
  │   └── Plays aarti sound
  ├── Special items with thali rotation animation
  └── Complete puja flow
```

## Data Layer

### API Services

**GraphQL Client** (`src/services/api/graphql.client.ts`):
- Axios instance with Bearer token authentication
- Automatic token injection from secure storage
- Request logging via logging service

**REST API Endpoints** (from `api.constants.ts`):
- Auth: `/v1/auth/*`
- User: `/v1/user/*`
- Astrologer: `/v1/astrologers/*`
- Chat: `/v1/chat/*`
- Call: `/v1/call/*`
- Wallet: `/v1/wallet/*`
- Session: `/v1/session/*`

### Custom Hooks

- `useChatMessages` - Message management with socket integration
- `useChatTimer` - Chat countdown timer
- `useChatSocket` - Socket event listeners
- `useChatFlow` - Chat state orchestration
- `useRechargeTrigger` - Low balance recharge prompt
- `useRatingModalController` - End-of-chat rating flow

## Services

| Service | Purpose |
|---------|---------|
| `socket.service.ts` | Socket.IO connection & event handling |
| `chat.service.ts` | Chat API integration |
| `chat.store.ts` | Chat state management |
| `secure.storage.ts` | Encrypted token storage |
| `mmkv.storage.ts` | High-performance async storage |
| `OneSignalService.ts` | Push notifications |
| `AnalyticsService.ts` | Firebase analytics |
| `NavigationService.ts` | Programmatic navigation |
| `SoundService.ts` | Audio playback for puja |

## Theme System

The app uses a custom theme system with:
- Light mode support (default)
- Colors defined in `src/theme/colors.ts`
- Typography scales in `src/theme/typography.ts`
- `useTheme()` hook for accessing theme values

## Configuration

**API Constants** (`src/constants/api.constants.ts`):
- Base URLs for production/staging/development
- HTTP methods and status codes
- Timeouts: Default 30s, Long 60s, Upload 2min
- WebSocket config: Reconnect interval 3s, max 10 attempts
- Pagination: Default 20 items per page
- Chat config: 2000 char max message, 5 attachments max
- Call config: 60s billable minimum, 4hr max duration

## Key Components

### Modals
- `ChatRequestModal` - Collect user info before chat
- `RatingModal` - Post-chat rating submission
- `ThankYouModal` - Chat completion screen with options
- `RechargePaymentModal` - Wallet recharge options
- `ProfileCompletionModal` - JIT profile collection
- `GiftModal` - Promotional offers
- `LoginRequiredModal` - Auth prompt for restricted actions

### Chat Components
- `ChatHeader` - Top bar with astrologer info, timer
- `MessageBubble` - Individual message rendering
- `ChatInput` - Message input with reply support
- `TypingIndicator` - Shows when astrologer is typing
- `QueueBubble` - Queue status display

## Data Models

### ChatMessage
```typescript
{
  id: string;
  roomId: string;
  senderId: string;
  senderType: 'user' | 'astrologer';
  message: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  isLiked?: boolean;
}
```

### ChatStatus
`'idle' | 'waiting' | 'queued' | 'active' | 'rejected' | 'completed' | 'cancelled'`

### AstrologerInfo
```typescript
{
  id: string;
  name: string;
  image?: string;
  rating: number;
  experience: string;
  skills: string[];
  isAvailableForChat: boolean;
}
```

## Socket Events

| Event | Payload | Action |
|-------|---------|--------|
| `queue_position` | {position, waitTime, astrologerId, roomId} | Update queue status |
| `chat_accepted` | {roomId, astrologerId, astrologerName} | Navigate to chat |
| `chat_rejected` | {roomId, reason} | Show rejection error |
| `receive_message` | {id, message, sender, roomId} | Add message to list |
| `typing_status` | {roomId, isTyping, senderType} | Show/hide typing indicator |
| `leave_chat` | {roomId, reason} | End chat session |
| `chatCompleted` | {roomId} | Mark chat as completed |

## Build & Run

```bash
# Install dependencies
npm install

# iOS
npm run ios

# Android
npm run android

# Lint
npm run lint

# Tests
npm run test
```

## App Features Summary

1. **Home Dashboard** - Hero banner, live sessions, recommended astrologers, categories, remedies, shop, blog, testimonials
2. **Chat System** - Real-time messaging with queue management and timer-based billing
3. **Voice/Video Calls** - WebRTC-based calling with media controls
4. **Daily Puja** - Interactive puja simulation with god selection and aarti audio
5. **Free Services** - Daily horoscope, kundali, match making, panchang, numerology
6. **About** - Company info, contact, social links, legal
7. **Wallet** - Balance management, recharge, transaction history
8. **Notifications** - OneSignal push notifications
9. **Rating System** - Post-session astrologer rating

---

*Document generated from codebase analysis - DhwaniAstro v0.0.1*