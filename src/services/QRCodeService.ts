// QR Code generation for easy session joining
class QRCodeService {
  /**
   * Generate QR code data URL from session credentials
   */
  async generateQRCode(sessionId: string, password: string): Promise<string> {
    const data = JSON.stringify({ sessionId, password, app: 'SecureChat' });
    
    // Using a simple QR code generation
    // In production, use a library like 'qrcode' or 'qr-code-styling'
    const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
    
    return qrData;
  }

  /**
   * Parse QR code data
   */
  parseQRCode(data: string): { sessionId: string; password: string } | null {
    try {
      const parsed = JSON.parse(data);
      if (parsed.sessionId && parsed.password && parsed.app === 'SecureChat') {
        return { sessionId: parsed.sessionId, password: parsed.password };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Generate shareable link with encoded credentials
   */
  generateShareableLink(sessionId: string, password: string): string {
    const encoded = btoa(JSON.stringify({ sessionId, password }));
    return `${window.location.origin}/join/${encoded}`;
  }

  /**
   * Parse shareable link
   */
  parseShareableLink(encoded: string): { sessionId: string; password: string } | null {
    try {
      const decoded = atob(encoded);
      const parsed = JSON.parse(decoded);
      if (parsed.sessionId && parsed.password) {
        return { sessionId: parsed.sessionId, password: parsed.password };
      }
      return null;
    } catch {
      return null;
    }
  }
}

export default new QRCodeService();
