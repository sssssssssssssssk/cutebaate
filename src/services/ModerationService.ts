// Basic moderation service for detecting problematic content

interface ModerationResult {
  isFlagged: boolean;
  reasons: string[];
  severity: 'low' | 'medium' | 'high';
}

class ModerationService {
  private bannedWords: Set<string>;
  private spamThresholds = {
    maxCapsPercentage: 0.8, // 80% caps = spam
    maxRepeatedChars: 5, // 5+ repeated chars = spam
    urlLimit: 3 // More than 3 URLs in a message
  };

  constructor() {
    // Common inappropriate words (this is a basic list)
    // In production, use a more comprehensive database
    this.bannedWords = new Set([
      'hate', 'kill', 'murder', 'bomb', 'drug', 'illegal',
      // Add more as needed - keep it minimal to avoid false positives
    ].map(word => word.toLowerCase()));
  }

  /**
   * Check if message contains problematic content
   */
  analyzeMessage(message: string): ModerationResult {
    const reasons: string[] = [];
    let severity: 'low' | 'medium' | 'high' = 'low';

    // Check for banned words
    const lowerMessage = message.toLowerCase();
    for (const word of this.bannedWords) {
      if (lowerMessage.includes(word)) {
        reasons.push(`Contains potentially inappropriate language: "${word}"`);
        severity = 'medium';
      }
    }

    // Check for spam patterns
    const spamCheck = this.checkForSpam(message);
    if (spamCheck.isSpam) {
      reasons.push(...spamCheck.reasons);
      severity = 'medium';
    }

    // Check for excessive URLs
    const urlCount = (message.match(/https?:\/\//g) || []).length;
    if (urlCount > this.spamThresholds.urlLimit) {
      reasons.push(`Too many URLs in message (${urlCount})`);
      severity = 'medium';
    }

    // Check message length (extremely long messages might be spam)
    if (message.length > 5000) {
      reasons.push('Message is excessively long');
      severity = 'low';
    }

    return {
      isFlagged: reasons.length > 0,
      reasons,
      severity
    };
  }

  /**
   * Detect spam patterns
   */
  private checkForSpam(message: string): { isSpam: boolean; reasons: string[]; severity: 'low' | 'medium' | 'high' } {
    const reasons: string[] = [];
    let isSpam = false;

    // Check for excessive CAPS
    const capsCount = (message.match(/[A-Z]/g) || []).length;
    const capsPercentage = message.length > 0 ? capsCount / message.length : 0;
    
    if (capsPercentage > this.spamThresholds.maxCapsPercentage && message.length > 10) {
      reasons.push('Message contains excessive capital letters');
      isSpam = true;
    }

    // Check for repeated characters (e.g., "heeeeelllo")
    const repeatedCharPattern = /(.)\1{4,}/g;
    const repeatedMatches = message.match(repeatedCharPattern);
    if (repeatedMatches) {
      reasons.push(`Excessive character repetition detected (${repeatedMatches.join(', ')})`);
      isSpam = true;
    }

    // Check for repeated words/patterns
    const words = message.toLowerCase().split(/\s+/);
    const wordCount: { [key: string]: number } = {};
    
    for (const word of words) {
      if (word.length > 2) { // Ignore short words
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    }

    for (const [word, count] of Object.entries(wordCount)) {
      if (count > Math.ceil(words.length / 2)) {
        reasons.push(`Word "${word}" repeated excessively`);
        isSpam = true;
      }
    }

    return {
      isSpam,
      reasons,
      severity: isSpam ? 'medium' : 'low'
    };
  }

  /**
   * Get moderation report for a session
   */
  getSessionModerationReport(): any {
    const reports = JSON.parse(localStorage.getItem('abuse_reports') || '[]');
    return {
      totalReports: reports.length,
      reports: reports,
      summary: this.summarizeReports(reports)
    };
  }

  /**
   * Summarize abuse reports
   */
  private summarizeReports(reports: any[]): any {
    const summary: { [key: string]: number } = {};
    
    for (const report of reports) {
      summary[report.reportType] = (summary[report.reportType] || 0) + 1;
    }

    return summary;
  }

  /**
   * Clear moderation reports (admin only)
   */
  clearReports(): void {
    localStorage.removeItem('abuse_reports');
  }

  /**
   * Get moderation statistics
   */
  getStatistics(): any {
    const reports = JSON.parse(localStorage.getItem('abuse_reports') || '[]');
    const highSeverity = reports.filter((r: any) => r.severity === 'high').length;
    const mediumSeverity = reports.filter((r: any) => r.severity === 'medium').length;
    const lowSeverity = reports.filter((r: any) => r.severity === 'low').length;

    return {
      totalReports: reports.length,
      bySeverity: {
        high: highSeverity,
        medium: mediumSeverity,
        low: lowSeverity
      },
      byType: this.summarizeReports(reports),
      lastReport: reports.length > 0 ? reports[reports.length - 1].timestamp : null
    };
  }
}

export default new ModerationService();
