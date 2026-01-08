import { Message, ConversationContext, TroubleshootingState } from '@intelligenai/shared';
import { conversationService } from './conversationService';
import { sessionService } from './sessionService';
import { logger } from '../utils/logger';

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  nextSteps?: string[];
  isComplete?: boolean;
}

export interface OnboardingFlow {
  currentStep: number;
  totalSteps: number;
  steps: FlowStep[];
  progress: number;
}

export interface TroubleshootingFlow {
  issue: string;
  currentSolution: number;
  solutions: TroubleshootingSolution[];
  escalationLevel: number;
  maxEscalationLevel: number;
}

export interface TroubleshootingSolution {
  id: string;
  title: string;
  description: string;
  steps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  successRate: number;
}

export class ConversationFlowManager {
  private readonly MAX_CONTEXT_MESSAGES = 20;
  private readonly MEMORY_OPTIMIZATION_THRESHOLD = 50;

  /**
   * Preserve conversation history with memory optimization
   */
  async preserveConversationHistory(sessionId: string): Promise<boolean> {
    try {
      const messages = conversationService.getConversationHistory(sessionId);
      
      if (messages.length > this.MEMORY_OPTIMIZATION_THRESHOLD) {
        // Implement intelligent memory optimization
        const optimizedMessages = this.optimizeMemoryUsage(messages);
        
        // Update session with optimized messages
        const success = sessionService.updateSessionContext(sessionId, {
          messages: optimizedMessages
        });

        if (success) {
          logger.info(`Memory optimized for session ${sessionId}: ${messages.length} -> ${optimizedMessages.length} messages`);
        }

        return success;
      }

      return true;
    } catch (error) {
      logger.error('Error preserving conversation history:', error);
      return false;
    }
  }

