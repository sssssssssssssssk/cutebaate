import { MessageReaction, MessageFormat } from './message';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 
    | 'text' 
    | 'file' 
    | 'image' 
    | 'video' 
    | 'link' 
    | 'voice' 
    | 'gif' 
    | 'sticker'
    // Control / Sync packet types
    | 'reaction'
    | 'edit'
    | 'delete'
    | 'pin'
    | 'typing'
    | 'read'
    | 'gift_premium'
    | 'group_sync'
    | 'poll'
    | 'poll_vote'
    | 'group_mute'
    | 'group_join';
    
  fileName?: string;
  fileSize?: number;
  fileData?: string;
  
  // Custom metadata
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
  poll?: any; // Anonymous poll data package
  
  // Control packet payload fields
  targetId?: string; // The message ID being targeted for reaction/edit/delete/pin
  targetIds?: string[]; // Multiple target IDs (e.g. for read receipts)
  isTyping?: boolean; // For typing indicator packets
  nickname?: string; // Sender's session nickname
  avatar?: string; // Sender's custom avatar emoji
}

export interface Session {
  sessionId: string;
  password: string;
  userId: string;
  createdAt: number;
}

export interface EncryptedMessage {
  encrypted: string;
  iv: string;
}

export interface FileMessage {
  name: string;
  size: number;
  type: string;
  data: string;
}

export interface PeerConnection {
  peerId: string;
  connection: any;
  connected: boolean;
}

export * from './message';
