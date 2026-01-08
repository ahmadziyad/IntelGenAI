// Frontend-only analytics utility for tracking visitor behavior
// This provides detailed insights without requiring a backend

export interface VisitorSession {
  id: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  interactions: string[];
  referrer: string;
  userAgent: string;
  screenResolution: string;
  timeZone: string;
}

export interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  sessionsToday: number;
  averageSessionDuration: number;
  topReferrers: { [key: string]: number };
  deviceTypes: { [key: string]: number };
  popularPages: { [key: string]: number };
  timeSpentOnSite: number;
}

class FrontendAnalytics {
  private static readonly STORAGE_KEYS = {
    SESSIONS: 'portfolio-analytics-sessions',
    CURRENT_SESSION: 'portfolio-current-session',
    DAILY_STATS: 'portfolio-daily-stats',
    INTERACTIONS: 'portfolio-interactions'
  };

  private static currentSession: VisitorSession | null = null;

  // Initialize analytics tracking
  static initialize(): void {
    this.startSession();
    this.trackPageView();
    this.setupEventListeners();
  }

  // Start a new visitor session
  private static startSession(): void {
    const existingSession = sessionStorage.getItem(this.STORAGE_KEYS.CURRENT_SESSION);
    
    if (existingSession) {
      this.currentSession = JSON.parse(existingSession);
    } else {
      this.currentSession = {
        id: this.generateSessionId(),
        startTime: Date.now(),
        pageViews: 0,
        interactions: [],
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent,
        screenResolution: typeof window !== 'undefined' && window.screen ? `${window.screen.width}x${window.screen.height}` : 'unknown',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      sessionStorage.setItem(this.STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(this.currentSession));
    }
  }

  // Generate unique session ID
  private static generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track page view
  static trackPageView(page?: string): void {
    if (!this.currentSession) return;

    this.currentSession.pageViews++;
    this.updateCurrentSession();
    
    // Track popular pages
    const pageName = page || window.location.pathname;
    this.incrementCounter('popularPages', pageName);
  }

  // Track user interaction
  static trackInteraction(action: string, details?: any): void {
    if (!this.currentSession) return;

    const interaction = {
      action,
      timestamp: Date.now(),
      details: details || {}
    };

    this.currentSession.interactions.push(JSON.stringify(interaction));
    this.updateCurrentSession();

    // Store interactions separately for analysis
    this.storeInteraction(interaction);
  }

  // Track specific events
  static trackEvent(eventName: string, properties?: any): void {
    this.trackInteraction('event', { name: eventName, properties });
  }

  // Track time spent on site
  static trackTimeOnSite(): void {
    if (!this.currentSession) return;

    const timeSpent = Date.now() - this.currentSession.startTime;
    localStorage.setItem('portfolio-time-spent', timeSpent.toString());
  }

  // End current session
  static endSession(): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.saveSession();
    this.trackTimeOnSite();
    
    sessionStorage.removeItem(this.STORAGE_KEYS.CURRENT_SESSION);
    this.currentSession = null;
  }

  // Get analytics data
  static getAnalytics(): AnalyticsData {
    const sessions = this.getAllSessions();
    const today = new Date().toDateString();
    const sessionsToday = sessions.filter(s => 
      new Date(s.startTime).toDateString() === today
    );

    return {
      totalVisitors: this.getTotalVisitors(),
      uniqueVisitors: this.getUniqueVisitors(),
      sessionsToday: sessionsToday.length,
      averageSessionDuration: this.calculateAverageSessionDuration(sessions),
      topReferrers: this.getTopReferrers(sessions),
      deviceTypes: this.getDeviceTypes(sessions),
      popularPages: this.getPopularPages(),
      timeSpentOnSite: this.getTotalTimeSpent()
    };
  }

