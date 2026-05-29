import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import PeerService from '../services/PeerService';
import EncryptionService from '../services/EncryptionService';
import ReportModal from './ReportModal';
import MessageReactionPicker from './MessageReactionPicker';
import StickerGifPicker from './StickerGifPicker';
import VoiceRecorder from '../services/VoiceRecorder';
import AnalyticsService from '../services/AnalyticsService';
import { useSessionDuration } from '../hooks/useSessionDuration';
import { usePremium } from '../contexts/PremiumContext';
import { useLanguage } from '../contexts/LanguageContext';
import { cleanupSession } from '../utils/sessionUtils';

interface ChatRoomProps {
  session: {
    sessionId: string;
    password: string;
    userId: string;
    createdAt: number;
  };
  isHost: boolean;
  isGroup?: boolean;
  onExit: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ session, isHost, isGroup = false, onExit }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  
  // Custom features state
  const [showReactions, setShowReactions] = useState(false);
  const [reactionPosition, setReactionPosition] = useState({ x: 0, y: 0 });
  const [selectedMessageId, setSelectedMessageId] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [screenshotAlert, setScreenshotAlert] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [nickname, setNickname] = useState(() => localStorage.getItem('chat_nickname') || '');
  const [showNicknameDialog, setShowNicknameDialog] = useState(false);
  const [customAvatar, setCustomAvatar] = useState(() => localStorage.getItem('chat_avatar') || '👤');
  const [chatWallpaper, setChatWallpaper] = useState(() => localStorage.getItem('chat_wallpaper') || 'default');
  const [readReceiptsEnabled] = useState(() => localStorage.getItem('read_receipts') !== 'false');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const { formatted } = useSessionDuration(session.createdAt);
  const { features } = usePremium();
  const { t } = useLanguage();

  // Gamification — Streak
  const streak = AnalyticsService.getSessionStats().streak;
  const totalMessages = AnalyticsService.getSessionStats().totalMessages;
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    initializeChat();
    AnalyticsService.trackSession();

    return () => {
      PeerService.destroy();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Session duration enforcement
  useEffect(() => {
    const maxMs = features.sessionDuration * 60 * 60 * 1000;
    const check = setInterval(() => {
      if (Date.now() - session.createdAt > maxMs) {
        setSessionExpired(true);
        clearInterval(check);
      }
    }, 10_000);
    return () => clearInterval(check);
  }, [features.sessionDuration, session.createdAt]);

  // Self-destruct messages countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(msg => {
        if (msg.selfDestructAt && msg.selfDestructAt <= now) {
          return false;
        }
        return true;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Send typing indicator
  useEffect(() => {
    if (!isConnected) return;
    
    if (inputMessage.length > 0) {
      setIsTyping(true);
      try {
        PeerService.sendMessage({
          id: `ctrl_${Date.now()}`,
          senderId: session.userId,
          content: '',
          timestamp: Date.now(),
          type: 'typing',
          isTyping: true
        });
      } catch {}
      
      const timeout = setTimeout(() => {
        setIsTyping(false);
        try {
          PeerService.sendMessage({
            id: `ctrl_${Date.now()}`,
            senderId: session.userId,
            content: '',
            timestamp: Date.now(),
            type: 'typing',
            isTyping: false
          });
        } catch {}
      }, 1500);
      
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      try {
        PeerService.sendMessage({
          id: `ctrl_${Date.now()}`,
          senderId: session.userId,
          content: '',
          timestamp: Date.now(),
          type: 'typing',
          isTyping: false
        });
      } catch {}
    }
  }, [inputMessage, isConnected, session.userId]);

  // Save customization preferences
  useEffect(() => {
    localStorage.setItem('chat_nickname', nickname);
  }, [nickname]);

  useEffect(() => {
    localStorage.setItem('chat_avatar', customAvatar);
  }, [customAvatar]);

  useEffect(() => {
    localStorage.setItem('chat_wallpaper', chatWallpaper);
  }, [chatWallpaper]);

  // Screenshot detection — only active when enabled in Settings
  useEffect(() => {
    const isEnabled = localStorage.getItem('screenshot_detection') === 'true';
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4'))) {
        setScreenshotAlert(true);
        setTimeout(() => setScreenshotAlert(false), 4000);
        try {
          PeerService.sendMessage({
            id: `ctrl_${Date.now()}`, senderId: session.userId, content: '📸 Screenshot detected!',
            timestamp: Date.now(), type: 'text'
          });
        } catch {}
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [session.userId]);

  // Drag-and-drop file upload handler
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => { setDragOver(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      const maxSize = features.maxFileSize * 1024 * 1024;
      if (file.size > maxSize) { setError(`File "${file.name}" exceeds ${features.maxFileSize}MB limit.`); return; }
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target?.result as string;
        let messageType: Message['type'] = 'file';
        if (file.type.startsWith('image/')) messageType = 'image';
        else if (file.type.startsWith('video/')) messageType = 'video';
        sendPayload({ content: file.name, type: messageType, fileName: file.name, fileSize: file.size, fileData });
        AnalyticsService.trackFile();
      };
      reader.readAsDataURL(file);
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      EncryptionService.initializeKey(session.password);

      PeerService.onMessage(handleIncomingMessage);
      PeerService.onConnectionChange(handleConnectionChange);
      PeerService.onError(handlePeerError);

      await PeerService.initializePeer(session.sessionId, isHost);
      
      if (isHost) {
        setIsConnecting(true);
      } else {
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
    // Process control/sync packets
    if (message.type === 'typing') {
      if (message.senderId !== session.userId) {
        setRemoteTyping(!!message.isTyping);
      }
      return;
    }

    if (message.type === 'reaction' && message.targetId) {
      const { targetId, content: emoji, senderId } = message;
      setMessages(prev => prev.map(msg => {
        if (msg.id === targetId) {
          const reactions = msg.reactions || [];
          const existing = reactions.find(r => r.userId === senderId);
          if (existing) {
            return {
              ...msg,
              reactions: reactions.filter(r => r.userId !== senderId)
            };
          }
          return {
            ...msg,
            reactions: [...reactions, { emoji, userId: senderId, timestamp: Date.now() }]
          };
        }
        return msg;
      }));
      return;
    }

    if (message.type === 'edit' && message.targetId) {
      const { targetId, content } = message;
      setMessages(prev => prev.map(msg => 
        msg.id === targetId ? { ...msg, content, edited: true, editedAt: Date.now() } : msg
      ));
      return;
    }

    if (message.type === 'delete' && message.targetId) {
      const { targetId } = message;
      setMessages(prev => prev.filter(msg => msg.id !== targetId));
      return;
    }

    if (message.type === 'pin' && message.targetId) {
      const { targetId } = message;
      setMessages(prev => prev.map(msg => 
        msg.id === targetId ? { ...msg, pinned: !msg.pinned } : msg
      ));
      return;
    }

    if (message.type === 'read' && message.targetIds) {
      const { targetIds, senderId } = message;
      setMessages(prev => prev.map(msg => {
        if (targetIds && targetIds.includes(msg.id)) {
          const readBy = msg.readBy || [];
          if (!readBy.includes(senderId)) {
            return { ...msg, readBy: [...readBy, senderId] };
          }
        }
        return msg;
      }));
      return;
    }

    // Process regular messages
    // If message has selfDestruct, set the auto-delete timestamp upon arrival!
    let selfDestructAt = message.selfDestructAt;
    if (message.selfDestruct && !selfDestructAt) {
      selfDestructAt = Date.now() + message.selfDestruct * 1000;
    }

    const completeMsg = { ...message, selfDestructAt };
    setMessages(prev => [...prev, completeMsg]);

    // Send read receipt if enabled
    if (readReceiptsEnabled && document.hasFocus()) {
      try {
        PeerService.sendMessage({
          id: `ctrl_${Date.now()}`,
          senderId: session.userId,
          content: '',
          timestamp: Date.now(),
          type: 'read',
          targetIds: [message.id]
        });
      } catch {}
    }
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

  const sendPayload = (messageData: Partial<Message>) => {
    if (!isConnected) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      senderId: session.userId,
      content: messageData.content || '',
      timestamp: Date.now(),
      type: messageData.type || 'text',
      nickname: nickname || undefined,
      avatar: customAvatar,
      ...messageData
    };

    try {
      PeerService.sendMessage(message);
      
      // If the message has selfDestruct, set its timestamp locally
      let selfDestructAt = message.selfDestructAt;
      if (message.selfDestruct && !selfDestructAt) {
        selfDestructAt = Date.now() + message.selfDestruct * 1000;
      }
      
      setMessages(prev => [...prev, { ...message, selfDestructAt }]);
      AnalyticsService.trackMessage();
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Connection may be lost.');
    }
  };

  const handleSendTextMessage = () => {
    if (!inputMessage.trim() || !isConnected) return;

    // Check for self-destruct setting from the header/input toggle
    const sdSelect = document.getElementById('self-destruct-select') as HTMLSelectElement;
    const sdVal = sdSelect ? parseInt(sdSelect.value) : 0;

    const text = inputMessage.trim();

    // Easter egg checks
    if (text === '/party' || text === '🎉🎉🎉') {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 4000);
    }
    if (text === '/streak') {
      setEasterEggTriggered(true);
      setTimeout(() => setEasterEggTriggered(false), 3000);
    }

    sendPayload({
      content: text,
      type: 'text',
      replyTo: replyTo?.id,
      selfDestruct: sdVal > 0 ? sdVal : undefined
    });

    setInputMessage('');
    setReplyTo(null);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // Send sync packet
    try {
      PeerService.sendMessage({
        id: `ctrl_${Date.now()}`,
        senderId: session.userId,
        content: emoji,
        timestamp: Date.now(),
        type: 'reaction',
        targetId: messageId
      });
    } catch {}

    // Update locally
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existing = reactions.find(r => r.userId === session.userId);
        if (existing) {
          return {
            ...msg,
            reactions: reactions.filter(r => r.userId !== session.userId)
          };
        }
        return {
          ...msg,
          reactions: [...reactions, { emoji, userId: session.userId, timestamp: Date.now() }]
        };
      }
      return msg;
    }));
    AnalyticsService.trackFeature('message_reaction');
  };

  const handleStickerOrGif = (type: 'sticker' | 'gif', data: string) => {
    sendPayload({
      content: data,
      type: type,
      fileName: type === 'sticker' ? 'Sticker' : 'GIF'
    });
    AnalyticsService.trackFeature(type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxSize = features.maxFileSize * 1024 * 1024;

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        setError(`"${file.name}" exceeds ${features.maxFileSize}MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target?.result as string;
        let messageType: Message['type'] = 'file';
        
        if (file.type.startsWith('image/')) messageType = 'image';
        else if (file.type.startsWith('video/')) messageType = 'video';

        sendPayload({
          content: file.name,
          type: messageType,
          fileName: file.name,
          fileSize: file.size,
          fileData: fileData
        });
        AnalyticsService.trackFile();
      };

      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleVoiceRecord = async () => {
    if (isRecordingVoice) {
      try {
        const { data, duration } = await VoiceRecorder.stopRecording();
        sendPayload({
          content: 'Voice Message',
          type: 'voice',
          fileData: data,
          voiceDuration: duration
        });
        setIsRecordingVoice(false);
        AnalyticsService.trackFeature('voice_message');
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    } else {
      try {
        await VoiceRecorder.startRecording();
        setIsRecordingVoice(true);
      } catch {
        setError('Microphone access denied or unavailable.');
      }
    }
  };

  const handlePinMessage = (messageId: string) => {
    try {
      PeerService.sendMessage({
        id: `ctrl_${Date.now()}`,
        senderId: session.userId,
        content: '',
        timestamp: Date.now(),
        type: 'pin',
        targetId: messageId
      });
    } catch {}

    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
    ));
    AnalyticsService.trackFeature('pin_message');
  };

  const handleDeleteMessage = (messageId: string) => {
    try {
      PeerService.sendMessage({
        id: `ctrl_${Date.now()}`,
        senderId: session.userId,
        content: '',
        timestamp: Date.now(),
        type: 'delete',
        targetId: messageId
      });
    } catch {}

    setMessages(prev => prev.filter(m => m.id !== messageId));
    AnalyticsService.trackFeature('delete_message');
  };

  const handleEditMessage = (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg || msg.senderId !== session.userId) return;

    // Can only edit within 5 minutes
    if (Date.now() - msg.timestamp > 5 * 60 * 1000) {
      alert('Messages can only be edited within 5 minutes of sending.');
      return;
    }

    const newContent = prompt('Edit message:', msg.content);
    if (newContent !== null && newContent.trim() !== '') {
      try {
        PeerService.sendMessage({
          id: `ctrl_${Date.now()}`,
          senderId: session.userId,
          content: newContent.trim(),
          timestamp: Date.now(),
          type: 'edit',
          targetId: messageId
        });
      } catch {}

      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, content: newContent.trim(), edited: true, editedAt: Date.now() } : m
      ));
      AnalyticsService.trackFeature('edit_message');
    }
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
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
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const downloadFile = (message: Message) => {
    if (!message.fileData) return;
    const link = document.createElement('a');
    link.href = message.fileData;
    link.download = message.fileName || 'download';
    link.click();
  };

  // Simple Markdown parsing for bold, italic, and code
  const formatMessageContent = (text: string) => {
    // Match code blocks first
    const parts = text.split(/(`[^`]+`|\*[^*]+\*|_[^_]+_)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20 px-1.5 py-0.5 rounded font-mono text-sm">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i} className="font-bold">{part.slice(1, -1)}</strong>;
      }
      if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const displayMessages = messages;

  const pinnedMessages = messages.filter(m => m.pinned);

  // Wallpaper mapping
  const wallpaperStyles: Record<string, string> = {
    default: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800',
    dark: 'bg-gray-950',
    ocean: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    sunset: 'bg-gradient-to-br from-orange-400 to-pink-600',
    forest: 'bg-gradient-to-br from-green-500 to-emerald-700',
  };

  const avatarsList = ['👤', '🦊', '🦁', '🦄', '🐼', '🐨', '🤖', '👻', '👽', '🐱'];

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">⏰</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Session Expired</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Your {features.sessionDuration}h session has ended. All messages have been permanently deleted.
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mb-6">
            💎 Upgrade to Premium for 24h sessions, or Enterprise for 1-week sessions!
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => { PeerService.destroy(); cleanupSession(); onExit(); }}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl font-semibold"
            >
              Exit
            </button>
            <button
              onClick={() => window.location.href = '/premium'}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showExitConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">End Session?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This will permanently delete all messages and close the connection.
              This action cannot be undone.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={cancelExit}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
    <>
    <div className={`min-h-screen flex flex-col ${wallpaperStyles[chatWallpaper] || wallpaperStyles.default}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                  {isGroup ? 'Group Chat' : 'Secure Chat'}
                </h1>
                {nickname && (
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-xs font-semibold">
                    {nickname}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isConnecting 
                  ? 'Connecting...' 
                  : isConnected 
                  ? `🔒 E2E Encrypted • ⏱️ ${formatted} • 🔥 ${streak} day streak • 💬 ${totalMessages} msgs`
                  : 'Disconnected'}
              </p>
            </div>
          </div>

          {/* Controls / Personalization */}
          <div className="flex items-center space-x-2">
            {/* Copy Invite Link */}
            <button
              onClick={() => {
                const payload = btoa(JSON.stringify({ sessionId: session.sessionId, password: session.password, isGroup }));
                const link = `${window.location.origin}/join/${payload}`;
                navigator.clipboard.writeText(link);
                setError(null);
                alert('Invite link copied to clipboard!');
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
              title="Copy Invite Link"
            >
              🔗
            </button>

            {/* Avatar Selector Toggle */}
            <div className="relative">
              <button
                onClick={() => { setShowAvatarPicker(!showAvatarPicker); setShowWallpaperPicker(false); }}
                className={`p-1.5 rounded-lg text-xl transition-colors ${showAvatarPicker ? 'bg-purple-500 ring-2 ring-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                title="Change Avatar"
              >
                {customAvatar}
              </button>
              {showAvatarPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowAvatarPicker(false)} />
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-3 z-50 border border-gray-200 dark:border-gray-700 animate-scale-in">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mb-2 px-1">Choose Avatar</p>
                    <div className="flex flex-wrap gap-1 w-48">
                      {avatarsList.map(a => (
                        <button
                          key={a}
                          onClick={() => { setCustomAvatar(a); setShowAvatarPicker(false); }}
                          className={`text-2xl p-2 rounded-lg transition-all ${customAvatar === a ? 'bg-purple-500 scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Wallpaper Selector Toggle */}
            <div className="relative">
              <button
                onClick={() => { setShowWallpaperPicker(!showWallpaperPicker); setShowAvatarPicker(false); }}
                className={`p-2 rounded-lg transition-colors ${showWallpaperPicker ? 'bg-purple-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                title="Chat Wallpaper"
              >
                🎨
              </button>
              {showWallpaperPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowWallpaperPicker(false)} />
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-3 z-50 border border-gray-200 dark:border-gray-700 animate-scale-in w-40">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mb-2 px-1">Chat Wallpaper</p>
                    <div className="space-y-1">
                      {Object.keys(wallpaperStyles).map(w => (
                        <button
                          key={w}
                          onClick={() => { setChatWallpaper(w); setShowWallpaperPicker(false); }}
                          className={`w-full text-xs text-left px-3 py-2 rounded-lg capitalize transition-all ${chatWallpaper === w ? 'bg-purple-500 text-white font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'}`}
                        >
                          {w === 'default' && '🏠 '}
                          {w === 'dark' && '🌙 '}
                          {w === 'ocean' && '🌊 '}
                          {w === 'sunset' && '🌅 '}
                          {w === 'forest' && '🌲 '}
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Nickname Trigger */}
            <button
              onClick={() => setShowNicknameDialog(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
              title="Set Nickname"
            >
              🏷️
            </button>

            {/* Report */}
            <button
              onClick={() => setShowReport(true)}
              className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-yellow-600 transition-colors"
            >
              Report
            </button>

            {/* Exit */}
            <button
              onClick={handleExit}
              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
            >
              Exit
            </button>
          </div>

        </div>
      </div>

      {/* Gamification Streak Banner */}



      {/* Screenshot Alert */}
      {screenshotAlert && (
        <div className="bg-red-500 text-white text-center py-2 text-xs font-semibold animate-pulse">
          ⚠️ Screenshot detected! The other user may have captured the screen.
        </div>
      )}

      {/* Pinned Messages Bar */}
      {pinnedMessages.length > 0 && (
        <div className="bg-purple-100 dark:bg-purple-900/40 border-b border-purple-200 dark:border-purple-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <span className="text-purple-700 dark:text-purple-300 flex-shrink-0">📌 Pinned:</span>
            <span className="text-xs text-purple-900 dark:text-purple-200 truncate">
              {pinnedMessages[pinnedMessages.length - 1].content || 'Media message'}
            </span>
          </div>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex-shrink-0">
            ({pinnedMessages.length})
          </span>
        </div>
      )}

      {/* Messages Area – Drag & Drop Zone */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors ${dragOver ? 'bg-purple-100 dark:bg-purple-900/30 ring-4 ring-purple-400 ring-inset' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-500 bg-opacity-20 rounded-xl z-10 pointer-events-none">
            <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-2xl shadow-2xl text-center">
              <span className="text-4xl block mb-2">📁</span>
              <p className="font-bold text-gray-800 dark:text-white">Drop files here</p>
              <p className="text-xs text-gray-500">Supports images, videos, and documents</p>
            </div>
          </div>
        )}

        {isConnecting && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mb-3"></div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {isHost ? 'Waiting for peer connection...' : 'Connecting securely...'}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-800 dark:text-red-300">
            ⚠️ {error}
          </div>
        )}

        {!isConnecting && isConnected && messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
              💬
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Connected Securely!</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Send a message, voice note, or sticker. Everything is end-to-end encrypted.
            </p>
          </div>
        )}

        {displayMessages.map((message: Message) => {
          const isOwn = message.senderId === session.userId;
          const repliedMsg = message.replyTo ? messages.find(m => m.id === message.replyTo) : null;

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
            >
              <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                
                {/* Sender nickname and avatar for others */}
                {!isOwn && (
                  <div className="flex items-center space-x-1 mb-1 px-1">
                    <span className="text-xs">{message.avatar || '👤'}</span>
                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                      {message.nickname || 'Anonymous'}
                    </span>
                  </div>
                )}

                {/* Main Bubble */}
                <div
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedMessageId(message.id);
                    setReactionPosition({ x: e.clientX, y: e.clientY });
                    setShowReactions(true);
                  }}
                  className={`rounded-2xl px-4 py-2.5 shadow-sm relative ${
                    isOwn
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-none'
                  } ${message.pinned ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  {/* Replied Message Snippet */}
                  {repliedMsg && (
                    <div className="mb-1.5 px-2 py-1 bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-5 rounded text-xs border-l-2 border-white dark:border-purple-400">
                      <p className="font-semibold text-[10px] opacity-75">
                        {repliedMsg.senderId === session.userId ? 'You' : repliedMsg.nickname || 'Anonymous'}
                      </p>
                      <p className="truncate">{repliedMsg.content || 'Media'}</p>
                    </div>
                  )}

                  {/* Content types */}
                  {message.type === 'text' && (
                    <div className="break-words text-sm leading-relaxed">
                      {formatMessageContent(message.content)}
                    </div>
                  )}

                  {message.type === 'sticker' && (
                    <div className="text-6xl text-center py-2">{message.content}</div>
                  )}

                  {message.type === 'gif' && (
                    <img src={message.content} alt="GIF" className="rounded-lg max-w-full" />
                  )}

                  {message.type === 'image' && message.fileData && (
                    <div className="space-y-1">
                      <img
                        src={message.fileData}
                        alt={message.fileName}
                        className="rounded-lg max-w-full cursor-pointer hover:opacity-95"
                        onClick={() => downloadFile(message)}
                      />
                      <p className="text-[10px] opacity-75 truncate">{message.fileName}</p>
                    </div>
                  )}

                  {message.type === 'video' && message.fileData && (
                    <div className="space-y-1">
                      <video src={message.fileData} controls className="rounded-lg max-w-full" />
                      <p className="text-[10px] opacity-75 truncate">{message.fileName}</p>
                    </div>
                  )}

                  {message.type === 'voice' && message.fileData && (
                    <div className="flex items-center space-x-2 py-1">
                      <span className="text-lg">🎤</span>
                      <audio controls src={message.fileData} className="max-w-full h-8" />
                    </div>
                  )}

                  {message.type === 'file' && (
                    <div
                      onClick={() => downloadFile(message)}
                      className="flex items-center space-x-2 cursor-pointer bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-5 p-2 rounded-xl hover:bg-opacity-10"
                    >
                      <span className="text-2xl">📁</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{message.fileName}</p>
                        <p className="text-[10px] opacity-75">
                          {message.fileSize ? formatFileSize(message.fileSize) : 'Attachment'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reactions Display */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 -mb-1">
                      {Object.entries(
                        message.reactions.reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([emoji, count]) => (
                        <span
                          key={emoji}
                          onClick={() => handleReaction(message.id, emoji)}
                          className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold shadow-xs cursor-pointer hover:scale-105 flex items-center space-x-0.5"
                        >
                          <span>{emoji}</span>
                          {count > 1 && <span className="text-purple-600 dark:text-purple-400 font-bold">{count}</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer logic: Time, Edit, Pin, Delete, Reply controls */}
                <div className={`flex items-center space-x-2 mt-1 px-1 text-[10px] text-gray-500 dark:text-gray-400 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <span>{formatTime(message.timestamp)}</span>
                  
                  {message.edited && <span className="italic">(edited)</span>}
                  
                  {message.selfDestructAt && (
                    <span className="text-red-500 font-semibold animate-pulse">
                      🔥 {Math.max(0, Math.ceil((message.selfDestructAt - Date.now()) / 1000))}s
                    </span>
                  )}

                  {/* Quick message actions on hover */}
                  <div className="hidden group-hover:flex items-center space-x-1">
                    <button onClick={() => setReplyTo(message)} className="hover:text-purple-600" title="Reply">↩️</button>
                    <button onClick={() => handlePinMessage(message.id)} className="hover:text-yellow-600" title="Pin">📌</button>
                    {isOwn && (
                      <>
                        <button onClick={() => handleEditMessage(message.id)} className="hover:text-blue-600" title="Edit">✏️</button>
                        <button onClick={() => handleDeleteMessage(message.id)} className="hover:text-red-600" title="Delete">🗑️</button>
                      </>
                    )}
                  </div>

                  {/* Read receipts */}
                  {isOwn && readReceiptsEnabled && (
                    <span className="text-purple-500 font-bold">
                      {(message.readBy && message.readBy.length > 0) ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>

              </div>

              {/* Display own avatar */}
              {isOwn && (
                <div className="flex items-end mb-1 px-1">
                  <span className="text-xs">{customAvatar}</span>
                </div>
              )}

            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Remote Typing Indicator */}
      {remoteTyping && (
        <div className="px-6 py-1 text-xs text-purple-600 dark:text-purple-400 italic animate-pulse">
          💬 Peer is typing...
        </div>
      )}

      {/* Reply To Info Bar */}
      {replyTo && (
        <div className="bg-purple-50 dark:bg-gray-800 border-t border-purple-100 dark:border-gray-700 px-4 py-1.5 flex items-center justify-between">
          <div className="text-xs truncate">
            <span className="font-semibold text-purple-700 dark:text-purple-300">Replying to: </span>
            <span className="text-gray-600 dark:text-gray-300">{replyTo.content || 'Media file'}</span>
          </div>
          <button onClick={() => setReplyTo(null)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Input / Compose Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="max-w-6xl mx-auto flex items-center space-x-1 md:space-x-2">
          
          {/* Hidden Inputs — multiple file uploads supported */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
            multiple
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
            capture="environment"
          />

          {/* Attach */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected}
            className="p-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-40"
            title="Attach File"
          >
            📎
          </button>

          {/* Camera */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={!isConnected}
            className="p-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-40"
            title="Take Photo"
          >
            📷
          </button>

          {/* Stickers */}
          <button
            onClick={() => setShowStickerPicker(true)}
            disabled={!isConnected}
            className="p-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-40 text-lg"
            title="Stickers & GIFs"
          >
            😀
          </button>

          {/* Voice Note */}
          <button
            onClick={handleVoiceRecord}
            disabled={!isConnected}
            className={`p-2 rounded-full ${
              isRecordingVoice 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'text-gray-500 hover:text-purple-600 dark:hover:text-purple-400'
            } disabled:opacity-40`}
            title={isRecordingVoice ? "Stop Recording" : "Record Voice Message"}
          >
            🎤
          </button>

          {/* Self-Destruct Timer Config */}
          <select
            id="self-destruct-select"
            defaultValue="0"
            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded px-1.5 py-1 border-none focus:ring-1 focus:ring-purple-500"
            title="Auto-delete Timer"
          >
            <option value="0">⏳ Off</option>
            <option value="5">🔥 5s</option>
            <option value="10">🔥 10s</option>
            <option value="30">🔥 30s</option>
            <option value="60">🔥 1m</option>
            <option value="300">🔥 5m</option>
          </select>

          {/* Text Input */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendTextMessage();
            }}
            placeholder={isConnected ? t('chat.placeholder') + " (*bold*, _italic_, `code`)" : "Waiting for peer..."}
            disabled={!isConnected}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none text-sm"
          />

          {/* Send Button */}
          <button
            onClick={handleSendTextMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:opacity-95 disabled:opacity-40 transition-opacity text-sm flex-shrink-0"
          >
            Send
          </button>

        </div>
        {isTyping && <span className="text-[10px] text-gray-400 block mt-1">Typing...</span>}
      </div>
    </div>

    {/* Modals */}
    {showReactions && (
      <MessageReactionPicker
        position={reactionPosition}
        onReact={(emoji) => handleReaction(selectedMessageId, emoji)}
        onClose={() => setShowReactions(false)}
      />
    )}

    {showStickerPicker && (
      <StickerGifPicker
        onSelect={handleStickerOrGif}
        onClose={() => setShowStickerPicker(false)}
      />
    )}

    {showReport && (
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        sessionId={session.sessionId}
        userId={session.userId}
      />
    )}

    {/* Nickname Config Dialog */}
    {showNicknameDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl animate-scale-in">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Set Session Nickname</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            This nickname is sent with your messages in this session only.
          </p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 16))}
            placeholder="e.g. Maverick"
            className="w-full px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:border-purple-500 mb-4"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNicknameDialog(false)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1.5 rounded text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => setShowNicknameDialog(false)}
              className="flex-1 bg-purple-500 text-white py-1.5 rounded text-xs font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Confetti Easter Egg */}
    {confetti && (
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 14}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          >
            {['🎉', '🎊', '✨', '⭐', '💫', '🌟', '🎈', '🎆'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>
    )}

    {/* Streak Easter Egg */}
    {easterEggTriggered && (
      <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
        <div className="bg-black bg-opacity-70 rounded-3xl p-10 text-center animate-scale-in">
          <div className="text-7xl mb-4">🔥</div>
          <h2 className="text-4xl font-bold text-white mb-2">{streak} Day Streak!</h2>
          <p className="text-purple-300 text-lg">
            {streak >= 30 ? '🏆 Legendary chatter!' : streak >= 7 ? '⭐ Dedicated user!' : '🌱 Keep going!'}
          </p>
          <p className="text-gray-400 text-sm mt-2">{totalMessages} total messages sent</p>
        </div>
      </div>
    )}
    </>
  );
};

export default ChatRoom;
