import Peer, { DataConnection } from 'peerjs';
import { Message, EncryptedMessage } from '../types';
import EncryptionService from './EncryptionService';

type MessageCallback = (message: Message) => void;
type ConnectionCallback = (connected: boolean) => void;
type ErrorCallback = (error: string) => void;

class PeerService {
  private peer: Peer | null = null;
  private connections: DataConnection[] = [];
  private messageCallback: MessageCallback | null = null;
  private connectionCallback: ConnectionCallback | null = null;
  private errorCallback: ErrorCallback | null = null;
  private isHostMode: boolean = false;

  // Initialize peer with session ID
  initializePeer(sessionId: string, isHost: boolean = false, userId?: string): Promise<string> {
    this.isHostMode = isHost;
    return new Promise((resolve, reject) => {
      try {
        // Clean session ID to use as peer ID base
        const sessionCleanId = sessionId.replace(/-/g, '').toLowerCase();
        
        // Host gets the exact session ID. Joiners get a unique ID suffixed with their userId to avoid ID collisions.
        const peerId = isHost 
          ? sessionCleanId 
          : (userId ? `${sessionCleanId}_${userId.replace(/[^A-Za-z0-9]/g, '').toLowerCase()}` : undefined);
        
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
        const conn = this.peer.connect(targetPeerId, {
          reliable: true
        });

        conn.on('open', () => {
          console.log('Connected to peer');
          this.connections.push(conn);
          this.setupConnectionListeners(conn);
          if (this.connectionCallback) {
            this.connectionCallback(true);
          }
          resolve();
        });

        conn.on('error', (err) => {
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
      
      conn.on('open', () => {
        console.log('Connection established');
        this.connections.push(conn);
        this.setupConnectionListeners(conn);
        if (this.connectionCallback) {
          this.connectionCallback(true);
        }
      });
    });
  }

  // Setup listeners for data connection
  private setupConnectionListeners(conn: DataConnection): void {
    conn.on('data', (data: any) => {
      try {
        const encryptedMessage = data as EncryptedMessage;
        const decryptedData = EncryptionService.decrypt(
          encryptedMessage.encrypted,
          encryptedMessage.iv
        );
        
        const message: Message = JSON.parse(decryptedData);
        
        // If we are the host in a group chat, we act as a relay and broadcast this message to all other connected peers!
        if (this.isHostMode && this.connections.length > 1) {
          this.broadcastExcept(data, conn);
        }

        if (this.messageCallback) {
          this.messageCallback(message);
        }
      } catch (error) {
        console.error('Error processing received message:', error);
      }
    });

    conn.on('close', () => {
      console.log('Connection closed');
      this.connections = this.connections.filter(c => c !== conn);
      if (this.connectionCallback) {
        this.connectionCallback(this.connections.length > 0);
      }
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      if (this.errorCallback) {
        this.errorCallback('Connection error occurred');
      }
    });
  }

  // Relay raw encrypted data to all peers except the sender
  private broadcastExcept(rawData: any, senderConn: DataConnection): void {
    this.connections.forEach(conn => {
      if (conn !== senderConn && conn.open) {
        try {
          conn.send(rawData);
        } catch (err) {
          console.error('Relay error:', err);
        }
      }
    });
  }

  // Send message to all open connections
  sendMessage(message: Message): void {
    const openConnections = this.connections.filter(c => c.open);
    if (openConnections.length === 0) {
      throw new Error('No active connection');
    }

    try {
      const messageJson = JSON.stringify(message);
      const encrypted = EncryptionService.encrypt(messageJson);
      openConnections.forEach(conn => {
        conn.send(encrypted);
      });
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
    this.connections.forEach(conn => {
      try {
        conn.close();
      } catch {}
    });
    this.connections = [];

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }

    this.messageCallback = null;
    this.connectionCallback = null;
    this.errorCallback = null;
    this.isHostMode = false;
    
    EncryptionService.clearKey();
  }

  // Check if connected
  isConnected(): boolean {
    return this.connections.some(c => c.open);
  }

  // Get active connection count
  getConnectionCount(): number {
    return this.connections.filter(c => c.open).length;
  }

  // Get raw PeerJS peer reference
  getPeer(): Peer | null {
    return this.peer;
  }

  // Get raw active connections
  getConnections(): DataConnection[] {
    return this.connections;
  }
}

export default new PeerService();
