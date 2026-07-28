export interface ReplyToData {
  sender: string;
  message: string;
  image?: string | null;
}

export interface ChatMessage {
  id: string;
  text: string;
  image?: string | null; // ADD THIS
  sender: 'user' | 'astrologer';
  timestamp: Date;
  read?: boolean;
  isLiked?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
  replyTo?: ReplyToData | null;
}

export interface ChatScreenProps {
  astrologerName?: string;
  astrologerImage?: string;
  astrologerRating?: number;
  astrologerExperience?: string;
  astrologerSkills?: string[];
  isOnline?: boolean;
  lastSeen?: string;
  userData: any; // ChatRequestData type imported from Modal
  onBack?: () => void;
  onEndChat?: () => void;
  initialMessage?: string;
}