  /**
   * Optimize memory usage by keeping important messages and summarizing others
   */
  private optimizeMemoryUsage(messages: Message[]): Message[] {
    // Keep the most recent messages
    const recentMessages = messages.slice(-this.MAX_CONTEXT_MESSAGES);
    
    // Keep system messages and important user interactions
    const importantMessages = messages.filter(msg => 
      msg.type === 'system' || 
      (msg.metadata?.intent && ['onboarding', 'troubleshooting'].includes(msg.metadata.intent))
    );

    // Combine and deduplicate
    const preservedMessages = [...importantMessages, ...recentMessages];
    const uniqueMessages = preservedMessages.filter((msg, index, arr) => 
      arr.findIndex(m => m.id === msg.id) === index
    );

    // Sort by timestamp
    return uniqueMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Initialize onboarding flow
   */
  async initializeOnboardingFlow(sessionId: string, flowType: string = 'general'): Promise<OnboardingFlow | null> {
    try {
      const onboardingSteps = await this.getOnboardingSteps(flowType);
      
      const onboardingFlow: OnboardingFlow = {
        currentStep: 0,
        totalSteps: onboardingSteps.length,
        steps: onboardingSteps,
        progress: 0
      };

      // Update session context with onboarding state
      const success = sessionService.updateSessionContext(sessionId, {
        onboardingStep: 0,
        currentIntent: 'onboarding'
      });

      if (success) {
        // Add system message to start onboarding
        conversationService.addMessage(
          sessionId,
          `Welcome! I'll guide you through the ${flowType} onboarding process. We have ${onboardingSteps.length} steps to complete.`,
          'system',
          { intent: 'onboarding', confidence: 1.0 }
        );

        logger.info(`Onboarding flow initialized for session ${sessionId}`);
        return onboardingFlow;
      }

      return null;
    } catch (error) {
      logger.error('Error initializing onboarding flow:', error);
      return null;
    }
  }

  /**
   * Progress to next onboarding step
   */
  async progressOnboardingStep(sessionId: string): Promise<FlowStep | null> {
    try {
      const session = sessionService.getSession(sessionId);
      if (!session || session.context.currentIntent !== 'onboarding') {
        return null;
      }

      const currentStep = session.context.onboardingStep || 0;
      const onboardingSteps = await this.getOnboardingSteps('general');
      
      if (currentStep >= onboardingSteps.length - 1) {
        // Onboarding complete
        await this.completeOnboarding(sessionId);
        return null;
      }

      const nextStep = currentStep + 1;
      const nextStepData = onboardingSteps[nextStep];

      // Update session with next step
      const success = sessionService.updateSessionContext(sessionId, {
        onboardingStep: nextStep
      });

      if (success) {
        // Add system message for next step
        conversationService.addMessage(
          sessionId,
          `Great! Let's move to step ${nextStep + 1}: ${nextStepData.title}. ${nextStepData.description}`,
          'system',
          { intent: 'onboarding', confidence: 1.0 }
        );

        logger.info(`Onboarding progressed to step ${nextStep} for session ${sessionId}`);
        return nextStepData;
      }

      return null;
    } catch (error) {
      logger.error('Error progressing onboarding step:', error);
      return null;
    }
  }

  /**
   * Complete onboarding flow
   */
  private async completeOnboarding(sessionId: string): Promise<void> {
    sessionService.updateSessionContext(sessionId, {
      onboardingStep: undefined,
      currentIntent: undefined
    });

    conversationService.addMessage(
      sessionId,
      'Congratulations! You\'ve completed the onboarding process. I\'m here to help with any questions you might have.',
      'system',
      { intent: 'onboarding_complete', confidence: 1.0 }
    );

    logger.info(`Onboarding completed for session ${sessionId}`);
  }

  /**
   * Initialize troubleshooting flow
   */
  async initializeTroubleshootingFlow(sessionId: string, issue: string): Promise<TroubleshootingFlow | null> {
    try {
      // Validate issue description
      if (!issue || issue.trim().length === 0) {
        return null;
      }

      const solutions = await this.getTroubleshootingSolutions(issue);
      
      if (solutions.length === 0) {
        return null;
      }

      const troubleshootingFlow: TroubleshootingFlow = {
        issue,
        currentSolution: 0,
        solutions,
        escalationLevel: 0,
        maxEscalationLevel: 3
      };

      // Update session context with troubleshooting state
      const troubleshootingState: TroubleshootingState = {
        currentIssue: issue,
        attemptedSolutions: [],
        escalationLevel: 0
      };

      const success = sessionService.updateSessionContext(sessionId, {
        troubleshootingState,
        currentIntent: 'troubleshooting'
      });

      if (success) {
        // Add system message to start troubleshooting
        const firstSolution = solutions[0];
        conversationService.addMessage(
          sessionId,
          `I understand you're experiencing: "${issue}". Let's try to resolve this step by step. Here's the first solution I recommend: ${firstSolution.title}`,
          'system',
          { intent: 'troubleshooting', confidence: 0.8 }
        );

        logger.info(`Troubleshooting flow initialized for session ${sessionId} with issue: ${issue}`);
        return troubleshootingFlow;
      }

      return null;
    } catch (error) {
      logger.error('Error initializing troubleshooting flow:', error);
      return null;
    }
  }

  /**
   * Progress to next troubleshooting solution
   */
  async progressTroubleshootingSolution(sessionId: string, solutionWorked: boolean): Promise<TroubleshootingSolution | null> {
    try {
      const session = sessionService.getSession(sessionId);
      if (!session || !session.context.troubleshootingState) {
        return null;
      }

      const troubleshootingState = session.context.troubleshootingState;
      const solutions = await this.getTroubleshootingSolutions(troubleshootingState.currentIssue!);
      
      if (solutionWorked) {
        // Problem resolved
        await this.completeTroubleshooting(sessionId, true);
        return null;
      }

      // Add current solution to attempted solutions
      const currentSolutionIndex = troubleshootingState.attemptedSolutions.length;
      if (currentSolutionIndex < solutions.length) {
        troubleshootingState.attemptedSolutions.push(solutions[currentSolutionIndex].id);
      }

      // Check if we have more solutions
      const nextSolutionIndex = troubleshootingState.attemptedSolutions.length;
      
      if (nextSolutionIndex >= solutions.length) {
        // No more solutions, escalate
        return await this.escalateTroubleshooting(sessionId);
      }

      const nextSolution = solutions[nextSolutionIndex];

      // Update session state
      const success = sessionService.updateSessionContext(sessionId, {
        troubleshootingState
      });

      if (success) {
        // Add system message for next solution
        conversationService.addMessage(
          sessionId,
          `Let's try another approach: ${nextSolution.title}. ${nextSolution.description}`,
          'system',
          { intent: 'troubleshooting', confidence: 0.7 }
        );

        logger.info(`Troubleshooting progressed to solution ${nextSolutionIndex} for session ${sessionId}`);
        return nextSolution;
      }

      return null;
    } catch (error) {
      logger.error('Error progressing troubleshooting solution:', error);
      return null;
    }
  }

  /**
   * Escalate troubleshooting when solutions don't work
   */
  private async escalateTroubleshooting(sessionId: string): Promise<TroubleshootingSolution | null> {
    const session = sessionService.getSession(sessionId);
    if (!session || !session.context.troubleshootingState) {
      return null;
    }

    const troubleshootingState = session.context.troubleshootingState;
    troubleshootingState.escalationLevel++;

    if (troubleshootingState.escalationLevel >= 3) {
      // Maximum escalation reached, recommend human support
      await this.completeTroubleshooting(sessionId, false);
      return null;
    }

    // Update session state
    sessionService.updateSessionContext(sessionId, {
      troubleshootingState
    });

    // Provide escalation message
    conversationService.addMessage(
      sessionId,
      `I understand the previous solutions didn't work. Let me try a different approach or connect you with additional resources.`,
      'system',
      { intent: 'troubleshooting_escalation', confidence: 0.6 }
    );

    logger.info(`Troubleshooting escalated to level ${troubleshootingState.escalationLevel} for session ${sessionId}`);
    return null;
  }

  /**
   * Complete troubleshooting flow
   */
  private async completeTroubleshooting(sessionId: string, resolved: boolean): Promise<void> {
    sessionService.updateSessionContext(sessionId, {
      troubleshootingState: undefined,
      currentIntent: undefined
    });

    const message = resolved 
      ? 'Great! I\'m glad we could resolve your issue. Is there anything else I can help you with?'
      : 'I apologize that we couldn\'t resolve your issue through our troubleshooting steps. I recommend contacting our support team for personalized assistance. They\'ll have access to more advanced diagnostic tools.';

    conversationService.addMessage(
      sessionId,
      message,
      'system',
      { intent: resolved ? 'troubleshooting_resolved' : 'troubleshooting_escalated', confidence: 1.0 }
    );

    logger.info(`Troubleshooting completed for session ${sessionId}, resolved: ${resolved}`);
  }

  /**
   * Handle conversation state transitions
   */
  async handleStateTransition(sessionId: string, fromState: string, toState: string): Promise<boolean> {
    try {
      const session = sessionService.getSession(sessionId);
      if (!session) {
        return false;
      }

      // Log state transition
      logger.info(`State transition for session ${sessionId}: ${fromState} -> ${toState}`);

      // Handle specific transitions
      switch (toState) {
        case 'onboarding':
          await this.initializeOnboardingFlow(sessionId);
          break;
        case 'troubleshooting':
          // Will be initialized when specific issue is identified
          break;
        case 'idle':
          // Clear any active flows
          sessionService.updateSessionContext(sessionId, {
            currentIntent: undefined,
            onboardingStep: undefined,
            troubleshootingState: undefined
          });
          break;
      }

      return true;
    } catch (error) {
      logger.error('Error handling state transition:', error);
      return false;
    }
  }

  /**
   * Recover from conversation errors
   */
  async recoverFromError(sessionId: string, error: Error): Promise<boolean> {
    try {
      logger.error(`Conversation error for session ${sessionId}:`, error);

      // Add error recovery message
      conversationService.addMessage(
        sessionId,
        'I apologize, but I encountered an issue processing your request. Let me try to help you in a different way.',
        'system',
        { intent: 'error_recovery', confidence: 0.5 }
      );

      // Reset to safe state
      sessionService.updateSessionContext(sessionId, {
        currentIntent: undefined,
        onboardingStep: undefined,
        troubleshootingState: undefined
      });

      return true;
    } catch (recoveryError) {
      logger.error('Error during conversation recovery:', recoveryError);
      return false;
    }
  }

  /**
   * Get onboarding steps based on flow type
   */
  private async getOnboardingSteps(_flowType: string): Promise<FlowStep[]> {
    // In a real implementation, this would fetch from knowledge base
    const generalSteps: FlowStep[] = [
      {
        id: 'welcome',
        title: 'Welcome',
        description: 'Let me introduce myself and explain how I can help you.',
        nextSteps: ['account_setup']
      },
      {
        id: 'account_setup',
        title: 'Account Setup',
        description: 'Let\'s make sure your account is properly configured.',
        nextSteps: ['feature_overview']
      },
      {
        id: 'feature_overview',
        title: 'Feature Overview',
        description: 'I\'ll show you the key features available to you.',
        nextSteps: ['first_task']
      },
      {
        id: 'first_task',
        title: 'Complete Your First Task',
        description: 'Let\'s walk through completing your first task together.',
        nextSteps: ['completion']
      },
      {
        id: 'completion',
        title: 'Onboarding Complete',
        description: 'You\'re all set! I\'m here whenever you need assistance.',
        nextSteps: []
      }
    ];

    return generalSteps;
  }

  /**
   * Get troubleshooting solutions for a specific issue
   */
  private async getTroubleshootingSolutions(_issue: string): Promise<TroubleshootingSolution[]> {
    // In a real implementation, this would use the knowledge base service
    // For now, return mock solutions ordered by difficulty and success rate
    const solutions: TroubleshootingSolution[] = [
      {
        id: 'basic_restart',
        title: 'Basic Restart',
        description: 'Try restarting the application or refreshing the page.',
        steps: ['Close the application', 'Wait 10 seconds', 'Reopen the application'],
        difficulty: 'easy',
        estimatedTime: 2,
        successRate: 0.7
      },
      {
        id: 'clear_cache',
        title: 'Clear Cache and Data',
        description: 'Clear your browser cache and stored data.',
        steps: ['Open browser settings', 'Navigate to privacy/security', 'Clear browsing data', 'Restart browser'],
        difficulty: 'medium',
        estimatedTime: 5,
        successRate: 0.6
      },
      {
        id: 'check_permissions',
        title: 'Check Permissions',
        description: 'Verify that necessary permissions are granted.',
        steps: ['Check browser permissions', 'Enable required features', 'Refresh the page'],
        difficulty: 'medium',
        estimatedTime: 3,
        successRate: 0.5
      }
    ];

    // Sort by success rate (highest first) and difficulty (easiest first)
    return solutions.sort((a, b) => {
      if (a.successRate !== b.successRate) {
        return b.successRate - a.successRate;
      }
      const difficultyOrder = { 'easy': 0, 'medium': 1, 'hard': 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
  }
}

export const conversationFlowManager = new ConversationFlowManager();
