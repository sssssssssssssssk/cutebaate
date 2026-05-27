import Peer, { DataConnection } from 'peerjs';
import { Message, EncryptedMessage } from '../types';
import EncryptionService from './EncryptionService';

type MessageCallback = (message: Message) => void;
type ConnectionCallback = (connected: boolean) => void;
type ErrorCallback = (error: string) => void;

class PeerService {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private messageCallback: MessageCallback | null = null;
  private connectionCallback: ConnectionCallback | null = null;
  private errorCallback: ErrorCallback | null = null;

  // Initialize peer with session ID
  initializePeer(sessionId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Clean session ID to use as peer ID
        const peerId = sessionId.replace(/-/g, '').toLowerCase();
        
        this.peer = new Peer(peerId, {
          debug: 0,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          console.log('Peer initialized with ID:', id);
          this.setupPeerListeners();
          resolve(id);
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          if (err.type === 'unavailable-id') {
            reject(new Error('Session ID already in use. Please try joining instead.'));
          } else {
            reject(err);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Connect to an existing peer
  connectToPeer(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        reject(new Error('Peer not initialized'));
        return;
      }

      const targetPeerId = sessionId.replace(/-/g, '').toLowerCase();
      
      try {
        this.connection = this.peer.connect(targetPeerId, {
          reliable: true
        });

        this.connection.on('open', () => {
          console.log('Connected to peer');
          this.setupConnectionListeners();
          if (this.connectionCallback) {
            this.connectionCallback(true);
          }
          resolve();
        });

        this.connection.on('error', (err) => {
          console.error('Connection error:', err);
          if (this.errorCallback) {
            this.errorCallback('Failed to connect. Session may not exist or password is incorrect.');
          }
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Setup listeners for incoming connections
  private setupPeerListeners(): void {
    if (!this.peer) return;

    this.peer.on('connection', (conn) => {
      console.log('Incoming connection from:', conn.peer);
      this.connection = conn;
      
      conn.on('open', () => {
        console.log('Connection established');
        this.setupConnectionListeners();
        if (this.connectionCallback) {
          this.connectionCallback(true);
        }
      });
    });
  }

  // Setup listeners for data connection
  private setupConnectionListeners(): void {
    if (!this.connection) return;

    this.connection.on('data', (data: any) => {
      try {
        const encryptedMessage = data as EncryptedMessage;
        const decryptedData = EncryptionService.decrypt(
          encryptedMessage.encrypted,
          encryptedMessage.iv
        );
        
        const message: Message = JSON.parse(decryptedData);
        
        if (this.messageCallback) {
          this.messageCallback(message);
        }
      } catch (error) {
        console.error('Error processing received message:', error);
      }
    });

    this.connection.on('close', () => {
      console.log('Connection closed');
      if (this.connectionCallback) {
        this.connectionCallback(false);
      }
    });

    this.connection.on('error', (err) => {
      console.error('Connection error:', err);
      if (this.errorCallback) {
        this.errorCallback('Connection error occurred');
      }
    });
  }

  // Send message
  sendMessage(message: Message): void {
    if (!this.connection || !this.connection.open) {
      throw new Error('No active connection');
    }

    try {
      const messageJson = JSON.stringify(message);
      const encrypted = EncryptionService.encrypt(messageJson);
      this.connection.send(encrypted);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Set message callback
  onMessage(callback: MessageCallback): void {
    this.messageCallback = callback;
  }

  // Set connection callback
  onConnectionChange(callback: ConnectionCallback): void {
    this.connectionCallback = callback;
  }

  // Set error callback
  onError(callback: ErrorCallback): void {
    this.errorCallback = callback;
  }

  // Destroy peer connection and clean up
  destroy(): void {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.messageCallback = null;
    this.connectionCallback = null;
    this.errorCallback = null;
    
    EncryptionService.clearKey();
  }

  // Check if connected
  isConnected(): boolean {
    return this.connection !== null && this.connection.open;
  }
}

export default new PeerService();
