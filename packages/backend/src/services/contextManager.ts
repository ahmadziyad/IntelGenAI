import { Message, ConversationContext } from '@intelligenai/shared';
import { logger } from '../utils/logger';

export interface ContextConfig {
  maxMessages: number;
  maxTokens: number;
  compressionThreshold: number;
  retentionHours: number;
}

export interface ContextSummary {
  summary: string;
  messageCount: number;
  timespan: string;
  keyTopics: string[];
}

export class ContextManager {
  private config: ContextConfig;
  private contextStore: Map<string, ConversationContext> = new Map();

  constructor(config?: Partial<ContextConfig>) {
    this.config = {
      maxMessages: 50,
      maxTokens: 4000,
      compressionThreshold: 30,
      retentionHours: 24,
      ...config
    };

    logger.info('Context Manager initialized', { config: this.config });
  }

  /**
   * Update conversation context with a new message
   */
  updateContext(sessionId: string, message: Message): ConversationContext {
    let context = this.contextStore.get(sessionId);
    
    if (!context) {
      context = this.createNewContext();
    }

    // Add the new message
    context.messages.push(message);

    // Update current intent if provided in message metadata
    if (message.metadata?.intent) {
      context.currentIntent = message.metadata.intent;
    }

    // Optimize context if it's getting too large
    if (context.messages.length > this.config.compressionThreshold) {
      context = this.optimizeContext(context);
    }

    // Store updated context
    this.contextStore.set(sessionId, context);

    logger.debug('Context updated', {
      sessionId,
      messageCount: context.messages.length,
      currentIntent: context.currentIntent
    });

    return context;
  }

  /**
   * Get conversation context for a session
   */
  getContext(sessionId: string): ConversationContext | null {
    const context = this.contextStore.get(sessionId);
    
    if (!context) {
      logger.debug('No context found for session', { sessionId });
      return null;
    }

    // Check if context is still valid (not expired)
    const lastMessage = context.messages[context.messages.length - 1];
    if (lastMessage && this.isContextExpired(lastMessage.timestamp)) {
      this.clearContext(sessionId);
      return null;
    }

    return context;
  }

  /**
   * Clear context for a specific session
   */
  clearContext(sessionId: string): void {
    this.contextStore.delete(sessionId);
    logger.debug('Context cleared', { sessionId });
  }

  /**
   * Get context summary for a session
   */
  getContextSummary(sessionId: string): ContextSummary | null {
    const context = this.getContext(sessionId);
    
    if (!context || context.messages.length === 0) {
      return null;
    }

    const messages = context.messages;
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    
    const timespan = this.calculateTimespan(firstMessage.timestamp, lastMessage.timestamp);
    const keyTopics = this.extractKeyTopics(messages);
    const summary = this.generateSummary(messages);

    return {
      summary,
      messageCount: messages.length,
      timespan,
      keyTopics
    };
  }

  /**
   * Update user preferences in context
   */
  updateUserPreferences(sessionId: string, preferences: Partial<ConversationContext['userPreferences']>): void {
    const context = this.getContext(sessionId);
    
    if (context) {
      context.userPreferences = {
        preferredResponseLength: 'medium',
        voiceEnabled: false,
        theme: 'auto',
        ...context.userPreferences,
        ...preferences
      };
      
      this.contextStore.set(sessionId, context);
      
      logger.debug('User preferences updated', { sessionId, preferences });
    }
  }

  /**
   * Update onboarding step
   */
  updateOnboardingStep(sessionId: string, step: number): void {
    const context = this.getContext(sessionId);
    
    if (context) {
      context.onboardingStep = step;
      this.contextStore.set(sessionId, context);
      
      logger.debug('Onboarding step updated', { sessionId, step });
    }
  }

  /**
   * Update troubleshooting state
   */
  updateTroubleshootingState(
    sessionId: string, 
    state: Partial<ConversationContext['troubleshootingState']>
  ): void {
    const context = this.getContext(sessionId);
    
    if (context) {
      context.troubleshootingState = {
        attemptedSolutions: [],
        escalationLevel: 0,
        ...context.troubleshootingState,
        ...state
      };
      
      this.contextStore.set(sessionId, context);
      
      logger.debug('Troubleshooting state updated', { sessionId, state });
    }
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): {
    totalSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
    memoryUsageEstimate: string;
  } {
    const totalSessions = this.contextStore.size;
    let totalMessages = 0;

    for (const context of this.contextStore.values()) {
      totalMessages += context.messages.length;
    }

    const averageMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;
    
    // Rough memory estimate (each message ~1KB)
    const memoryUsageEstimate = `${Math.round(totalMessages / 1024)} MB`;

    return {
      totalSessions,
      totalMessages,
      averageMessagesPerSession: Math.round(averageMessagesPerSession * 100) / 100,
      memoryUsageEstimate
    };
  }

