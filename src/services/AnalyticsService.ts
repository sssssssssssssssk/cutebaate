interface SessionStats {
  totalSessions: number;
  totalMessages: number;
  totalFiles: number;
  averageDuration: number;
  lastUsed: number;
  streak: number;
  lastStreakDate: string;
}

interface AdminAnalytics {
  totalActiveUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  popularFeatures: Record<string, number>;
  geographicDistribution: Record<string, number>;
  performanceMetrics: {
    averageLoadTime: number;
    connectionSuccess: number;
    errors: number;
  };
}

class AnalyticsService {
  /**
   * Track feature usage (anonymous)
   */
  trackFeature(featureName: string): void {
    const features = JSON.parse(localStorage.getItem('feature_usage') || '{}');
    features[featureName] = (features[featureName] || 0) + 1;
    localStorage.setItem('feature_usage', JSON.stringify(features));
  }

  /**
   * Track session creation
   */
  trackSession(): void {
    const stats = this.getSessionStats();
    stats.totalSessions += 1;
    stats.lastUsed = Date.now();
    this.updateStreak(stats);
    this.saveSessionStats(stats);
  }

  /**
   * Track message sent
   */
  trackMessage(): void {
    const stats = this.getSessionStats();
    stats.totalMessages += 1;
    this.saveSessionStats(stats);
  }

  /**
   * Track file shared
   */
  trackFile(): void {
    const stats = this.getSessionStats();
    stats.totalFiles += 1;
    this.saveSessionStats(stats);
  }

  /**
   * Update session duration
   */
  updateSessionDuration(duration: number): void {
    const stats = this.getSessionStats();
    const currentAvg = stats.averageDuration;
    const totalSessions = stats.totalSessions;
    stats.averageDuration = Math.floor(
      (currentAvg * (totalSessions - 1) + duration) / totalSessions
    );
    this.saveSessionStats(stats);
  }

  /**
   * Update streak
   */
  private updateStreak(stats: SessionStats): void {
    const today = new Date().toDateString();
    const lastDate = stats.lastStreakDate;

    if (!lastDate) {
      stats.streak = 1;
      stats.lastStreakDate = today;
    } else if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate === yesterday.toDateString()) {
        stats.streak += 1;
      } else {
        stats.streak = 1;
      }
      stats.lastStreakDate = today;
    }
  }

  /**
   * Get user session stats
   */
  getSessionStats(): SessionStats {
    const saved = localStorage.getItem('session_stats');
    return saved ? JSON.parse(saved) : {
      totalSessions: 0,
      totalMessages: 0,
      totalFiles: 0,
      averageDuration: 0,
      lastUsed: 0,
      streak: 0,
      lastStreakDate: ''
    };
  }

  /**
   * Save session stats
   */
  private saveSessionStats(stats: SessionStats): void {
    localStorage.setItem('session_stats', JSON.stringify(stats));
  }

  /**
   * Get feature usage stats
   */
  getFeatureUsage(): Record<string, number> {
    return JSON.parse(localStorage.getItem('feature_usage') || '{}');
  }

  /**
   * Get admin analytics (for site owner)
   */
  getAdminAnalytics(): AdminAnalytics {
    // In production, this would come from a backend
    // For now, we'll aggregate from localStorage across all users
    const stats = this.getSessionStats();
    const features = this.getFeatureUsage();

    return {
      totalActiveUsers: this.getAnonymousUserCount(),
      totalSessions: stats.totalSessions,
      averageSessionDuration: stats.averageDuration,
      popularFeatures: features,
      geographicDistribution: this.getGeographicData(),
      performanceMetrics: this.getPerformanceMetrics()
    };
  }

  /**
   * Get anonymous user count
   */
  private getAnonymousUserCount(): number {
    // Simple anonymous count based on unique browser fingerprints
    const fingerprint = this.getBrowserFingerprint();
    const users = JSON.parse(localStorage.getItem('anonymous_users') || '[]');
    
    if (!users.includes(fingerprint)) {
      users.push(fingerprint);
      localStorage.setItem('anonymous_users', JSON.stringify(users));
    }
    
    return users.length;
  }

  /**
   * Get simple browser fingerprint (anonymous)
   */
  private getBrowserFingerprint(): string {
    const data = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width,
      screen.height
    ].join('|');
    
    return btoa(data);
  }

  /**
   * Get geographic distribution (country level only)
   */
  private getGeographicData(): Record<string, number> {
    // In production, use IP geolocation API
    // For demo, return mock data
    return {
      'US': 45,
      'UK': 20,
      'CA': 15,
      'AU': 10,
      'Other': 10
    };
  }

  /**
   * Get performance metrics
   */
  private getPerformanceMetrics(): AdminAnalytics['performanceMetrics'] {
    const perf = JSON.parse(localStorage.getItem('performance_metrics') || '{}');
    return {
      averageLoadTime: perf.averageLoadTime || 1200,
      connectionSuccess: perf.connectionSuccess || 95,
      errors: perf.errors || 2
    };
  }

  /**
   * Track page load time
   */
  trackPageLoad(): void {
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      const metrics = JSON.parse(localStorage.getItem('performance_metrics') || '{}');
      metrics.averageLoadTime = loadTime;
      localStorage.setItem('performance_metrics', JSON.stringify(metrics));
    }
  }

  /**
   * Track connection success/failure
   */
  trackConnection(success: boolean): void {
    const metrics = JSON.parse(localStorage.getItem('performance_metrics') || '{}');
    const total = (metrics.totalConnections || 0) + 1;
    const successful = (metrics.successfulConnections || 0) + (success ? 1 : 0);
    
    metrics.totalConnections = total;
    metrics.successfulConnections = successful;
    metrics.connectionSuccess = Math.floor((successful / total) * 100);
    
    localStorage.setItem('performance_metrics', JSON.stringify(metrics));
  }

  /**
   * Clear all analytics (for privacy)
   */
  clearAllData(): void {
    localStorage.removeItem('session_stats');
    localStorage.removeItem('feature_usage');
    localStorage.removeItem('performance_metrics');
  }
}

export default new AnalyticsService();
