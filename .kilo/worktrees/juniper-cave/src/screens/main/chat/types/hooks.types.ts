import {ChatMessage, ReplyToData, ChatStatus} from './screens.types';
import {RechargePack} from '../../../../services/api/recharge/recharge.types';

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
