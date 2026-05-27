import CryptoJS from 'crypto-js';

class EncryptionService {
  private encryptionKey: string | null = null;

  // Initialize encryption key from session password
  initializeKey(password: string): void {
    // Derive a key from the password using PBKDF2
    this.encryptionKey = CryptoJS.PBKDF2(password, 'securechat-salt', {
      keySize: 256 / 32,
      iterations: 1000
    }).toString();
  }

  // Encrypt message
  encrypt(message: string): { encrypted: string; iv: string } {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(message, this.encryptionKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return {
      encrypted: encrypted.toString(),
      iv: iv.toString(CryptoJS.enc.Hex)
    };
  }

  // Decrypt message
  decrypt(encrypted: string, ivHex: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    try {
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.encryptionKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return '[Decryption failed - Invalid password or corrupted data]';
    }
  }

  // Clear encryption key from memory
  clearKey(): void {
    this.encryptionKey = null;
  }
}

export default new EncryptionService();
