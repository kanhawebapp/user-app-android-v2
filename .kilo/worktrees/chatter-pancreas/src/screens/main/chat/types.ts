// ==================== CANONICAL TYPES ====================
// All shared chat types. Import these directly from `../types`
// inside the chat module.

export interface ReplyToData {
  sender: string;
  message: string;
  image?: string | null;
}

export interface ChatMessage {
  id: string;
  text: string;
  image?: string | null;
  sender: 'user' | 'astrologer';
  timestamp: Date;
  read?: boolean;
  isLiked?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
  replyTo?: ReplyToData | null;
}

export type ChatStatus =
  | 'idle'
  | 'waiting'
  | 'queued'
  | 'active'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface ChatScreenProps {
  astrologerName?: string;
  astrologerImage?: string;
  astrologerRating?: number;
  astrologerExperience?: string;
  astrologerSkills?: string[];
  isOnline?: boolean;
  lastSeen?: string;
  userData: any;
  onBack?: () => void;
  onEndChat?: () => void;
  initialMessage?: string;
}

// ==================== HOOK INTERFACES ====================
// Interfaces used by the hooks beneath `hooks/`.

export interface RechargePack {
  id: string;
  name: string;
  description: string;
  price: number;
  talktime: number;
}

export const CHAT_FLOW_STATUSES: ChatStatus[] = ['active', 'queued', 'waiting'];

export interface UseChatMessagesProps {
  socket: any;
  roomId: string;
  userId?: string;
  astrologerId?: string;
  astrologerName: string;
  chatStatus: ChatStatus;
}

export interface UseChatSocketProps {
  roomId: string;
  userId?: string;
  onReceiveMessage: (message: ChatMessage) => void;
  onTyping: (isTyping: boolean) => void;
  onChatCompleted: () => void;
  onRechargeSuccess: (time: number) => void;
  onRechargeFail: () => void;
}

export interface UseChatTimerProps {
  chatStatus: ChatStatus;
  chatDuration: number;
}

export interface UseRechargeTriggerProps {
  timeLeft: number;
  socket: any;
  roomId: string;
  userId?: string;
  hasShownRecharge: boolean;
  setHasShownRecharge: (shown: boolean) => void;
  setShowRechargeModal: (show: boolean) => void;
}

export interface UseRatingModalControllerProps {
  chatStatus: ChatStatus;
  onShowRatingModal: (show: boolean) => void;
}

export interface UseChatFlowProps {
  onBack?: () => void;
  onShowRatingModal: (show: boolean) => void;
  onShowThankYouModal: (show: boolean) => void;
  onShowRechargeModal: (show: boolean) => void;
  setHasShownRecharge: (shown: boolean) => void;
}

export interface ChatMessagesState {
  messages: ChatMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  replyTo: ReplyToData | null;
  setReplyTo: (replyTo: ReplyToData | null) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  sendMessage: (payload: {text?: string; image?: string | null}) => void;
  handleInputChange: (text: string) => void;
  handleReplyPress: (message: ChatMessage) => void;
}

export interface ChatFlowState {
  walletBalance: number;
  handleEndChat: () => void;
  handleRatingSubmit: (_rating: number, _feedback?: string) => void;
  handleRecharge: () => void;
  handleChatAgain: () => void;
  handleExit: () => void;
  handleBack: () => void;
  handleEndChatPress: () => void;
  handleProceedToPay: (selectedPack: RechargePack) => Promise<void>;
}
