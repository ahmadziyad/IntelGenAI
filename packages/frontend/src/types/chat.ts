// Chat-related type definitions (local types to avoid shared package dependency)

export interface Message {
  id: string;
  sessionId: string;
  content: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    processingTime?: number;
  };
}

export interface ChatbotConfig {
  modelName: string;
  maxContextLength: number;
  responseTimeout: number;
  voiceEnabled: boolean;
  knowledgeBase: string[];
  styling: WidgetStyling;
}

export interface WidgetStyling {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  message: Message;
  suggestions?: string[];
  metadata?: ResponseMetadata;
}

export interface ResponseMetadata {
  processingTime: number;
  modelUsed: string;
  confidence: number;
  intent: string;
  nextSteps?: string[];
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
}