  /**
   * Cleanup expired contexts
   */
  cleanupExpiredContexts(): number {
    let cleanedCount = 0;

    for (const [sessionId, context] of this.contextStore.entries()) {
      if (context.messages.length === 0) {
        this.contextStore.delete(sessionId);
        cleanedCount++;
        continue;
      }

      const lastMessage = context.messages[context.messages.length - 1];
      if (this.isContextExpired(lastMessage.timestamp)) {
        this.contextStore.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Cleaned up expired contexts', { cleanedCount });
    }

    return cleanedCount;
  }

  /**
   * Create a new conversation context
   */
  private createNewContext(): ConversationContext {
    return {
      messages: [],
      currentIntent: undefined,
      userPreferences: {
        preferredResponseLength: 'medium',
        voiceEnabled: false,
        theme: 'auto'
      },
      onboardingStep: undefined,
      troubleshootingState: {
        attemptedSolutions: [],
        escalationLevel: 0
      }
    };
  }

  /**
   * Optimize context by compressing old messages
   */
  private optimizeContext(context: ConversationContext): ConversationContext {
    const messages = context.messages;
    
    if (messages.length <= this.config.maxMessages) {
      return context;
    }

    logger.debug('Optimizing context', { 
      currentMessages: messages.length, 
      maxMessages: this.config.maxMessages 
    });

    // Keep the most recent messages
    const recentMessages = messages.slice(-this.config.maxMessages);
    
    // Create a summary of older messages
    const olderMessages = messages.slice(0, -this.config.maxMessages);
    if (olderMessages.length > 0) {
      const summary = this.generateSummary(olderMessages);
      
      // Add summary as a system message
      const summaryMessage: Message = {
        id: `summary-${Date.now()}`,
        sessionId: context.messages[0].sessionId,
        content: `Previous conversation summary: ${summary}`,
        type: 'system',
        timestamp: new Date(),
        metadata: {
          intent: 'summary'
        }
      };
      
      recentMessages.unshift(summaryMessage);
    }

    return {
      ...context,
      messages: recentMessages
    };
  }

  /**
   * Check if context has expired
   */
  private isContextExpired(timestamp: Date): boolean {
    const now = new Date();
    const expirationTime = new Date(timestamp.getTime() + (this.config.retentionHours * 60 * 60 * 1000));
    return now > expirationTime;
  }

  /**
   * Calculate timespan between two dates
   */
  private calculateTimespan(start: Date, end: Date): string {
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  }

  /**
   * Extract key topics from messages
   */
  private extractKeyTopics(messages: Message[]): string[] {
    const topics = new Set<string>();
    
    for (const message of messages) {
      if (message.metadata?.intent) {
        topics.add(message.metadata.intent);
      }
    }

    // Add some basic keyword extraction
    const allText = messages
      .filter(m => m.type === 'user')
      .map(m => m.content.toLowerCase())
      .join(' ');

    const keywords = ['setup', 'error', 'help', 'problem', 'configure', 'install', 'troubleshoot'];
    for (const keyword of keywords) {
      if (allText.includes(keyword)) {
        topics.add(keyword);
      }
    }

    return Array.from(topics).slice(0, 5); // Limit to 5 topics
  }

  /**
   * Generate a summary of messages
   */
  private generateSummary(messages: Message[]): string {
    if (messages.length === 0) {
      return 'No previous conversation';
    }

    const userMessages = messages.filter(m => m.type === 'user');
    const assistantMessages = messages.filter(m => m.type === 'assistant');
    
    const topics = this.extractKeyTopics(messages);
    const topicsText = topics.length > 0 ? ` Topics discussed: ${topics.join(', ')}.` : '';
    
    return `User asked ${userMessages.length} question${userMessages.length !== 1 ? 's' : ''} ` +
           `and received ${assistantMessages.length} response${assistantMessages.length !== 1 ? 's' : ''}.${topicsText}`;
  }
}