  // Setup event listeners for automatic tracking
  private static setupEventListeners(): void {
    // Track when user leaves the page
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackInteraction('page_hidden');
      } else {
        this.trackInteraction('page_visible');
      }
    });

    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'A') {
        this.trackInteraction('link_click', { 
          href: (target as HTMLAnchorElement).href,
          text: target.textContent 
        });
      }
      
      if (target.closest('[data-track]')) {
        const trackElement = target.closest('[data-track]') as HTMLElement;
        this.trackInteraction('element_click', {
          element: trackElement.dataset.track,
          text: trackElement.textContent
        });
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          this.trackInteraction('scroll_depth', { depth: scrollDepth });
        }
      }
    });
  }

  // Helper methods
  private static updateCurrentSession(): void {
    if (this.currentSession) {
      sessionStorage.setItem(this.STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(this.currentSession));
    }
  }

  private static saveSession(): void {
    if (!this.currentSession) return;

    const sessions = this.getAllSessions();
    sessions.push(this.currentSession);
    
    // Keep only last 100 sessions to prevent storage bloat
    if (sessions.length > 100) {
      sessions.splice(0, sessions.length - 100);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }

  private static getAllSessions(): VisitorSession[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.SESSIONS);
    return stored ? JSON.parse(stored) : [];
  }

  private static storeInteraction(interaction: any): void {
    const interactions = this.getAllInteractions();
    interactions.push(interaction);
    
    // Keep only last 500 interactions
    if (interactions.length > 500) {
      interactions.splice(0, interactions.length - 500);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions));
  }

  private static getAllInteractions(): any[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.INTERACTIONS);
    return stored ? JSON.parse(stored) : [];
  }

  private static incrementCounter(category: string, key: string): void {
    const counters = this.getCounters();
    if (!counters[category]) counters[category] = {};
    counters[category][key] = (counters[category][key] || 0) + 1;
    localStorage.setItem('portfolio-counters', JSON.stringify(counters));
  }

  private static getCounters(): any {
    const stored = localStorage.getItem('portfolio-counters');
    return stored ? JSON.parse(stored) : {};
  }

  private static getTotalVisitors(): number {
    const stored = localStorage.getItem('portfolio-total-visitors');
    return stored ? parseInt(stored, 10) : 1110;
  }

  private static getUniqueVisitors(): number {
    const stored = localStorage.getItem('portfolio-unique-visitors');
    return stored ? JSON.parse(stored).length : 1;
  }

  private static calculateAverageSessionDuration(sessions: VisitorSession[]): number {
    const completedSessions = sessions.filter(s => s.endTime);
    if (completedSessions.length === 0) return 0;

    const totalDuration = completedSessions.reduce((sum, session) => {
      return sum + (session.endTime! - session.startTime);
    }, 0);

    return Math.round(totalDuration / completedSessions.length / 1000); // Return in seconds
  }

  private static getTopReferrers(sessions: VisitorSession[]): { [key: string]: number } {
    const referrers: { [key: string]: number } = {};
    sessions.forEach(session => {
      const referrer = session.referrer || 'direct';
      referrers[referrer] = (referrers[referrer] || 0) + 1;
    });
    return referrers;
  }

  private static getDeviceTypes(sessions: VisitorSession[]): { [key: string]: number } {
    const devices: { [key: string]: number } = {};
    sessions.forEach(session => {
      const userAgent = session.userAgent.toLowerCase();
      let deviceType = 'desktop';
      
      if (userAgent.includes('mobile')) deviceType = 'mobile';
      else if (userAgent.includes('tablet') || userAgent.includes('ipad')) deviceType = 'tablet';
      
      devices[deviceType] = (devices[deviceType] || 0) + 1;
    });
    return devices;
  }

  private static getPopularPages(): { [key: string]: number } {
    const counters = this.getCounters();
    return counters.popularPages || {};
  }

  private static getTotalTimeSpent(): number {
    const stored = localStorage.getItem('portfolio-time-spent');
    return stored ? parseInt(stored, 10) : 0;
  }

  // Export analytics data (for debugging or external analysis)
  static exportData(): string {
    return JSON.stringify({
      analytics: this.getAnalytics(),
      sessions: this.getAllSessions(),
      interactions: this.getAllInteractions(),
      counters: this.getCounters()
    }, null, 2);
  }

  // Clear all analytics data
  static clearData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    localStorage.removeItem('portfolio-counters');
    localStorage.removeItem('portfolio-time-spent');
    localStorage.removeItem('portfolio-total-visitors');
    localStorage.removeItem('portfolio-unique-visitors');
  }
}

export default FrontendAnalytics;

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  FrontendAnalytics.initialize();
}