export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: number;
}

export interface MessageFormat {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  link?: string;
}

export interface ExtendedMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'file' | 'image' | 'video' | 'link' | 'voice' | 'gif' | 'sticker';
  fileName?: string;
  fileSize?: number;
  fileData?: string;
  
  // New features
  reactions?: MessageReaction[];
  replyTo?: string; // Message ID being replied to
  edited?: boolean;
  editedAt?: number;
  pinned?: boolean;
  deletedForEveryone?: boolean;
  selfDestruct?: number; // Seconds until auto-delete
  selfDestructAt?: number; // Timestamp when it will delete
  formatting?: MessageFormat;
  voiceDuration?: number; // For voice messages in seconds
  readBy?: string[]; // User IDs who read the message
}

export interface TypingIndicator {
  userId: string;
  timestamp: number;
}

export interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen?: number;
}
