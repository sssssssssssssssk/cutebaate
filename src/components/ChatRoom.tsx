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
import { useRazorpay } from '../hooks/useRazorpay';
import { cleanupSession } from '../utils/sessionUtils';
import GroupManagementPanel from './GroupManagementPanel';
import PollCreator from './PollCreator';

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

const ChatRoom: React.FC<ChatRoomProps> = ({ session, isHost: isHostProp, isGroup = false, onExit }) => {
  const isHost = isHostProp && localStorage.getItem('active_chat_is_host') !== 'false';
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`chat_messages_${session.sessionId}`);
    return saved ? JSON.parse(saved) : [];
  });
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

  // Calling system states
  const [callState, setCallState] = useState<'idle' | 'outgoing' | 'incoming' | 'connected'>('idle');
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [incomingCallRef, setIncomingCallRef] = useState<any>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  // Group & Roster states
  const [groupMembers, setGroupMembers] = useState<any[]>(() => {
    return [
      { id: session.userId, nickname: localStorage.getItem('chat_nickname') || 'Anonymous', role: isHost ? 'host' : 'member', isOnline: true, joinedAt: Date.now() }
    ];
  });
  const [bannedUserIds, setBannedUserIds] = useState<string[]>([]);
  const [isMutedLocally, setIsMutedLocally] = useState(false);
  const [showGroupPanel, setShowGroupPanel] = useState(false);
  const [groupSettings, setGroupSettings] = useState({
    name: 'Secure Group Chat',
    description: 'End-to-end encrypted anonymous P2P group room',
    rules: 'Follow netiquette, respect privacy, do not spam.',
    maxMembers: 100
  });
  const [memberPermissions, setMemberPermissions] = useState({
    canSendMessages: true,
    canSendFiles: true,
    canSendLinks: true,
    canSendStickers: true,
    canCreatePolls: true
  });

  // Gift Premium states
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [isGiftProcessing, setIsGiftProcessing] = useState(false);
  const [showGiftConfetti, setShowGiftConfetti] = useState(false);

  // Poll state
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [selfDestructSec, setSelfDestructSec] = useState(0);

  const getInitials = (name: string) => {
    if (!name) return 'S';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500',
      'bg-blue-500', 'bg-sky-500', 'bg-teal-500', 'bg-green-500',
      'bg-emerald-500', 'bg-amber-500', 'bg-orange-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Touch swipe gesture refs & states for WhatsApp-style Swipe to Reply
  const touchStartXRef = useRef<number | null>(null);
  const currentSwipeMsgRef = useRef<string | null>(null);
  const [swipingMessageId, setSwipingMessageId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent, messageId: string) => {
    if (!isConnected) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    currentSwipeMsgRef.current = messageId;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || currentSwipeMsgRef.current === null) return;
    
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartXRef.current;
    
    // Slide toward the right side (positive X direction)
    if (diffX > 0) {
      const offset = Math.min(diffX, 70);
      setSwipingMessageId(currentSwipeMsgRef.current);
      setSwipeOffset(offset);
    }
  };

  const handleTouchEnd = (message: Message) => {
    if (currentSwipeMsgRef.current === message.id && swipeOffset > 45) {
      setReplyTo(message);
      
      // Native mobile haptic vibration feedback
      if (navigator.vibrate) {
        try {
          navigator.vibrate(15);
        } catch {}
      }
    }
    
    touchStartXRef.current = null;
    currentSwipeMsgRef.current = null;
    setSwipingMessageId(null);
    setSwipeOffset(0);
  };
  
  const { formatted } = useSessionDuration(session.createdAt);
  const { features, upgradeToPremium } = usePremium();
  const { t } = useLanguage();
  const { openCheckout } = useRazorpay();

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

  // Persist chat messages to survive accidental reloads
  useEffect(() => {
    if (session?.sessionId) {
      localStorage.setItem(`chat_messages_${session.sessionId}`, JSON.stringify(messages));
    }
  }, [messages, session.sessionId]);

  // Prevent accidental tab closes or page refreshes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave the chat room? Active chats will be preserved locally unless the Host ends the session.';
      return e.returnValue;
    };

    const handleUnload = () => {
      PeerService.destroy();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  // Screenshot detection — active by default
  useEffect(() => {
    const isEnabled = true;
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
    let retries = 3;
    let delay = 1500;

    const attemptInitialization = async (): Promise<void> => {
      try {
        EncryptionService.initializeKey(session.password);

        PeerService.onMessage(handleIncomingMessage);
        PeerService.onConnectionChange(handleConnectionChange);
        PeerService.onError(handlePeerError);

        await PeerService.initializePeer(session.sessionId, isHost, session.userId);
        
        const peer = PeerService.getPeer();
        if (peer) {
          peer.on('call', (call: any) => {
            setIncomingCallRef(call);
            setCallType(call.metadata?.isVideo ? 'video' : 'voice');
            setCallState('incoming');
          });
        }
        
        if (isHost) {
          setIsConnecting(true);
        } else {
          await PeerService.connectToPeer(session.sessionId);
          setIsConnecting(false);
        }
      } catch (err: any) {
        if (err.message?.includes('already in use') && retries > 0) {
          console.warn(`Peer ID lingering on server. Retrying in ${delay}ms... (${retries} attempts left)`);
          setIsConnecting(true);
          setError(`Connecting... (Reusing session, retrying in ${(delay / 1000).toFixed(1)}s)`);
          
          // Terminate current PeerJS instance before retrying
          PeerService.destroy();
          
          await new Promise(resolve => setTimeout(resolve, delay));
          retries--;
          delay += 1000;
          return attemptInitialization();
        }
        throw err;
      }
    };

    try {
      setError(null);
      await attemptInitialization();
      setError(null);
    } catch (error: any) {
      console.error('Failed to initialize chat:', error);
      setError(error.message || 'Failed to initialize chat');
      setIsConnecting(false);
    }
  };

  const handleIncomingMessage = (message: Message) => {
    // Check if the host exited the session
    if (message.type === 'host_exit') {
      alert("🔒 The Host has ended this session. All chats have been permanently deleted.");
      
      localStorage.removeItem('active_chat_session');
      localStorage.removeItem('active_chat_is_host');
      localStorage.removeItem('active_chat_is_group');
      localStorage.removeItem(`chat_messages_${session.sessionId}`);
      
      PeerService.destroy();
      cleanupSession();
      onExit();
      return;
    }

    // Check if we are kicked
    if (message.type === 'delete' && message.content === 'kick' && message.targetId === session.userId) {
      alert("⚠️ You have been kicked from this group chat by the Host.");
      PeerService.destroy();
      cleanupSession();
      onExit();
      return;
    }

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
      const { targetId, content: deleteType } = message;
      if (deleteType === 'everyone') {
        setMessages(prev => prev.map(msg => 
          msg.id === targetId ? { ...msg, deletedForEveryone: true } : msg
        ));
      } else {
        setMessages(prev => prev.filter(msg => msg.id !== targetId));
      }
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

    if (message.type === 'gift_premium') {
      setShowGiftConfetti(true);
      try {
        upgradeToPremium();
      } catch {}
      localStorage.setItem('premiumTier', 'premium');
      setTimeout(() => setShowGiftConfetti(false), 8000);
      return;
    }

    if (message.type === 'group_sync') {
      try {
        const roster = JSON.parse(message.content);
        setGroupMembers(roster);
      } catch {}
      return;
    }

    if (message.type === 'group_join') {
      if (!isHost) return;
      if (bannedUserIds.includes(message.senderId) || groupMembers.length >= groupSettings.maxMembers) {
        kickMember(message.senderId);
        return;
      }
      try {
        const profile = JSON.parse(message.content);
        const newMember = {
          id: message.senderId,
          nickname: profile.nickname || `Guest_${message.senderId.substring(0, 5)}`,
          avatar: profile.avatar || '👤',
          role: 'member',
          isOnline: true,
          joinedAt: Date.now()
        };
        const updated = [...groupMembers.filter(m => m.id !== message.senderId), newMember];
        setGroupMembers(updated);

        PeerService.sendMessage({
          id: `sync_${Date.now()}`,
          senderId: session.userId,
          content: JSON.stringify(updated),
          timestamp: Date.now(),
          type: 'group_sync'
        });
      } catch {}
      return;
    }

    if (message.type === 'group_mute') {
      if (message.targetId === session.userId) {
        setIsMutedLocally(message.content === 'true');
      }
      return;
    }

    if (message.type === 'poll_vote' && message.targetId) {
      const { targetId, content: optionId, senderId } = message;
      setMessages(prev => prev.map(msg => {
        if (msg.id === targetId && msg.poll) {
          const updatedOptions = msg.poll.options.map(opt => {
            if (opt.id === optionId) {
              const votes = opt.votes.includes(senderId)
                ? opt.votes.filter(id => id !== senderId)
                : [...opt.votes, senderId];
              return { ...opt, votes };
            }
            if (!msg.poll.allowMultiple) {
              return { ...opt, votes: opt.votes.filter(id => id !== senderId) };
            }
            return opt;
          });
          return { ...msg, poll: { ...msg.poll, options: updatedOptions } };
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
    
    if (connected && !isHost) {
      try {
        PeerService.sendMessage({
          id: `join_${Date.now()}`,
          senderId: session.userId,
          content: JSON.stringify({ nickname, avatar: customAvatar }),
          timestamp: Date.now(),
          type: 'group_join'
        });
      } catch {}
    }

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

    const sdVal = selfDestructSec;
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
    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;

    const isOwnMessage = msg.senderId === session.userId;
    
    // Group management permissions check
    const myRole = groupMembers.find(m => m.id === session.userId)?.role || (isHost ? 'host' : 'member');
    const canDeleteEveryone = isOwnMessage || isHost || myRole === 'admin' || myRole === 'moderator';

    if (!isOwnMessage) {
      if (canDeleteEveryone) {
        const choice = window.confirm(
          "You have management permissions. Do you want to 'Delete for Everyone'?\n\nClick 'OK' for Delete for Everyone, or 'Cancel' for Delete for Me."
        );
        if (choice) {
          executeDelete(messageId, 'everyone');
          return;
        }
      }
      executeDelete(messageId, 'me');
      return;
    }

    // Own message:
    const choice = window.confirm(
      "How would you like to delete this message?\n\n- Click 'OK' to DELETE FOR EVERYONE (WhatsApp Style)\n- Click 'Cancel' to DELETE FOR ME ONLY."
    );
    if (choice) {
      executeDelete(messageId, 'everyone');
    } else {
      const confirmMe = window.confirm("Delete this message for yourself only?");
      if (confirmMe) {
        executeDelete(messageId, 'me');
      }
    }
  };

  const executeDelete = (messageId: string, deleteType: 'me' | 'everyone') => {
    if (deleteType === 'everyone') {
      try {
        PeerService.sendMessage({
          id: `ctrl_${Date.now()}`,
          senderId: session.userId,
          content: 'everyone',
          timestamp: Date.now(),
          type: 'delete',
          targetId: messageId
        });
      } catch {}

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, deletedForEveryone: true } : msg
      ));
    } else {
      setMessages(prev => prev.filter(m => m.id !== messageId));
    }
    AnalyticsService.trackFeature('delete_message');
  };

  // ==========================================
  // 📞 WebRTC Audio & Video Calling Handlers
  // ==========================================
  const startCall = async (type: 'voice' | 'video') => {
    if (!isConnected) return;
    try {
      setCallType(type);
      setCallState('outgoing');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      });
      setLocalStream(stream);

      // Find partner's peer ID
      const connections = PeerService.getConnections();
      const partnerPeerId = isHost 
        ? (connections[0]?.peer) 
        : session.sessionId.replace(/-/g, '').toLowerCase();

      if (!partnerPeerId) {
        throw new Error('No active partner to call.');
      }

      const peer = PeerService.getPeer();
      if (!peer) throw new Error('Peer connection not initialized.');

      const call = peer.call(partnerPeerId, stream, {
        metadata: { isVideo: type === 'video' }
      });
      setActiveCall(call);

      call.on('stream', (rStream: MediaStream) => {
        setRemoteStream(rStream);
        setCallState('connected');
      });

      call.on('close', () => {
        endCallState();
      });

      call.on('error', (err: any) => {
        console.error('Call connection error:', err);
        endCallState();
      });

    } catch (err) {
      console.error('Failed to initiate call:', err);
      alert('Could not start call: Ensure camera/microphone permissions are granted.');
      endCallState();
    }
  };

  const acceptCall = async () => {
    if (!incomingCallRef) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video'
      });
      setLocalStream(stream);

      incomingCallRef.answer(stream);
      setActiveCall(incomingCallRef);
      setCallState('connected');

      incomingCallRef.on('stream', (rStream: MediaStream) => {
        setRemoteStream(rStream);
      });

      incomingCallRef.on('close', () => {
        endCallState();
      });

      incomingCallRef.on('error', (err: any) => {
        console.error('Call connection error:', err);
        endCallState();
      });

    } catch (err) {
      console.error('Failed to accept incoming call:', err);
      alert('Could not answer call: Make sure your camera/microphone is available.');
      declineCall();
    }
  };

  const declineCall = () => {
    if (incomingCallRef) {
      try {
        incomingCallRef.close();
      } catch {}
    }
    endCallState();
  };

  const toggleMuteAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const togglePauseVideo = () => {
    if (localStream && callType === 'video') {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoPaused(!isVideoPaused);
    }
  };

  const hangupCall = () => {
    if (activeCall) {
      try {
        activeCall.close();
      } catch {}
    }
    endCallState();
  };

  const endCallState = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setActiveCall(null);
    setIncomingCallRef(null);
    setCallState('idle');
    setIsAudioMuted(false);
    setIsVideoPaused(false);
  };

  const handleCreatePoll = (pollData: any) => {
    sendPayload({
      content: `📊 Poll: ${pollData.question}`,
      type: 'poll',
      poll: pollData
    });
    setShowPollCreator(false);
  };

  const handleGiftSubmit = () => {
    setIsGiftProcessing(true);
    const keyId = localStorage.getItem('razorpay_key_id') || 'rzp_test_eD2B6LpE9y9x1F';
    
    const options = {
      key: keyId,
      amount: 4900, // ₹49 in paise
      currency: 'INR',
      name: 'SecureChat Inc.',
      description: 'Gift Premium Subscription to Chat Partner',
      image: 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png',
      handler: function (response: any) {
        console.log('Gift Payment Successful:', response);
        localStorage.setItem('razorpay_gift_payment_id', response.razorpay_payment_id);
        
        setIsGiftProcessing(false);
        setShowGiftModal(false);
        try {
          PeerService.sendMessage({
            id: `gift_${Date.now()}`,
            senderId: session.userId,
            content: 'premium',
            timestamp: Date.now(),
            type: 'gift_premium'
          });
          alert(`Gift Sent Successfully! Transaction ID: ${response.razorpay_payment_id}. Your partner has been upgraded to Premium.`);
        } catch (err) {
          console.error('Failed to send E2E gift premium packet:', err);
          alert('Payment was successful, but E2E signaling failed. Please try messaging your partner.');
        }
      },
      modal: {
        ondismiss: function () {
          setIsGiftProcessing(false);
        }
      },
      prefill: {
        name: 'Anonymous Chat Gifter',
        email: 'gift@securechat.io',
        contact: '9999999999'
      },
      notes: {
        gift: 'premium_tier'
      },
      theme: {
        color: '#a855f7'
      }
    };

    try {
      openCheckout(options);
    } catch (err) {
      console.error('Razorpay gift checkout error:', err);
      setIsGiftProcessing(false);
    }
  };

  // ==========================================
  // 👥 Group Roster & Management Handlers
  // ==========================================
  const updateMemberRole = (targetUserId: string, role: 'host' | 'admin' | 'moderator' | 'member') => {
    if (!isHost) return;
    const updated = groupMembers.map(m => m.id === targetUserId ? { ...m, role } : m);
    setGroupMembers(updated);
    
    try {
      PeerService.sendMessage({
        id: `sync_${Date.now()}`,
        senderId: session.userId,
        content: JSON.stringify(updated),
        timestamp: Date.now(),
        type: 'group_sync'
      });
    } catch {}
  };

  const toggleMuteMember = (targetUserId: string) => {
    if (!isHost) return;
    const member = groupMembers.find(m => m.id === targetUserId);
    if (!member) return;

    const shouldMute = !member.isMuted;
    const updated = groupMembers.map(m => m.id === targetUserId ? { ...m, isMuted: shouldMute } : m);
    setGroupMembers(updated);

    try {
      PeerService.sendMessage({
        id: `sync_${Date.now()}`,
        senderId: session.userId,
        content: JSON.stringify(updated),
        timestamp: Date.now(),
        type: 'group_sync'
      });

      PeerService.sendMessage({
        id: `mute_${Date.now()}`,
        senderId: session.userId,
        content: shouldMute ? 'true' : 'false',
        timestamp: Date.now(),
        type: 'group_mute',
        targetId: targetUserId
      });
    } catch {}
  };

  const kickMember = (targetUserId: string) => {
    if (!isHost) return;
    
    try {
      PeerService.sendMessage({
        id: `kick_${Date.now()}`,
        senderId: session.userId,
        content: 'kick',
        timestamp: Date.now(),
        type: 'delete',
        targetId: targetUserId
      });
    } catch {}
    
    const updated = groupMembers.filter(m => m.id !== targetUserId);
    setGroupMembers(updated);
    
    try {
      PeerService.sendMessage({
        id: `sync_${Date.now()}`,
        senderId: session.userId,
        content: JSON.stringify(updated),
        timestamp: Date.now(),
        type: 'group_sync'
      });
    } catch {}
  };

  const banMember = (targetUserId: string) => {
    if (!isHost) return;
    setBannedUserIds(prev => [...prev, targetUserId]);
    kickMember(targetUserId);
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
    if (isHost) {
      try {
        PeerService.sendMessage({
          id: `ctrl_${Date.now()}`,
          senderId: session.userId,
          content: 'host_exit',
          timestamp: Date.now(),
          type: 'host_exit'
        });
      } catch (err) {
        console.error('Failed to broadcast host_exit signal:', err);
      }
      
      // Host permanently deletes their copy of the messages
      localStorage.removeItem(`chat_messages_${session.sessionId}`);
    }

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
    default: 'bg-[#efeae2] dark:bg-[#0b141a]',
    whatsapp: 'bg-[#efeae2] dark:bg-[#0b141a]',
    dark: 'bg-zinc-950',
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
              onClick={() => {
                localStorage.removeItem('active_chat_session');
                localStorage.removeItem('active_chat_is_host');
                localStorage.removeItem('active_chat_is_group');
                localStorage.removeItem(`chat_messages_${session.sessionId}`);
                PeerService.destroy();
                cleanupSession();
                onExit();
              }}
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

  const remoteMember = groupMembers.find(m => m.id !== session.userId);
  const partnerName = isGroup 
    ? groupSettings.name 
    : (remoteMember?.nickname || (isHost ? 'Guest Partner' : 'Session Host'));
  const partnerInitials = isGroup 
    ? getInitials(groupSettings.name) 
    : getInitials(remoteMember?.nickname || (isHost ? 'Guest Partner' : 'Session Host'));
  const partnerStatus = isConnecting 
    ? 'connecting...' 
    : isConnected 
    ? (isGroup ? `${groupMembers.filter(m => m.isOnline).length} online` : 'online') 
    : 'offline';
  const partnerColor = isGroup ? 'bg-emerald-650' : getAvatarColor(partnerName);

  return (
    <>
    <div className={`fixed inset-0 h-[100dvh] w-full overflow-hidden flex flex-col ${wallpaperStyles[chatWallpaper] || wallpaperStyles.default}`}>
      {/* WhatsApp Style Header */}
      <div className="bg-[#f0f2f5] dark:bg-[#202c33] border-b border-gray-250/20 dark:border-zinc-700/80 sticky top-0 z-30 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          
          <div className="flex items-center space-x-2.5">
            {/* Back Arrow */}
            <button
              onClick={handleExit}
              className="p-2 hover:bg-gray-200/50 dark:hover:bg-gray-750/50 rounded-full text-gray-700 dark:text-gray-300 cursor-pointer active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
              title="Exit Session"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Initials Avatar */}
            <div className={`w-10 h-10 rounded-full ${partnerColor} text-white flex items-center justify-center font-bold text-sm shadow-inner uppercase flex-shrink-0 select-none`}>
              {partnerInitials}
            </div>

            {/* User Title & Status */}
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-extrabold text-gray-800 dark:text-white truncate max-w-[120px] sm:max-w-[200px]">
                {partnerName}
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {partnerStatus}
              </p>
            </div>
          </div>

          {/* Controls / Personalization */}
          <div className="flex items-center space-x-1 relative">
            {/* Quick Audio Call (1-on-1 only) */}
            {isConnected && !isGroup && (
              <button
                onClick={() => startCall('voice')}
                className="p-2 hover:bg-[#25d366]/10 dark:hover:bg-[#25d366]/20 rounded-full text-gray-750 dark:text-gray-300 cursor-pointer transition-all active:scale-95 flex items-center justify-center flex-shrink-0"
                title="Voice Call"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            )}

            {/* 3-Dots Dropdown Trigger */}
            <button
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              className={`p-2 rounded-full text-gray-750 dark:text-gray-300 text-xl font-bold cursor-pointer transition-all active:scale-95 w-9 h-9 flex items-center justify-center ${showMenuDropdown ? 'bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400' : 'hover:bg-gray-250/50 dark:hover:bg-gray-750/50'}`}
              title="Menu Options"
            >
              ⋮
            </button>

            {/* Menu Dropdown Menu */}
            {showMenuDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenuDropdown(false)} />
                <div className="absolute right-2 top-12 w-56 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl rounded-2xl p-2 z-50 border border-gray-150/40 dark:border-zinc-800/80 animate-scale-in">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold mb-1.5 px-3 uppercase tracking-wider">Chat Options</p>
                  
                  {isConnected && !isGroup && (
                    <>
                      <button
                        onClick={() => { startCall('video'); setShowMenuDropdown(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 transition-colors flex items-center space-x-2.5 cursor-pointer"
                      >
                        <span className="text-base">📹</span>
                        <span>Video Call</span>
                      </button>
                      <button
                        onClick={() => { setShowGiftModal(true); setShowMenuDropdown(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-purple-700 dark:text-purple-450 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors flex items-center space-x-2.5 cursor-pointer"
                      >
                        <span className="text-base">💎</span>
                        <span>Gift Premium</span>
                      </button>
                    </>
                  )}

                  {isGroup && isConnected && (
                    <button
                      onClick={() => { setShowGroupPanel(true); setShowMenuDropdown(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors flex items-center space-x-2.5 cursor-pointer"
                    >
                      <span className="text-base">👥</span>
                      <span>Group Info</span>
                    </button>
                  )}

                  {/* Share Invite Link */}
                  <button
                    onClick={async () => {
                      setShowMenuDropdown(false);
                      let expiryHours = 0;
                      if (isGroup) {
                        const choice = window.prompt(
                          "Set Group Invite Link Expiry:\n\n1 - 1 Hour\n2 - 24 Hours\n3 - Never\n\nEnter 1, 2, or 3 (Default: 3):", 
                          "3"
                        );
                        if (choice === '1') expiryHours = 1;
                        else if (choice === '2') expiryHours = 24;
                      }
                      const expiryTimestamp = expiryHours > 0 ? Date.now() + expiryHours * 60 * 60 * 1000 : 0;

                      const payload = btoa(JSON.stringify({ 
                        sessionId: session.sessionId, 
                        password: session.password, 
                        isGroup,
                        expiresAt: expiryTimestamp
                      }));
                      const link = `${window.location.origin}/join/${payload}`;
                      
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: isGroup ? 'Join my Secure Group Chat' : 'Join my Secure Chat',
                            text: '🔒 I have invited you to a secure end-to-end encrypted chat on SecureChat!',
                            url: link
                          });
                        } catch (err) {
                          console.log('Share canceled or failed', err);
                        }
                      } else {
                        navigator.clipboard.writeText(link);
                        alert('Invite link copied to clipboard!');
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 transition-colors flex items-center space-x-2.5 cursor-pointer"
                  >
                    <span className="text-base">🔗</span>
                    <span>Invite Link</span>
                  </button>

                  {/* Nickname Trigger */}
                  <button
                    onClick={() => { setShowNicknameDialog(true); setShowMenuDropdown(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 transition-colors flex items-center space-x-2.5 cursor-pointer"
                  >
                    <span className="text-base">🏷️</span>
                    <span>Set Nickname</span>
                  </button>

                  {/* Avatar Selector Toggle */}
                  <button
                    onClick={() => { setShowAvatarPicker(true); setShowWallpaperPicker(false); setShowMenuDropdown(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 transition-colors flex items-center space-x-2.5 cursor-pointer"
                  >
                    <span className="text-base">{customAvatar}</span>
                    <span>Change Avatar</span>
                  </button>

                  {/* Wallpaper Selector Toggle */}
                  <button
                    onClick={() => { setShowWallpaperPicker(true); setShowAvatarPicker(false); setShowMenuDropdown(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 transition-colors flex items-center space-x-2.5 cursor-pointer"
                  >
                    <span className="text-base">🎨</span>
                    <span>Chat Wallpaper</span>
                  </button>

                  <div className="border-t border-gray-150/40 dark:border-zinc-800/60 my-1.5"></div>

                  {/* Self-Destruct Timer */}
                  <div className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 flex flex-col space-y-1 select-none">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">🔥 Auto-Delete Timer</span>
                    <select
                      value={selfDestructSec}
                      onChange={(e) => {
                        setSelfDestructSec(parseInt(e.target.value));
                        setShowMenuDropdown(false);
                      }}
                      className="w-full mt-1 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border border-gray-250/40 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs focus:ring-0 focus:outline-hidden cursor-pointer"
                    >
                      <option value="0">⏳ Timer: Off</option>
                      <option value="5">🔥 5 Seconds</option>
                      <option value="10">🔥 10 Seconds</option>
                      <option value="30">🔥 30 Seconds</option>
                      <option value="60">🔥 1 Minute</option>
                      <option value="300">🔥 5 Minutes</option>
                    </select>
                  </div>

                  <div className="border-t border-gray-150/40 dark:border-zinc-800/60 my-1.5"></div>

                  {/* Report */}
                  <button
                    onClick={() => { setShowReport(true); setShowMenuDropdown(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-yellow-600 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors flex items-center space-x-2.5 cursor-pointer"
                  >
                    <span className="text-base">⚠️</span>
                    <span>Report Chat</span>
                  </button>

                  {/* Exit */}
                  <button
                    onClick={() => { handleExit(); setShowMenuDropdown(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-red-650 dark:text-red-400 hover:bg-red-550/10 dark:hover:bg-red-950/20 transition-colors flex items-center space-x-2.5 cursor-pointer"
                  >
                    <span className="text-base">🚪</span>
                    <span>Exit Session</span>
                  </button>
                </div>
              </>
            )}

            {/* Avatar Selector Popup Panel */}
            {showAvatarPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAvatarPicker(false)} />
                <div className="absolute right-2 top-12 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-3 z-50 border border-gray-200 dark:border-gray-700 animate-scale-in">
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

            {/* Wallpaper Selector Popup Panel */}
            {showWallpaperPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowWallpaperPicker(false)} />
                <div className="absolute right-2 top-12 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-3 z-50 border border-gray-200 dark:border-gray-700 animate-scale-in w-40">
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
          <div className="flex-1 flex items-center justify-center py-12 select-none">
            <div className="bg-[#182533]/85 dark:bg-[#182533]/90 backdrop-blur-xl border border-[#2b394a] rounded-2xl w-full max-w-[280px] p-6 text-center shadow-2xl animate-scale-in">
              <h3 className="font-extrabold text-white text-[15px] sm:text-base tracking-wide Outfit">
                No messages here yet...
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Send a message or tap the greeting below.
              </p>
              
              {/* Cute greeting SVG bird */}
              <svg className="w-28 h-28 mx-auto my-5 animate-bounce cursor-pointer active:scale-95 transition-transform" viewBox="0 0 100 100" style={{ animationDuration: '3s' }} onClick={() => {
                sendPayload({ content: '👋 Hello there!', type: 'text' });
              }}>
                {/* Body */}
                <ellipse cx="50" cy="55" rx="25" ry="20" fill="#aee85b" />
                {/* Belly */}
                <ellipse cx="50" cy="58" rx="16" ry="12" fill="#fff" opacity="0.9" />
                {/* Head */}
                <circle cx="50" cy="35" r="18" fill="#aee85b" />
                {/* Hair tuft */}
                <path d="M46 18 C46 10, 38 12, 38 12 C38 12, 45 15, 48 18" fill="#4caf50" />
                <path d="M52 18 C52 8, 58 10, 58 10 C58 10, 53 14, 51 18" fill="#4caf50" />
                {/* Cheeks */}
                <circle cx="39" cy="39" r="3" fill="#ff5722" opacity="0.6" />
                <circle cx="61" cy="39" r="3" fill="#ff5722" opacity="0.6" />
                {/* Big happy eyes */}
                <circle cx="42" cy="34" r="5" fill="#1e293b" />
                <circle cx="41" cy="33" r="1.5" fill="#fff" />
                <circle cx="58" cy="34" r="5" fill="#1e293b" />
                <circle cx="57" cy="33" r="1.5" fill="#fff" />
                {/* Orange Beak */}
                <path d="M47 38 L53 38 L50 48 Z" fill="#ff9800" stroke="#f57c00" strokeWidth="1" strokeLinejoin="round" />
                {/* Wings */}
                <path d="M26 52 C18 52, 16 62, 24 64 C26 62, 27 56, 26 52" fill="#4caf50" />
                <path d="M74 52 C82 52, 84 62, 76 64 C74 62, 73 56, 74 52" fill="#4caf50" />
                {/* Little Orange Feet */}
                <path d="M43 74 L41 80" stroke="#ff9800" strokeWidth="3" strokeLinecap="round" />
                <path d="M43 74 L46 80" stroke="#ff9800" strokeWidth="3" strokeLinecap="round" />
                <path d="M57 74 L54 80" stroke="#ff9800" strokeWidth="3" strokeLinecap="round" />
                <path d="M57 74 L59 80" stroke="#ff9800" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <span className="inline-block bg-white/10 dark:bg-white/5 text-gray-300 text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 shadow-xs cursor-pointer hover:bg-white/15" onClick={() => {
                sendPayload({ content: '👋 Hello!', type: 'text' });
              }}>
                👋 Say Hello
              </span>
            </div>
          </div>
        )}

        {displayMessages.map((message: Message, index: number) => {
          const isOwn = message.senderId === session.userId;
          const repliedMsg = message.replyTo ? messages.find(m => m.id === message.replyTo) : null;

          // WhatsApp Date Separation Divider Logic
          const showDateDivider = index === 0 || 
            new Date(displayMessages[index - 1].timestamp).toDateString() !== new Date(message.timestamp).toDateString();
            
          const getDividerText = (timestamp: number) => {
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            const msgDate = new Date(timestamp).toDateString();
            
            if (msgDate === today) return 'TODAY';
            if (msgDate === yesterday) return 'YESTERDAY';
            return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
          };

          return (
            <React.Fragment key={message.id}>
              {/* Center Date Divider Capsule */}
              {showDateDivider && (
                <div className="flex justify-center my-3.5 select-none w-full animate-fade-in">
                  <span className="bg-white/90 dark:bg-zinc-800/90 text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] font-bold px-3.5 py-1 rounded-full shadow-xs border border-zinc-200/50 dark:border-zinc-700/50 tracking-wider">
                    {getDividerText(message.timestamp)}
                  </span>
                </div>
              )}

              {/* Message Row with Swipe Support */}
              <div
                className="flex items-center w-full relative overflow-visible select-none group mb-2 px-2"
                onTouchStart={(e) => handleTouchStart(e, message.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(message)}
              >
                {/* Curved Reply Action Icon behind bubble on the left */}
                {swipingMessageId === message.id && swipeOffset > 12 && (
                  <div 
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center bg-zinc-200 dark:bg-zinc-850 rounded-full w-7 h-7 shadow-xs border border-zinc-300 dark:border-zinc-800 text-[11px] pointer-events-none transition-all z-10"
                    style={{
                      opacity: Math.min((swipeOffset - 12) / 30, 1),
                      transform: `scale(${Math.min(swipeOffset / 45, 1.15)})`
                    }}
                  >
                    ↩️
                  </div>
                )}

                {/* Main Message Align Container */}
                <div 
                  className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} transition-transform`}
                  style={{
                    transform: swipingMessageId === message.id ? `translateX(${swipeOffset}px)` : 'translateX(0px)',
                    transition: swipingMessageId === message.id ? 'none' : 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <div className={`max-w-[85%] sm:max-w-[70%] ${isOwn ? 'order-2 ml-12' : 'order-1 mr-12'}`}>
                    
                    {/* Sender nickname and avatar for others in groups */}
                    {!isOwn && isGroup && (
                      <div className="flex items-center space-x-1 mb-1 px-1">
                        <span className="text-[10px]">{message.avatar || '👤'}</span>
                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                          {message.nickname || 'Anonymous'}
                        </span>
                      </div>
                    )}

                    {/* Main WhatsApp-style Bubble */}
                    <div
                      onContextMenu={(e) => {
                        if (message.deletedForEveryone) return;
                        e.preventDefault();
                        setSelectedMessageId(message.id);
                        setReactionPosition({ x: e.clientX, y: e.clientY });
                        setShowReactions(true);
                      }}
                      onDoubleClick={() => {
                        if (message.deletedForEveryone) return;
                        // Double Tap to React with Heart ❤️
                        handleReaction(message.id, '❤️');
                      }}
                      className={`shadow-xs px-3 py-2 relative rounded-2xl cursor-pointer select-text ${
                        message.deletedForEveryone
                          ? 'bg-gray-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl opacity-75'
                          : isOwn
                          ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-none'
                          : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none'
                      } ${message.pinned && !message.deletedForEveryone ? 'ring-2 ring-amber-400' : ''}`}
                      title={message.deletedForEveryone ? undefined : "Double tap to react with ❤️"}
                    >
                      {message.deletedForEveryone ? (
                        <div className="flex items-center space-x-1.5 py-1 text-xs text-zinc-400 dark:text-zinc-500 italic select-none">
                          <span>🚫</span>
                          <span>{isOwn ? 'You deleted this message' : 'This message was deleted'}</span>
                        </div>
                      ) : (
                        <>
                          {/* Replied Message Snippet (WhatsApp-style box) */}
                      {repliedMsg && (
                        <div className="mb-2 px-2.5 py-1.5 bg-black bg-opacity-[0.04] dark:bg-white dark:bg-opacity-5 rounded-lg text-xs border-l-4 border-emerald-500 dark:border-emerald-400 select-none">
                          <p className="font-bold text-[10px] text-emerald-600 dark:text-emerald-400">
                            {repliedMsg.senderId === session.userId ? 'You' : repliedMsg.nickname || 'Anonymous'}
                          </p>
                          <p className="truncate opacity-85 text-[11px]">{repliedMsg.content || 'Media'}</p>
                        </div>
                      )}

                      {/* Content types */}
                      {message.type === 'text' && (
                        <div className="break-words text-[14px] sm:text-[15px] leading-relaxed pr-8">
                          {formatMessageContent(message.content)}
                        </div>
                      )}

                      {message.type === 'sticker' && (
                        <div className="text-5xl text-center py-1.5">{message.content}</div>
                      )}

                      {message.type === 'poll' && message.poll && (
                        <div className="space-y-3.5 pr-8 select-none py-1 min-w-[240px]">
                          <div className="flex items-center space-x-1.5 text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                            <span>📊 Anonymous Poll</span>
                          </div>
                          <h4 className="font-bold text-gray-800 dark:text-zinc-100 text-[15px] sm:text-base leading-snug">
                            {message.poll.question}
                          </h4>
                          
                          {/* Poll Choices */}
                          <div className="space-y-2">
                            {message.poll.options.map((opt: any) => {
                              const totalVotes = message.poll.options.reduce((sum: number, o: any) => sum + (o.votes?.length || 0), 0);
                              const optVotes = opt.votes?.length || 0;
                              const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
                              const hasVoted = opt.votes?.includes(session.userId);

                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    if (message.poll.expiresAt && Date.now() > message.poll.expiresAt) {
                                      alert('This poll has expired.');
                                      return;
                                    }
                                    try {
                                      PeerService.sendMessage({
                                        id: `vote_${Date.now()}`,
                                        senderId: session.userId,
                                        content: opt.id,
                                        timestamp: Date.now(),
                                        type: 'poll_vote',
                                        targetId: message.id
                                      });
                                    } catch {}
                                    
                                    setMessages(prev => prev.map(m => {
                                      if (m.id === message.id && m.poll) {
                                        const updatedOptions = m.poll.options.map((o: any) => {
                                          if (o.id === opt.id) {
                                            const votes = o.votes.includes(session.userId)
                                              ? o.votes.filter((id: string) => id !== session.userId)
                                              : [...o.votes, session.userId];
                                            return { ...o, votes };
                                          }
                                          if (!m.poll.allowMultiple) {
                                            return { ...o, votes: o.votes.filter((id: string) => id !== session.userId) };
                                          }
                                          return o;
                                        });
                                        return { ...m, poll: { ...m.poll, options: updatedOptions } };
                                      }
                                      return m;
                                    }));
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl border relative overflow-hidden transition-all active:scale-98 cursor-pointer flex flex-col ${
                                    hasVoted 
                                      ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-500/10' 
                                      : 'border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 bg-white dark:bg-zinc-900'
                                  }`}
                                >
                                  <div 
                                    className="absolute inset-y-0 left-0 bg-purple-500/10 dark:bg-purple-500/15 pointer-events-none transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                  
                                  <div className="flex items-center justify-between w-full z-10 text-xs sm:text-sm font-semibold text-gray-800 dark:text-zinc-100">
                                    <span>{opt.text}</span>
                                    <span className="text-xs text-purple-600 dark:text-purple-400">{percentage}% ({optVotes})</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {message.type === 'gif' && (
                        <img src={message.content} alt="GIF" className="rounded-xl max-w-full" />
                      )}

                      {message.type === 'image' && message.fileData && (
                        <div className="space-y-1 select-none pr-8">
                          <img
                            src={message.fileData}
                            alt={message.fileName}
                            className="rounded-xl max-w-full cursor-pointer hover:opacity-95 shadow-xs"
                            onClick={() => downloadFile(message)}
                          />
                          <p className="text-[10px] opacity-75 truncate">{message.fileName}</p>
                        </div>
                      )}

                      {message.type === 'video' && message.fileData && (
                        <div className="space-y-1 pr-8">
                          <video src={message.fileData} controls className="rounded-xl max-w-full" />
                          <p className="text-[10px] opacity-75 truncate">{message.fileName}</p>
                        </div>
                      )}

                      {message.type === 'voice' && message.fileData && (
                        <div className="flex items-center space-x-2 py-1 pr-8">
                          <span className="text-xl">🎤</span>
                          <audio controls src={message.fileData} className="max-w-full h-8" />
                        </div>
                      )}

                      {message.type === 'file' && (
                        <div
                          onClick={() => downloadFile(message)}
                          className="flex items-center space-x-3.5 cursor-pointer bg-black bg-opacity-[0.03] dark:bg-white dark:bg-opacity-5 p-2 rounded-xl hover:bg-opacity-10 pr-8"
                        >
                          <span className="text-3xl">📁</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate text-[#111b21] dark:text-[#e9edef]">{message.fileName}</p>
                            <p className="text-[10px] opacity-75">
                              {message.fileSize ? formatFileSize(message.fileSize) : 'Attachment'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Reactions Display (WhatsApp rounded bubbles) */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 -mb-1">
                          {Object.entries(
                            message.reactions.reduce((acc, r) => {
                              acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          ).map(([emoji, count]) => (
                            <span
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className="bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-xs cursor-pointer hover:scale-105 flex items-center space-x-1 border border-zinc-100 dark:border-zinc-700/80"
                            >
                              <span>{emoji}</span>
                              {count > 1 && <span className="text-emerald-500 font-bold">{count}</span>}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* WhatsApp Inline Footer: Floating time and double receipts */}
                      <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-zinc-500 dark:text-zinc-400/70 select-none float-right ml-2">
                        <span>{formatTime(message.timestamp)}</span>
                        {message.edited && <span className="italic">(edited)</span>}
                        {isOwn && readReceiptsEnabled && (
                          <span className={`text-[12px] leading-none ${message.readBy && message.readBy.length > 0 ? 'text-[#53bdeb]' : 'text-zinc-400 dark:text-zinc-500'}`}>
                            {message.readBy && message.readBy.length > 0 ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                    {/* External Hover Utility Footer: Self-destruct and Quick Action Capsule */}
                    <div className={`flex items-center space-x-2 mt-0.5 px-1 text-[10px] text-gray-500 dark:text-gray-400 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      {message.selfDestructAt && (
                        <span className="text-red-500 font-semibold animate-pulse flex items-center space-x-0.5">
                          <span>🔥</span>
                          <span>{Math.max(0, Math.ceil((message.selfDestructAt - Date.now()) / 1000))}s</span>
                        </span>
                      )}

                      {/* Hover capsule for actions */}
                      <div className="hidden group-hover:flex items-center space-x-2 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full shadow-xs border border-zinc-100 dark:border-zinc-700 select-none transition-all">
                        <button onClick={() => setReplyTo(message)} className="hover:text-emerald-500 cursor-pointer" title="Reply">↩️</button>
                        <button onClick={() => handlePinMessage(message.id)} className="hover:text-yellow-500 cursor-pointer" title="Pin">📌</button>
                        {isOwn && (
                          <>
                            <button onClick={() => handleEditMessage(message.id)} className="hover:text-blue-500 cursor-pointer" title="Edit">✏️</button>
                            <button onClick={() => handleDeleteMessage(message.id)} className="hover:text-red-500 cursor-pointer" title="Delete">🗑️</button>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </React.Fragment>
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
      <div className="bg-[#f0f2f5] dark:bg-[#182533] border-t border-gray-250/20 dark:border-zinc-800/80 p-3.5 sticky bottom-0 z-30 transition-colors">
        <div className="max-w-6xl mx-auto">
          
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

          {/* TG Style Responsive Compose Bar */}
          <div className="flex items-center space-x-2 w-full relative">
            
            {/* Pill Capsule Wrapper: Smiley, Input, Self-Destruct indicator, Attachments, Camera */}
            <div className="flex-1 bg-white dark:bg-[#202c33] rounded-full border border-gray-250/30 dark:border-zinc-700/50 flex items-center px-3 py-1.5 shadow-xs transition-colors">
              {/* Emoji/Sticker Trigger */}
              <button
                onClick={() => setShowStickerPicker(true)}
                disabled={!isConnected}
                className="p-1 text-gray-500 dark:text-zinc-400 hover:text-blue-500 disabled:opacity-40 text-xl flex-shrink-0 cursor-pointer transition-colors"
                title="Stickers & GIFs"
              >
                😊
              </button>
              
              {/* Message Input Box */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendTextMessage();
                }}
                placeholder={isConnected ? t('chat.placeholder') + " (*bold*, _italic_)" : "Waiting for peer..."}
                disabled={!isConnected}
                className="flex-1 min-w-0 bg-transparent border-none outline-hidden focus:ring-0 px-2 text-[14px] sm:text-[15px] text-gray-800 dark:text-zinc-100 placeholder-gray-455 dark:placeholder-zinc-550"
              />

              {/* Micro Timer Display (if self-destruct is active in 3dots menu) */}
              {selfDestructSec > 0 && (
                <span 
                  onClick={() => setShowMenuDropdown(true)}
                  className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20 mr-1.5 animate-pulse cursor-pointer flex items-center space-x-0.5 flex-shrink-0"
                  title="Self-Delete Timer Active - Click to change"
                >
                  <span>🔥</span>
                  <span>{selfDestructSec}s</span>
                </span>
              )}
              
              {/* Attach File (📎) */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!isConnected}
                className="p-1 text-gray-500 dark:text-zinc-400 hover:text-blue-500 disabled:opacity-40 flex-shrink-0 cursor-pointer transition-colors"
                title="Attach File"
              >
                📎
              </button>
              
              {/* Camera (📷) - only visible on sm/wider screens to prevent mobile overflow */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={!isConnected}
                className="hidden sm:block p-1 text-gray-500 dark:text-zinc-400 hover:text-blue-500 disabled:opacity-40 flex-shrink-0 cursor-pointer transition-colors ml-1"
                title="Take Photo"
              >
                📷
              </button>

              {/* Poll Creator Trigger */}
              {isGroup && memberPermissions.canCreatePolls && (
                <button
                  onClick={() => setShowPollCreator(true)}
                  disabled={!isConnected}
                  className="hidden sm:block p-1 text-gray-500 dark:text-zinc-400 hover:text-blue-500 disabled:opacity-40 flex-shrink-0 cursor-pointer transition-colors text-lg ml-1"
                  title="Create Poll"
                >
                  📊
                </button>
              )}
            </div>

            {/* Dynamic Blue Circle Button: Microphone (when empty) / Send (when typing) */}
            <button
              onClick={inputMessage.trim() ? handleSendTextMessage : handleVoiceRecord}
              disabled={!isConnected}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center flex-shrink-0 active:scale-90 transition-all shadow-md cursor-pointer disabled:opacity-50 ${
                isRecordingVoice 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              title={inputMessage.trim() ? "Send Message" : (isRecordingVoice ? "Stop Recording" : "Record Voice Message")}
            >
              {inputMessage.trim() ? (
                // Elegant paper-airplane send icon
                <svg className="w-5 h-5 transform rotate-45 -translate-x-0.5 -translate-y-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              ) : (
                // Dynamic Microphone icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          </div>
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

    {/* Poll Creator Modal */}
    {showPollCreator && (
      <PollCreator
        userId={session.userId}
        onCreatePoll={handleCreatePoll}
        onClose={() => setShowPollCreator(false)}
      />
    )}

    {/* Group Info / Management Panel */}
    {showGroupPanel && (
      <GroupManagementPanel
        isHost={isHost}
        currentUserId={session.userId}
        members={groupMembers}
        onPromoteToAdmin={(userId) => {
          updateMemberRole(userId, 'admin');
        }}
        onPromoteToModerator={(userId) => {
          updateMemberRole(userId, 'moderator');
        }}
        onDemote={(userId) => {
          updateMemberRole(userId, 'member');
        }}
        onMute={(userId) => {
          toggleMuteMember(userId);
        }}
        onKick={(userId) => {
          kickMember(userId);
        }}
        onBan={(userId) => {
          banMember(userId);
        }}
        onClose={() => setShowGroupPanel(false)}
      />
    )}

    {/* Gift Premium Checkout Modal */}
    {showGiftModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in select-none">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col transition-all">
          <div className="px-6 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-between">
            <h3 className="font-extrabold text-lg flex items-center space-x-2">
              <span>🎁</span>
              <span>Gift Premium to Partner</span>
            </h3>
            <button onClick={() => setShowGiftModal(false)} className="text-white hover:text-purple-100 font-bold cursor-pointer">✕</button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">
              Surprise your chat partner with complete premium tier upgrades! They will receive a full celebration card and enjoy instant elevated features.
            </p>
            
            {/* Plans List */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border-2 border-purple-500 bg-purple-500/5 dark:bg-purple-500/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-zinc-100 text-sm">💎 1-Month Premium Pass</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">50MB uploads • 24h sessions • No ads</p>
                </div>
                <span className="font-extrabold text-purple-600 dark:text-purple-400">₹49</span>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl p-3.5 text-xs text-purple-700 dark:text-purple-300">
              ⚡ Safe E2E upgrade: The recipient upgrades instantly once the secure checkout completes.
            </div>
          </div>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-950 flex space-x-3">
            <button
              onClick={() => setShowGiftModal(false)}
              className="flex-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 py-3 rounded-xl text-sm font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGiftSubmit}
              disabled={isGiftProcessing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl text-sm font-bold shadow-md cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isGiftProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Pay ₹49 💎</span>
              )}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Gift Confetti & Upgraded Overlay */}
    {showGiftConfetti && (
      <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center animate-fade-in p-6">
        {/* Confetti Celebration Rain */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 24 + 14}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2.5 + 1}s`,
              }}
            >
              {['🎉', '🎊', '✨', '⭐', '💎', '🎁', '🎈'][Math.floor(Math.random() * 7)]}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-purple-500/30 relative overflow-hidden animate-scale-in">
          <div className="text-7xl mb-4 animate-bounce">🎁💎🎉</div>
          <h2 className="text-3xl font-extrabold tracking-wide mb-2">Congratulations!</h2>
          <p className="text-purple-200 text-lg font-medium mb-4">
            Your chat partner has gifted you **PREMIUM TIER**!
          </p>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10 mb-6 text-sm text-gray-200">
            ✨ 50MB File Uploads • 24h Longer Sessions • Ad-Free Experience • Priority Speeds
          </div>
          <button
            onClick={() => setShowGiftConfetti(false)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Enjoy Premium! 🚀
          </button>
        </div>
      </div>
    )}

    {/* Call Overlay Modal (Free Tier calling) */}
    {callState !== 'idle' && (
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex flex-col items-center justify-between p-8 text-white select-none animate-fade-in">
        {/* Call Info Header */}
        <div className="text-center mt-12 space-y-3">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-5xl shadow-2xl animate-pulse">
              {callType === 'video' ? '📹' : '📞'}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-6 h-6 border-2 border-white flex items-center justify-center text-xs">
              ⚡
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-wide">
              {isHost ? 'Guest Partner' : 'Session Host'}
            </h2>
            <p className="text-sm text-gray-400 capitalize animate-pulse mt-1">
              {callState === 'outgoing' && 'Calling...'}
              {callState === 'incoming' && `Incoming ${callType} Call`}
              {callState === 'connected' && 'Connected'}
            </p>
          </div>
        </div>

        {/* Video Feeds Container */}
        {callType === 'video' && callState === 'connected' && (
          <div className="flex-1 w-full max-w-lg my-6 rounded-2xl overflow-hidden relative shadow-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            {/* Remote Feed */}
            {remoteStream && (
              <video
                ref={(el) => {
                  if (el) el.srcObject = remoteStream;
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Local Miniature Feed */}
            {localStream && !isVideoPaused && (
              <div className="absolute top-4 right-4 w-28 h-40 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg bg-zinc-800">
                <video
                  ref={(el) => {
                    if (el) el.srcObject = localStream;
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Audio Elements (For voice calls, hidden audio tracks) */}
        {callType === 'voice' && callState === 'connected' && remoteStream && (
          <audio
            ref={(el) => {
              if (el) el.srcObject = remoteStream;
            }}
            autoPlay
          />
        )}

        {/* Call Controls Bar */}
        <div className="mb-12 flex items-center space-x-6">
          {callState === 'incoming' ? (
            <>
              {/* Answer Button */}
              <button
                onClick={acceptCall}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white text-3xl shadow-xl transition-all hover:scale-105 cursor-pointer active:scale-95"
                title="Accept Call"
              >
                📞
              </button>
              
              {/* Decline Button */}
              <button
                onClick={declineCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-3xl shadow-xl transition-all hover:scale-105 cursor-pointer active:scale-95 animate-pulse"
                title="Decline Call"
              >
                🔴
              </button>
            </>
          ) : (
            <>
              {/* Mute Audio Button */}
              <button
                onClick={toggleMuteAudio}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all hover:scale-105 cursor-pointer active:scale-95 ${
                  isAudioMuted ? 'bg-orange-500' : 'bg-white/10 hover:bg-white/20'
                }`}
                title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isAudioMuted ? '🔇' : '🎙️'}
              </button>

              {/* End Call Button */}
              <button
                onClick={hangupCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-3xl shadow-xl transition-all hover:scale-105 cursor-pointer active:scale-95"
                title="End Call"
              >
                🔴
              </button>

              {/* Pause Video Button (Video Call only) */}
              {callType === 'video' && (
                <button
                  onClick={togglePauseVideo}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all hover:scale-105 cursor-pointer active:scale-95 ${
                    isVideoPaused ? 'bg-orange-500' : 'bg-white/10 hover:bg-white/20'
                  }`}
                  title={isVideoPaused ? 'Resume Video' : 'Pause Video'}
                >
                  {isVideoPaused ? '❌📹' : '📹'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    )}
    </>
  );
};



export default ChatRoom;
