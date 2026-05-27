export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'file' | 'image' | 'video' | 'link';
  fileName?: string;
  fileSize?: number;
  fileData?: string;
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
