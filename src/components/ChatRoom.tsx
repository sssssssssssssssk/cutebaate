import React, { useState, useEffect, useRef } from 'react';
import { Message, Session } from '../types';
import PeerService from '../services/PeerService';
import EncryptionService from '../services/EncryptionService';
import { cleanupSession } from '../utils/sessionUtils';

interface ChatRoomProps {
  session: Session;
  isHost: boolean;
  onExit: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ session, isHost, onExit }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeChat();

    return () => {
      // Cleanup on unmount
      PeerService.destroy();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      // Initialize encryption
      EncryptionService.initializeKey(session.password);

      // Setup callbacks
      PeerService.onMessage(handleIncomingMessage);
      PeerService.onConnectionChange(handleConnectionChange);
      PeerService.onError(handlePeerError);

      if (isHost) {
        // Host creates the peer and waits for connection
        await PeerService.initializePeer(session.sessionId);
        setIsConnecting(true);
      } else {
        // Guest creates their own peer and connects to host
        const guestPeerId = `guest_${Date.now()}`;
        await PeerService.initializePeer(guestPeerId);
        await PeerService.connectToPeer(session.sessionId);
        setIsConnecting(false);
      }
    } catch (error: any) {
      console.error('Failed to initialize chat:', error);
      setError(error.message || 'Failed to initialize chat');
      setIsConnecting(false);
    }
  };

  const handleIncomingMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
    setIsConnecting(false);

    if (!connected && messages.length > 0) {
      setError('Connection lost. The other user may have left the chat.');
    }
  };

  const handlePeerError = (errorMsg: string) => {
    setError(errorMsg);
    setIsConnecting(false);
  };

  const sendMessage = (message: Message) => {
    try {
      PeerService.sendMessage(message);
      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Connection may be lost.');
    }
  };

  const handleSendTextMessage = () => {
    if (!inputMessage.trim() || !isConnected) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      senderId: session.userId,
      content: inputMessage.trim(),
      timestamp: Date.now(),
      type: 'text'
    };

    sendMessage(message);
    setInputMessage('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB for demo)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target?.result as string;

      let messageType: Message['type'] = 'file';
      if (file.type.startsWith('image/')) {
        messageType = 'image';
      } else if (file.type.startsWith('video/')) {
        messageType = 'video';
      }

      const message: Message = {
        id: `msg_${Date.now()}_${Math.random()}`,
        senderId: session.userId,
        content: file.name,
        timestamp: Date.now(),
        type: messageType,
        fileName: file.name,
        fileSize: file.size,
        fileData: fileData
      };

      sendMessage(message);
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    // Destroy connection and clean up
    PeerService.destroy();
    cleanupSession();
    onExit();
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const downloadFile = (message: Message) => {
    if (!message.fileData) return;

    const link = document.createElement('a');
    link.href = message.fileData;
    link.download = message.fileName || 'download';
    link.click();
  };

  const renderMessage = (message: Message) => {
    const isOwn = message.senderId === session.userId;

    return (
      <div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
          <div
            className={`rounded-2xl px-4 py-2 ${isOwn
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-200 text-gray-800'
              }`}
          >
            {message.type === 'text' && <p className="break-words">{message.content}</p>}

            {message.type === 'image' && message.fileData && (
              <div>
                <img
                  src={message.fileData}
                  alt={message.fileName}
                  className="rounded-lg max-w-full mb-2 cursor-pointer"
                  onClick={() => downloadFile(message)}
                />
                <p className="text-xs opacity-75">{message.fileName}</p>
              </div>
            )}

            {message.type === 'video' && message.fileData && (
              <div>
                <video
                  src={message.fileData}
                  controls
                  className="rounded-lg max-w-full mb-2"
                >
                  Your browser does not support video playback.
                </video>
                <p className="text-xs opacity-75">{message.fileName}</p>
              </div>
            )}

            {message.type === 'file' && (
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => downloadFile(message)}
              >
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{message.fileName}</p>
                  <p className="text-xs opacity-75">{message.fileSize ? formatFileSize(message.fileSize) : ''}</p>
                </div>
              </div>
            )}
          </div>
          <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  if (showExitConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">End Session?</h2>
            <p className="text-gray-600">
              This will permanently delete all messages and close the connection.
              This action cannot be undone.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={cancelExit}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmExit}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Secure Chat</h1>
                <p className="text-sm text-gray-600">
                  {isConnecting
                    ? 'Connecting...'
                    : isConnected
                      ? '🔒 End-to-end encrypted'
                      : 'Disconnected'}
                </p>
              </div>
            </div>
            <button
              onClick={handleExit}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {isConnecting && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-600">
                {isHost ? 'Waiting for someone to join...' : 'Connecting to session...'}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {!isConnecting && isConnected && messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Connected!</h3>
              <p className="text-gray-600">Send a message to start the conversation</p>
            </div>
          )}

          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!isConnected}
              className="bg-gray-200 text-gray-700 p-3 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Attach file"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendTextMessage();
                  }
                }}
                placeholder={isConnected ? "Type a message..." : "Waiting for connection..."}
                disabled={!isConnected}
                rows={1}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleSendTextMessage}
              disabled={!isConnected || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            All messages are encrypted • No logs are saved • Max file size: 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
