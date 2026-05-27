// Generate random session ID
export const generateSessionId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let sessionId = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) sessionId += '-';
    sessionId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sessionId;
};

// Generate random password
export const generatePassword = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Generate unique user ID
export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Validate session ID format
export const isValidSessionId = (sessionId: string): boolean => {
  const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(sessionId);
};

// Validate password
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Clean up all session data
export const cleanupSession = (): void => {
  // Clear all session storage
  sessionStorage.clear();
  
  // Clear all local storage related to chat
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('chat_') || key.startsWith('session_'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};
