// LoginScreen types shared across screens are defined here to avoid circular imports.
// All other screen-level types (ChatScreenProps, etc.) may also extend from here.

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
