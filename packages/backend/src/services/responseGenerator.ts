import { Message, ConversationContext, ResponseMetadata, KnowledgeEntry } from '@intelligenai/shared';
import { QueryAnalysisResult, IntentClassificationResult } from './queryProcessor';
import { SearchResult } from './knowledgeBaseService';
import { logger } from '../utils/logger';

export interface ResponseGenerationOptions {
  includeMetadata: boolean;
  includeSuggestions: boolean;
  maxResponseLength: number;
  personalizeResponse: boolean;
}

export interface GeneratedResponse {
  content: string;
  metadata: ResponseMetadata;
  suggestions: string[];
  nextSteps?: string[];
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
  progressIndicators?: {
    currentStep?: number;
    totalSteps?: number;
    completionPercentage?: number;
  };
}

export class ResponseGenerator {
  private defaultOptions: ResponseGenerationOptions;

  constructor() {
    this.defaultOptions = {
      includeMetadata: true,
      includeSuggestions: true,
      maxResponseLength: 1000,
      personalizeResponse: true
    };
  }

  /**
   * Generate a response based on query analysis and LLM output
   */
  generateResponse(
    llmResponse: string,
    queryAnalysis: QueryAnalysisResult,
    context: ConversationContext,
    options: Partial<ResponseGenerationOptions> = {}
  ): GeneratedResponse {
    const config = { ...this.defaultOptions, ...options };
    const startTime = Date.now();

    try {
      // Format the base response
      let formattedContent = this.formatBaseResponse(
        llmResponse,
        queryAnalysis,
        context,
        config
      );

      // Add contextual information based on intent
      formattedContent = this.addContextualInformation(
        formattedContent,
        queryAnalysis,
        context
      );

      // Add metadata from knowledge base if relevant
      const enhancedContent = this.enhanceWithKnowledgeBase(
        formattedContent,
        queryAnalysis.suggestedKnowledgeEntries
      );

      // Generate suggestions
      const suggestions = config.includeSuggestions 
        ? this.generateSuggestions(queryAnalysis, context)
        : [];

      // Generate next steps
      const nextSteps = this.generateNextSteps(queryAnalysis, context);

      // Generate related links
      const relatedLinks = this.generateRelatedLinks(queryAnalysis);

      // Create metadata
      const metadata: ResponseMetadata = {
        processingTime: Date.now() - startTime,
        modelUsed: 'llm-engine',
        confidence: queryAnalysis.classification.confidence,
        intent: queryAnalysis.classification.intent,
        nextSteps,
        relatedLinks
      };

      logger.info('Response generated successfully', {
        intent: queryAnalysis.classification.intent,
        confidence: queryAnalysis.classification.confidence,
        responseLength: enhancedContent.length,
        processingTime: metadata.processingTime
      });

      return {
        content: enhancedContent,
        metadata,
        suggestions,
        nextSteps,
        relatedLinks
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Response generation failed', { error: errorMessage });

      // Return fallback response
      return this.generateFallbackResponse(llmResponse, Date.now() - startTime);
    }
  }

  /**
   * Generate response specifically for FAQ queries
   * Requirement 3.5: Include relevant links or next steps where applicable
   */
  generateFAQResponse(
    knowledgeEntries: KnowledgeEntry[],
    userQuery: string,
    context: ConversationContext
  ): GeneratedResponse {
    if (knowledgeEntries.length === 0) {
      return this.generateNoKnowledgeResponse(userQuery);
    }

    const bestMatch = knowledgeEntries[0];
    let content = bestMatch.answer;

    // Add additional context if multiple relevant entries exist
    if (knowledgeEntries.length > 1) {
      content += '\n\n**Related Information:**\n';
      knowledgeEntries.slice(1, 3).forEach((entry, index) => {
        content += `${index + 1}. ${entry.question}\n`;
      });
    }

    // Generate relevant links and next steps based on FAQ category
    const relatedLinks = this.generateFAQLinks(bestMatch);
    const nextSteps = this.generateFAQNextSteps(bestMatch, userQuery);

    // Add next steps to content if available
    if (nextSteps.length > 0) {
      content += '\n\n**Next Steps:**\n';
      nextSteps.forEach((step, index) => {
        content += `${index + 1}. ${step}\n`;
      });
    }

    // Add related links to content if available
    if (relatedLinks.length > 0) {
      content += '\n\n**Helpful Resources:**\n';
      relatedLinks.forEach((link, index) => {
        content += `${index + 1}. [${link.title}](${link.url})\n`;
      });
    }

    const suggestions = [
      'Can you explain that differently?',
      'What else can you help me with?',
      'Do you have more information about this topic?'
    ];

    const metadata: ResponseMetadata = {
      processingTime: 50, // FAQ responses are fast
      modelUsed: 'knowledge-base',
      confidence: 0.9,
      intent: 'faq',
      nextSteps,
      relatedLinks
    };

    return {
      content,
      metadata,
      suggestions,
      nextSteps,
      relatedLinks
    };
  }

  /**
   * Generate response for troubleshooting queries
   * Requirement 5.2: Present solutions in order of likelihood and simplicity
   */
  generateTroubleshootingResponse(
    solutions: string[],
    problemDescription: string,
    context: ConversationContext
  ): GeneratedResponse {
    let content = `🔧 **Troubleshooting: ${problemDescription}**\n\n`;
    
    // Sort solutions by likelihood and simplicity (already expected to be sorted)
    const sortedSolutions = this.sortSolutionsByLikelihoodAndSimplicity(solutions);
    
    content += '**Solutions to try (ordered by likelihood of success):**\n\n';

    sortedSolutions.forEach((solution, index) => {
      const priority = index === 0 ? '🟢 **Most Likely**' : 
                      index === 1 ? '🟡 **Alternative**' : 
                      '🔵 **Additional Option**';
      
      content += `**${index + 1}.** ${priority}\n`;
      content += `   ${solution}\n\n`;
    });

    // Add escalation information if multiple attempts
    const escalationLevel = context.troubleshootingState?.escalationLevel || 0;
    if (escalationLevel > 1) {
      content += '⚠️ **Need More Help?**\n';
      content += 'Since you\'ve tried multiple solutions, I can connect you with human support for personalized assistance.\n\n';
    }

    content += '📝 **Instructions:**\n';
    content += '• Try solutions in the order listed above\n';
    content += '• Test each solution completely before moving to the next\n';
    content += '• Let me know which solution works or if you need more help\n';

    const suggestions = [
      'That worked, thank you!',
      'I tried that but it didn\'t work',
      'Can you provide more detailed steps?',
      'I need to speak with a human'
    ];

    const nextSteps = [
      'Try the suggested solutions in order',
      'Report back on which solutions you\'ve attempted',
      'Request escalation if none of the solutions work'
    ];

    const relatedLinks = this.generateTroubleshootingLinks(problemDescription);

    const metadata: ResponseMetadata = {
      processingTime: 75,
      modelUsed: 'troubleshooting-engine',
      confidence: 0.8,
      intent: 'troubleshooting',
      nextSteps,
      relatedLinks
    };

    return {
      content,
      metadata,
      suggestions,
      nextSteps,
      relatedLinks
    };
  }

  /**
   * Generate response for onboarding queries
   * Requirement 4.2: Present information in clear, sequential format with progress indicators
   */
  generateOnboardingResponse(
    currentStep: number,
    totalSteps: number,
    stepContent: string,
    context: ConversationContext
  ): GeneratedResponse {
    // Create progress indicator bar
    const completionPercentage = Math.round((currentStep / totalSteps) * 100);
    const progressBar = this.createProgressBar(currentStep, totalSteps);
    
    let content = `**Step ${currentStep} of ${totalSteps}** ${progressBar}\n`;
    content += `*Progress: ${completionPercentage}% complete*\n\n`;
    content += stepContent;

    if (currentStep < totalSteps) {
      content += '\n\n📋 **Next Steps:**';
      content += `\n• Complete the current step`;
      content += `\n• Verify everything is working correctly`;
      content += `\n• Let me know when you\'re ready to continue`;
      content += '\n\nWhen you\'re ready, I can guide you through the next step.';
    } else {
      content += '\n\n🎉 **Congratulations!** You\'ve completed the onboarding process.';
      content += '\n\n✅ **What you\'ve accomplished:**';
      content += `\n• Completed all ${totalSteps} onboarding steps`;
      content += '\n• Set up your system successfully';
      content += '\n• Ready to start using the full features';
    }

    const suggestions = currentStep < totalSteps 
      ? ['I\'m ready for the next step', 'Can you repeat this step?', 'I need help with this step']
      : ['What can I do now?', 'How do I get more help?', 'Thank you!'];

    const nextSteps = currentStep < totalSteps
      ? [`Complete step ${currentStep}`, `Proceed to step ${currentStep + 1}`]
      : ['Explore the main features', 'Ask questions as needed'];

    const relatedLinks = this.generateOnboardingLinks(currentStep, totalSteps);

    const metadata: ResponseMetadata = {
      processingTime: 60,
      modelUsed: 'onboarding-engine',
      confidence: 0.85,
      intent: 'onboarding',
      nextSteps,
      relatedLinks
    };

    return {
      content,
      metadata,
      suggestions,
      nextSteps,
      relatedLinks,
      progressIndicators: {
        currentStep,
        totalSteps,
        completionPercentage
      }
    };
  }

  /**
   * Format the base response from LLM
   */
  private formatBaseResponse(
    llmResponse: string,
    queryAnalysis: QueryAnalysisResult,
    context: ConversationContext,
    config: ResponseGenerationOptions
  ): string {
    let formatted = llmResponse.trim();

    // Truncate if too long
    if (formatted.length > config.maxResponseLength) {
      formatted = formatted.substring(0, config.maxResponseLength - 3) + '...';
    }

    // Personalize based on context
    if (config.personalizeResponse && context.userPreferences) {
      formatted = this.personalizeResponse(formatted, context);
    }

    return formatted;
  }

  /**
   * Add contextual information based on intent
   */
  private addContextualInformation(
    content: string,
    queryAnalysis: QueryAnalysisResult,
    context: ConversationContext
  ): string {
    const { classification, contextualInfo } = queryAnalysis;

    // Add follow-up context
    if (contextualInfo.isFollowUp && contextualInfo.previousIntent) {
      const followUpPrefix = this.getFollowUpPrefix(contextualInfo.previousIntent);
      if (followUpPrefix) {
        content = followUpPrefix + '\n\n' + content;
      }
    }

    // Add intent-specific context
    switch (classification.intent) {
      case 'troubleshooting':
        if (context.troubleshootingState?.escalationLevel && context.troubleshootingState.escalationLevel > 1) {
          content += '\n\n💡 If these suggestions don\'t help, I can connect you with human support.';
        }
        break;

      case 'onboarding':
        if (context.onboardingStep !== undefined) {
          content += `\n\n📍 You're currently on step ${context.onboardingStep} of the onboarding process.`;
        }
        break;

      case 'product':
        content += '\n\n📚 For more detailed information, you can also check our documentation.';
        break;
    }

    return content;
  }

  /**
   * Enhance response with knowledge base information
   */
  private enhanceWithKnowledgeBase(
    content: string,
    knowledgeEntries: KnowledgeEntry[]
  ): string {
    if (knowledgeEntries.length === 0) {
      return content;
    }

    // Add relevant knowledge base information
    const relevantEntry = knowledgeEntries[0];
    
    // Only add if it provides additional value
    if (!content.toLowerCase().includes(relevantEntry.answer.toLowerCase().substring(0, 50))) {
      content += `\n\n**Additional Information:**\n${relevantEntry.answer}`;
    }

    return content;
  }

  /**
   * Generate contextual suggestions
   */
  private generateSuggestions(
    queryAnalysis: QueryAnalysisResult,
    context: ConversationContext
  ): string[] {
    const { classification } = queryAnalysis;
    const suggestions: string[] = [];

    switch (classification.intent) {
      case 'faq':
        suggestions.push(
          'Can you explain that differently?',
          'Do you have more information about this?',
          'What else can you help me with?'
        );
        break;

      case 'troubleshooting':
        suggestions.push(
          'That worked, thank you!',
          'I need more detailed steps',
          'Can I speak to a human?'
        );
        break;

      case 'onboarding':
        if (context.onboardingStep !== undefined) {
          suggestions.push(
            'I\'m ready for the next step',
            'Can you repeat this step?',
            'I need help with this step'
          );
        } else {
          suggestions.push(
            'How do I get started?',
            'What do I need to do first?',
            'Can you guide me through setup?'
          );
        }
        break;

      case 'product':
        suggestions.push(
          'How much does this cost?',
          'What are the system requirements?',
          'How do I integrate this?'
        );
        break;

      default:
        suggestions.push(
          'Can you help me with something else?',
          'What can you do?',
          'I have another question'
        );
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  /**
   * Generate next steps based on intent and context
   */
  private generateNextSteps(
    queryAnalysis: QueryAnalysisResult,
    context: ConversationContext
  ): string[] {
    const { classification } = queryAnalysis;
    const nextSteps: string[] = [];

    switch (classification.intent) {
      case 'troubleshooting':
        nextSteps.push(
          'Try the suggested solutions',
          'Report back on results',
          'Request escalation if needed'
        );
        break;

      case 'onboarding':
        if (context.onboardingStep !== undefined) {
          nextSteps.push(
            `Complete current step ${context.onboardingStep}`,
            'Ask for clarification if needed',
            'Proceed to next step when ready'
          );
        }
        break;

      case 'product':
        nextSteps.push(
          'Review the information provided',
          'Ask follow-up questions',
          'Check documentation for details'
        );
        break;
    }

    return nextSteps;
  }

  /**
   * Generate related links based on intent
   */
  private generateRelatedLinks(queryAnalysis: QueryAnalysisResult): Array<{ title: string; url: string }> {
    const { classification } = queryAnalysis;
    const links: Array<{ title: string; url: string }> = [];

    // Always include Ahmad Ziyad's core profile links
    links.push(
      { title: 'LinkedIn Profile', url: 'https://www.linkedin.com/in/ahmadziyad' },
      { title: 'GitHub Portfolio', url: 'https://github.com/ahmadziyad' }
    );

    // Add intent-specific profile links
    switch (classification.intent) {
      case 'faq':
        // Add project demos if relevant
        links.push({ title: 'HealthcareTrial Demo', url: 'https://healthcare-trial.vercel.app/' });
        break;

      case 'product':
        // Add specific project links
        links.push(
          { title: 'HealthcareTrial Project', url: 'https://github.com/ahmadziyad/HealthcareTrial' },
          { title: 'Pet Adoptions Project', url: 'https://github.com/ahmadziyad/PetAdoptions' },
          { title: 'NASA MCP Server', url: 'https://github.com/ahmadziyad/NASA-MCP-Demo' }
        );
        break;

      default:
        // Add general contact information
        links.push({ title: 'Contact Ahmad', url: 'mailto:ah.ziyad@gmail.com' });
        break;
    }

    return links.slice(0, 4); // Limit to 4 links
  }

  /**
   * Get follow-up prefix based on previous intent
   */
  private getFollowUpPrefix(previousIntent: string): string | null {
    switch (previousIntent) {
      case 'troubleshooting':
        return 'Continuing with your troubleshooting issue:';
      case 'onboarding':
        return 'Continuing with your onboarding:';
      case 'product':
        return 'More information about the product:';
      default:
        return null;
    }
  }

  /**
   * Personalize response based on user preferences and context
   */
  private personalizeResponse(
    content: string,
    context: ConversationContext
  ): string {
    const preferences = context.userPreferences;
    if (!preferences) return content;

    let personalizedContent = content;

    // Adjust response length based on preference
    switch (preferences.preferredResponseLength) {
      case 'short':
        // Keep only the first paragraph or sentence
        const sentences = content.split(/[.!?]+/);
        personalizedContent = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
        break;
      
      case 'detailed':
        // Add more context and explanations
        personalizedContent = this.addDetailedContext(content, context);
        break;
      
      default: // medium
        // Content is already at medium level
        break;
    }

    // Add personalized greeting for returning users
    if (context.messages && context.messages.length > 5) {
      const greeting = this.getPersonalizedGreeting(context);
      if (greeting) {
        personalizedContent = greeting + '\n\n' + personalizedContent;
      }
    }

    return personalizedContent;
  }

  /**
   * Add detailed context for users who prefer comprehensive responses
   */
  private addDetailedContext(content: string, context: ConversationContext): string {
    let detailedContent = content;

    // Add background information
    if (context.currentIntent) {
      const backgroundInfo = this.getBackgroundInfo(context.currentIntent);
      if (backgroundInfo) {
        detailedContent += '\n\n**Background Information:**\n' + backgroundInfo;
      }
    }

    // Add related concepts
    const relatedConcepts = this.getRelatedConcepts(content);
    if (relatedConcepts.length > 0) {
      detailedContent += '\n\n**Related Concepts:**\n';
      relatedConcepts.forEach((concept, index) => {
        detailedContent += `${index + 1}. ${concept}\n`;
      });
    }

    return detailedContent;
  }

  /**
   * Get personalized greeting for returning users
   */
  private getPersonalizedGreeting(context: ConversationContext): string | null {
    const messageCount = context.messages?.length || 0;
    
    if (messageCount > 10) {
      return "Welcome back! I see we've been having quite a conversation.";
    } else if (messageCount > 5) {
      return "Good to see you again!";
    }
    
    return null;
  }

  /**
   * Get background information for an intent
   */
  private getBackgroundInfo(intent: string): string | null {
    switch (intent) {
      case 'troubleshooting':
        return 'Troubleshooting involves systematically identifying and resolving issues. The most effective approach is to start with the most common causes and work toward more complex solutions.';
      case 'onboarding':
        return 'Onboarding is designed to help you get up and running quickly while ensuring you understand the key concepts and best practices.';
      case 'product':
        return 'Our product information is regularly updated to reflect the latest features, pricing, and availability. All details provided are current as of the last update.';
      default:
        return null;
    }
  }

  /**
   * Extract related concepts from content
   */
  private getRelatedConcepts(content: string): string[] {
    const concepts: string[] = [];
    const lowerContent = content.toLowerCase();

    // Simple keyword-based concept extraction
    if (lowerContent.includes('api')) {
      concepts.push('API integration and authentication');
    }
    if (lowerContent.includes('config') || lowerContent.includes('setting')) {
      concepts.push('Configuration management and best practices');
    }
    if (lowerContent.includes('install') || lowerContent.includes('setup')) {
      concepts.push('Installation requirements and environment setup');
    }
    if (lowerContent.includes('performance')) {
      concepts.push('Performance optimization and monitoring');
    }
    if (lowerContent.includes('security')) {
      concepts.push('Security considerations and compliance');
    }

    return concepts.slice(0, 3); // Limit to 3 concepts
  }

  /**
   * Generate fallback response when processing fails
   */
  private generateFallbackResponse(
    originalResponse: string,
    processingTime: number
  ): GeneratedResponse {
    let content: string;
    
    if (originalResponse && originalResponse.trim().length > 0) {
      // If we have some response, use it but add error context
      content = originalResponse + '\n\n⚠️ *Note: This response may be incomplete due to a processing issue. Please let me know if you need clarification.*';
    } else {
      // Complete fallback message
      content = '🤖 I apologize, but I encountered an issue processing your request.\n\n';
      content += '**What you can try:**\n';
      content += '• Rephrase your question in different words\n';
      content += '• Break complex questions into smaller parts\n';
      content += '• Ask about a specific topic or feature\n';
      content += '• Contact our support team for personalized help\n\n';
      content += 'I\'m here to help, so please don\'t hesitate to try again!';
    }

    const metadata: ResponseMetadata = {
      processingTime,
      modelUsed: 'fallback',
      confidence: 0.1,
      intent: 'general'
    };

    const suggestions = [
      'Try rephrasing your question',
      'Ask about a specific feature',
      'Contact support',
      'What can you help me with?'
    ];

    const nextSteps = [
      'Rephrase your question',
      'Try asking about something specific',
      'Contact support if the issue persists'
    ];

    const relatedLinks = [
      { title: 'Help Center', url: '/help' },
      { title: 'Contact Support', url: '/support' },
      { title: 'FAQ', url: '/faq' }
    ];

    return {
      content,
      metadata,
      suggestions,
      nextSteps,
      relatedLinks
    };
  }

  /**
   * Generate error response for specific error types
   */
  generateErrorResponse(
    errorType: 'timeout' | 'service_unavailable' | 'rate_limit' | 'invalid_input' | 'unknown',
    errorMessage?: string,
    context?: ConversationContext
  ): GeneratedResponse {
    let content: string;
    let suggestions: string[];
    let nextSteps: string[];

    switch (errorType) {
      case 'timeout':
        content = '⏱️ **Request Timeout**\n\n';
        content += 'Your request took longer than expected to process. This might be due to high server load or a complex query.\n\n';
        content += '**What to try:**\n';
        content += '• Wait a moment and try again\n';
        content += '• Simplify your question\n';
        content += '• Break complex requests into smaller parts';
        
        suggestions = ['Try again', 'Simplify my question', 'Ask something else'];
        nextSteps = ['Wait a moment', 'Retry your request', 'Simplify if needed'];
        break;

      case 'service_unavailable':
        content = '🔧 **Service Temporarily Unavailable**\n\n';
        content += 'I\'m experiencing technical difficulties right now. Our team is working to resolve this quickly.\n\n';
        content += '**What you can do:**\n';
        content += '• Try again in a few minutes\n';
        content += '• Check our status page for updates\n';
        content += '• Contact support for urgent matters';
        
        suggestions = ['Try again later', 'Check status page', 'Contact support'];
        nextSteps = ['Wait a few minutes', 'Check service status', 'Contact support if urgent'];
        break;

      case 'rate_limit':
        content = '🚦 **Rate Limit Reached**\n\n';
        content += 'You\'ve sent quite a few messages recently! Please wait a moment before sending another message.\n\n';
        content += 'This helps ensure good performance for everyone using the service.';
        
        suggestions = ['Wait and try again', 'What are the limits?', 'Contact support'];
        nextSteps = ['Wait before sending another message', 'Review rate limits', 'Contact support if needed'];
        break;

      case 'invalid_input':
        content = '❌ **Invalid Input**\n\n';
        content += 'There was an issue with your request format. Please check your input and try again.\n\n';
        if (errorMessage) {
          content += `**Details:** ${errorMessage}\n\n`;
        }
        content += '**Tips:**\n';
        content += '• Use clear, complete sentences\n';
        content += '• Avoid special characters or formatting\n';
        content += '• Ask one question at a time';
        
        suggestions = ['Rephrase my question', 'What format should I use?', 'Ask something else'];
        nextSteps = ['Rephrase your question', 'Use simpler language', 'Try a different approach'];
        break;

      default: // unknown
        content = '⚠️ **Unexpected Error**\n\n';
        content += 'Something unexpected happened while processing your request. ';
        if (errorMessage) {
          content += `\n\n**Error details:** ${errorMessage}\n\n`;
        }
        content += 'Please try again, and if the problem persists, contact our support team.';
        
        suggestions = ['Try again', 'Contact support', 'Ask something else'];
        nextSteps = ['Retry your request', 'Contact support if it persists', 'Try a different question'];
        break;
    }

    const metadata: ResponseMetadata = {
      processingTime: 25,
      modelUsed: 'error-handler',
      confidence: 0.2,
      intent: 'error',
      nextSteps
    };

    const relatedLinks = [
      { title: 'Help Center', url: '/help' },
      { title: 'Contact Support', url: '/support' },
      { title: 'Service Status', url: '/status' }
    ];

    return {
      content,
      metadata,
      suggestions,
      nextSteps,
      relatedLinks
    };
  }

  /**
   * Generate response when no knowledge base entries are found
   */
  private generateNoKnowledgeResponse(userQuery: string): GeneratedResponse {
    // Check if the query is related to Ahmad Ziyad's profile
    const lowerQuery = userQuery.toLowerCase();
    const profileKeywords = ['ahmad', 'ziyad', 'profile', 'experience', 'skills', 'projects', 'work', 'career', 'background'];
    const isProfileRelated = profileKeywords.some(keyword => lowerQuery.includes(keyword));
    
    let content: string;
    
    if (isProfileRelated) {
      content = `I don't have specific information about "${userQuery}" in my knowledge base, but I'd be happy to help you learn more about Ahmad Ziyad's professional background.\n\n`;
      content += '**What I can tell you about:**\n';
      content += '• Technical skills and expertise (AI/ML, AWS, Python, React)\n';
      content += '• Professional experience and career progression\n';
      content += '• Current projects and achievements\n';
      content += '• Certifications and education\n';
      content += '• Contact information for direct discussions\n\n';
      content += '💡 Feel free to contact Ahmad directly at ah.ziyad@gmail.com for detailed discussions.';
    } else {
      content = `I'm Ahmad Ziyad's AI Assistant, and I'm here specifically to help with questions about his professional profile, skills, experience, and projects.\n\n`;
      content += `I can't help with "${userQuery}" as it's outside my scope, but I'd be happy to answer questions about:\n\n`;
      content += '🔹 **Technical Expertise:** AI/ML, AWS Cloud, Python, React, Microservices\n';
      content += '🔹 **Professional Experience:** 13+ years in enterprise software development\n';
      content += '🔹 **Current Projects:** HealthcareTrial, Pet Adoptions, NASA MCP Server\n';
      content += '🔹 **Certifications:** AWS, Oracle Cloud, PMP, PMI-ACP\n';
      content += '🔹 **Contact Information:** How to reach Ahmad for opportunities\n\n';
      content += 'How can I assist you with information about Ahmad Ziyad\'s professional profile?';
    }

    const metadata: ResponseMetadata = {
      processingTime: 25,
      modelUsed: 'profile-assistant',
      confidence: 0.8,
      intent: 'redirect'
    };

    const suggestions = [
      'Tell me about Ahmad\'s technical skills',
      'What projects has Ahmad worked on?',
      'How can I contact Ahmad?',
      'What is Ahmad\'s current role?'
    ];

    const nextSteps = [
      'Ask about Ahmad\'s professional background',
      'Inquire about specific technical expertise',
      'Request contact information for direct communication'
    ];

    const relatedLinks = [
      { title: 'LinkedIn Profile', url: 'https://www.linkedin.com/in/ahmadziyad' },
      { title: 'GitHub Portfolio', url: 'https://github.com/ahmadziyad' },
      { title: 'HealthcareTrial Demo', url: 'https://healthcare-trial.vercel.app/' },
      { title: 'Contact Ahmad', url: 'mailto:ah.ziyad@gmail.com' }
    ];

    return {
      content,
      metadata,
      suggestions,
      nextSteps,
      relatedLinks
    };
  }

  /**
   * Create a visual progress bar for onboarding steps
   */
  private createProgressBar(currentStep: number, totalSteps: number): string {
    const filled = '●';
    const empty = '○';
    const progress = Math.min(currentStep, totalSteps);
    
    let bar = '';
    for (let i = 1; i <= totalSteps; i++) {
      bar += i <= progress ? filled : empty;
      if (i < totalSteps) bar += ' ';
    }
    
    return `[${bar}]`;
  }

  /**
   * Sort troubleshooting solutions by likelihood and simplicity
   * Requirement 5.2: Present solutions in order of likelihood and simplicity
   */
  private sortSolutionsByLikelihoodAndSimplicity(solutions: string[]): string[] {
    // For now, assume solutions are already sorted by the caller
    // In a real implementation, this would use ML models or heuristics
    // to score solutions based on:
    // - Historical success rate
    // - Complexity (number of steps)
    // - User skill level
    // - Problem type
    return [...solutions];
  }

  /**
   * Generate FAQ-specific links
   * Requirement 3.5: Include relevant links or next steps where applicable
   */
  private generateFAQLinks(knowledgeEntry: KnowledgeEntry): Array<{ title: string; url: string }> {
    const links: Array<{ title: string; url: string }> = [];
    
    // Always include Ahmad Ziyad's profile links
    links.push(
      { title: 'LinkedIn Profile', url: 'https://www.linkedin.com/in/ahmadziyad' },
      { title: 'GitHub Portfolio', url: 'https://github.com/ahmadziyad' }
    );
    
    // Add specific project links based on content
    const lowerAnswer = knowledgeEntry.answer.toLowerCase();
    
    if (lowerAnswer.includes('healthcare')) {
      links.push({ title: 'HealthcareTrial Demo', url: 'https://healthcare-trial.vercel.app/' });
      links.push({ title: 'HealthcareTrial Code', url: 'https://github.com/ahmadziyad/HealthcareTrial' });
    }
    
    if (lowerAnswer.includes('pet') || lowerAnswer.includes('adoption')) {
      links.push({ title: 'Pet Adoptions Project', url: 'https://github.com/ahmadziyad/PetAdoptions' });
    }
    
    if (lowerAnswer.includes('nasa') || lowerAnswer.includes('mcp')) {
      links.push({ title: 'NASA MCP Server', url: 'https://github.com/ahmadziyad/NASA-MCP-Demo' });
    }
    
    if (lowerAnswer.includes('property') || lowerAnswer.includes('risk')) {
      links.push({ title: 'Property Risk Insight', url: 'https://github.com/ahmadziyad/PropertyRiskInsight' });
    }
    
    if (lowerAnswer.includes('title') || lowerAnswer.includes('chain')) {
      links.push({ title: 'Property Title Chain', url: 'https://github.com/ahmadziyad/TitleChain' });
    }
    
    return links;
  }

  /**
   * Generate FAQ-specific next steps
   * Requirement 3.5: Include relevant links or next steps where applicable
   */
  private generateFAQNextSteps(knowledgeEntry: KnowledgeEntry, userQuery: string): string[] {
    const nextSteps: string[] = [];
    
    // Always include contact option
    nextSteps.push('Contact Ahmad directly at ah.ziyad@gmail.com for detailed discussions');
    
    const lowerAnswer = knowledgeEntry.answer.toLowerCase();
    const lowerQuery = userQuery.toLowerCase();
    
    if (lowerAnswer.includes('project') || lowerQuery.includes('project')) {
      nextSteps.push('Explore the GitHub repositories for technical details');
      nextSteps.push('Request a live demo of specific projects');
    } else if (lowerAnswer.includes('skill') || lowerQuery.includes('skill')) {
      nextSteps.push('Review the LinkedIn profile for detailed experience');
      nextSteps.push('Ask about specific technical implementations');
    } else if (lowerAnswer.includes('experience') || lowerQuery.includes('experience')) {
      nextSteps.push('Check the LinkedIn profile for complete work history');
      nextSteps.push('Inquire about specific industry experience');
    } else {
      nextSteps.push('Ask follow-up questions about Ahmad\'s expertise');
      nextSteps.push('Request more information about specific areas of interest');
    }
    
    return nextSteps.slice(0, 3); // Limit to 3 steps
  }

  /**
   * Generate troubleshooting-specific links
   */
  private generateTroubleshootingLinks(problemDescription: string): Array<{ title: string; url: string }> {
    const links: Array<{ title: string; url: string }> = [];
    
    // Add generic troubleshooting links
    links.push(
      { title: 'Troubleshooting Guide', url: '/docs/troubleshooting' },
      { title: 'Common Issues & Solutions', url: '/docs/common-issues' }
    );
    
    // Add specific links based on problem type
    const lowerProblem = problemDescription.toLowerCase();
    
    if (lowerProblem.includes('install') || lowerProblem.includes('setup')) {
      links.push({ title: 'Installation Guide', url: '/docs/installation' });
    }
    
    if (lowerProblem.includes('config') || lowerProblem.includes('setting')) {
      links.push({ title: 'Configuration Reference', url: '/docs/configuration' });
    }
    
    if (lowerProblem.includes('api') || lowerProblem.includes('integration')) {
      links.push({ title: 'API Documentation', url: '/docs/api' });
    }
    
    if (lowerProblem.includes('performance') || lowerProblem.includes('slow')) {
      links.push({ title: 'Performance Optimization', url: '/docs/performance' });
    }
    
    return links;
  }

  /**
   * Generate onboarding-specific links
   */
  private generateOnboardingLinks(currentStep: number, totalSteps: number): Array<{ title: string; url: string }> {
    const links: Array<{ title: string; url: string }> = [];
    
    // Always include basic onboarding links
    links.push(
      { title: 'Complete Onboarding Guide', url: '/docs/onboarding' },
      { title: 'Quick Start Checklist', url: '/docs/quick-start' }
    );
    
    // Add step-specific links
    if (currentStep <= 2) {
      links.push({ title: 'Installation Requirements', url: '/docs/requirements' });
    }
    
    if (currentStep >= 2 && currentStep <= 4) {
      links.push({ title: 'Configuration Examples', url: '/docs/config-examples' });
    }
    
    if (currentStep >= totalSteps - 1) {
      links.push(
        { title: 'Advanced Features', url: '/docs/advanced' },
        { title: 'Best Practices', url: '/docs/best-practices' }
      );
    }
    
    return links;
  }

  /**
   * Generate product information response with complete details
   * Requirement 6.2: Include relevant details such as pricing, availability, and specifications
   */
  generateProductInfoResponse(
    productInfo: {
      name: string;
      description: string;
      pricing?: {
        plans: Array<{
          name: string;
          price: string;
          features: string[];
        }>;
      };
      availability?: {
        status: 'available' | 'coming_soon' | 'beta' | 'deprecated';
        releaseDate?: string;
        regions?: string[];
      };
      specifications?: {
        requirements: string[];
        compatibility: string[];
        performance: string[];
      };
    },
    context: ConversationContext
  ): GeneratedResponse {
    let content = `# ${productInfo.name}\n\n`;
    content += `${productInfo.description}\n\n`;

    // Add pricing information if available
    if (productInfo.pricing?.plans) {
      content += '## 💰 Pricing\n\n';
      productInfo.pricing.plans.forEach(plan => {
        content += `**${plan.name}** - ${plan.price}\n`;
        plan.features.forEach(feature => {
          content += `• ${feature}\n`;
        });
        content += '\n';
      });
    }

    // Add availability information if available
    if (productInfo.availability) {
      content += '## 📅 Availability\n\n';
      content += `**Status:** ${this.formatAvailabilityStatus(productInfo.availability.status)}\n`;
      
      if (productInfo.availability.releaseDate) {
        content += `**Release Date:** ${productInfo.availability.releaseDate}\n`;
      }
      
      if (productInfo.availability.regions) {
        content += `**Available Regions:** ${productInfo.availability.regions.join(', ')}\n`;
      }
      content += '\n';
    }

    // Add specifications if available
    if (productInfo.specifications) {
      content += '## 🔧 Specifications\n\n';
      
      if (productInfo.specifications.requirements.length > 0) {
        content += '**System Requirements:**\n';
        productInfo.specifications.requirements.forEach(req => {
          content += `• ${req}\n`;
        });
        content += '\n';
      }
      
      if (productInfo.specifications.compatibility.length > 0) {
        content += '**Compatibility:**\n';
        productInfo.specifications.compatibility.forEach(comp => {
          content += `• ${comp}\n`;
        });
        content += '\n';
      }
      
      if (productInfo.specifications.performance.length > 0) {
        content += '**Performance:**\n';
        productInfo.specifications.performance.forEach(perf => {
          content += `• ${perf}\n`;
        });
        content += '\n';
      }
    }

    const suggestions = [
      'How do I get started?',
      'What are the system requirements?',
      'Can I try this for free?',
      'How does this compare to alternatives?'
    ];

    const nextSteps = [
      'Review the pricing options',
      'Check system requirements',
      'Consider starting with a trial',
      'Contact sales for enterprise options'
    ];

    const relatedLinks = [
      { title: 'Product Documentation', url: '/docs/product' },
      { title: 'Getting Started Guide', url: '/docs/getting-started' },
      { title: 'API Reference', url: '/docs/api' },
      { title: 'Support Center', url: '/support' }
    ];

    const metadata: ResponseMetadata = {
      processingTime: 80,
      modelUsed: 'product-info-engine',
      confidence: 0.95,
      intent: 'product',
      nextSteps,
      relatedLinks
    };

    return {
      content,
      metadata,
      suggestions,
      nextSteps,
      relatedLinks
    };
  }

  /**
   * Format availability status for display
   */
  private formatAvailabilityStatus(status: string): string {
    switch (status) {
      case 'available':
        return '✅ Available Now';
      case 'coming_soon':
        return '🔜 Coming Soon';
      case 'beta':
        return '🧪 Beta Version';
      case 'deprecated':
        return '⚠️ Deprecated';
      default:
        return status;
    }
  }
}

export const responseGenerator = new ResponseGenerator();
