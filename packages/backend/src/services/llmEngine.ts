import axios, { AxiosInstance } from 'axios';
import { Message, ConversationContext, ResponseMetadata } from '@intelligenai/shared';
import { logger } from '../utils/logger';

export interface LLMConfig {
  baseUrl: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export interface GenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
  };
}

export interface GenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface ModelInfo {
  name: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  modified_at: string;
}

export class LLMEngine {
  private client: AxiosInstance;
  private config: LLMConfig;
  private isModelLoaded: boolean = false;
  private loadedModel: string | null = null;

  constructor(config: LLMConfig) {
    this.config = {
      maxTokens: 2048,
      temperature: 0.7,
      timeout: 30000,
      ...config
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    logger.info('LLM Engine initialized', { 
      baseUrl: this.config.baseUrl, 
      model: this.config.model 
    });
  }

  /**
   * Load and initialize the specified model
   */
  async loadModel(modelName?: string): Promise<void> {
    const model = modelName || this.config.model;
    
    try {
      logger.info('Loading model', { model });
      
      // Check if model exists by trying to generate with it
      // This will pull the model if it doesn't exist locally
      const testRequest: GenerateRequest = {
        model,
        prompt: 'Hello',
        options: {
          max_tokens: 1
        }
      };

      await this.client.post('/api/generate', testRequest);
      
      this.isModelLoaded = true;
      this.loadedModel = model;
      
      logger.info('Model loaded successfully', { model });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to load model', { model, error: errorMessage });
      throw new Error(`Failed to load model ${model}: ${errorMessage}`);
    }
  }

  /**
   * Generate a response using the loaded model
   */
  async generateResponse(
    prompt: string, 
    context?: ConversationContext
  ): Promise<{ response: string; metadata: ResponseMetadata }> {
    if (!this.isModelLoaded) {
      await this.loadModel();
    }

    const startTime = Date.now();
    
    try {
      const engineeredPrompt = this.engineerPrompt(prompt, context);
      
      const request: GenerateRequest = {
        model: this.loadedModel || this.config.model,
        prompt: engineeredPrompt,
        stream: false,
        options: {
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          top_p: 0.9
        }
      };

      logger.debug('Generating response', { 
        model: request.model, 
        promptLength: engineeredPrompt.length 
      });

      const response = await this.client.post<GenerateResponse>('/api/generate', request);
      const processingTime = Date.now() - startTime;

      const formattedResponse = this.formatResponse(response.data.response);
      
      const metadata: ResponseMetadata = {
        processingTime,
        modelUsed: response.data.model,
        confidence: this.calculateConfidence(response.data),
        intent: this.extractIntent(context),
        nextSteps: this.generateNextSteps(formattedResponse, context)
      };

      logger.info('Response generated successfully', {
        processingTime,
        model: metadata.modelUsed,
        responseLength: formattedResponse.length
      });

      return {
        response: formattedResponse,
        metadata
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to generate response', { 
        error: errorMessage, 
        processingTime 
      });
      
      throw new Error(`Failed to generate response: ${errorMessage}`);
    }
  }

  /**
   * Get list of available models
   */
  async getAvailableModels(): Promise<ModelInfo[]> {
    try {
      const response = await this.client.get('/api/tags');
      return response.data.models || [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to get available models', { error: errorMessage });
      throw new Error(`Failed to get available models: ${errorMessage}`);
    }
  }

  /**
   * Check if the LLM service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/api/tags');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn('LLM service health check failed', { error: errorMessage });
      return false;
    }
  }

  /**
   * Engineer the prompt with context and instructions
   */
  private engineerPrompt(userPrompt: string, context?: ConversationContext): string {
    let prompt = '';

    // System instructions - Profile-focused AI Assistant
    prompt += 'You are Ahmad Ziyad\'s AI Assistant for his professional portfolio website. ';
    prompt += 'You ONLY answer questions related to Ahmad Ziyad\'s profile, skills, experience, projects, and professional background. ';
    prompt += 'If asked about anything unrelated to Ahmad Ziyad\'s portfolio, politely redirect the conversation back to his professional profile. ';
    prompt += 'Always provide specific references and links when available. ';
    prompt += 'Be professional, helpful, and knowledgeable about his expertise in AI/ML, cloud architecture, and software engineering.\n\n';

    // Profile context
    prompt += 'AHMAD ZIYAD\'S PROFILE INFORMATION:\n';
    prompt += '- Name: Ahmad Ziyad\n';
    prompt += '- Title: Technical Product Manager/AI Software Engineer/Architect\n';
    prompt += '- Location: Charlotte, NC, USA\n';
    prompt += '- Email: ah.ziyad@gmail.com\n';
    prompt += '- LinkedIn: https://www.linkedin.com/in/ahmadziyad\n';
    prompt += '- GitHub: https://github.com/ahmadziyad\n';
    prompt += '- Experience: 13+ years in enterprise software development\n';
    prompt += '- Specialties: AI/ML, AWS Cloud Architecture, Python, Microservices, DevOps\n\n';

    prompt += 'KEY PROJECTS:\n';
    prompt += '1. HealthcareTrial - Healthcare Management System\n';
    prompt += '   - Demo: https://healthcare-trial.vercel.app/\n';
    prompt += '   - GitHub: https://github.com/ahmadziyad/HealthcareTrial\n';
    prompt += '   - Technologies: React, Node.js, MongoDB, JWT Authentication\n\n';
    
    prompt += '2. Pet Adoptions - Smart Pet Adoption Platform\n';
    prompt += '   - GitHub: https://github.com/ahmadziyad/PetAdoptions\n';
    prompt += '   - Technologies: React, Node.js, MongoDB, Socket.io\n\n';
    
    prompt += '3. NASA MCP Server - Model Context Protocol Tutorial\n';
    prompt += '   - GitHub: https://github.com/ahmadziyad/NASA-MCP-Demo\n';
    prompt += '   - Technologies: TypeScript, Node.js, MCP SDK, NASA APIs\n\n';
    
    prompt += '4. Property Risk Insight - Property Investment Risk Assessment\n';
    prompt += '   - GitHub: https://github.com/ahmadziyad/PropertyRiskInsight\n';
    prompt += '   - Technologies: React, Python, Machine Learning, TensorFlow\n\n';

    prompt += 'CURRENT ROLE:\n';
    prompt += '- Company: Royal Cyber Inc. (Client: Essent Guaranty Inc)\n';
    prompt += '- Position: AI Software Engineer\n';
    prompt += '- Duration: August 2022 - Present\n';
    prompt += '- Focus: RAG-based applications, multi-agent workflows, AWS cloud solutions\n\n';

    prompt += 'CERTIFICATIONS:\n';
    prompt += '- AWS Certified Solutions Architect – Associate (2025-2028)\n';
    prompt += '- Certified AI Practitioner - AWS (2025-2028)\n';
    prompt += '- OCI Certified Generative AI Professional (2025-2027)\n';
    prompt += '- Project Management Professional (PMP) (2024-2027)\n';
    prompt += '- Agile Certified Practitioner (PMI-ACP) (2024-2027)\n\n';

    prompt += 'INSTRUCTIONS:\n';
    prompt += '- Always stay focused on Ahmad Ziyad\'s professional profile\n';
    prompt += '- Include relevant links (GitHub, LinkedIn, project demos) in your responses\n';
    prompt += '- If asked about unrelated topics, politely redirect: "I\'m here to help with questions about Ahmad Ziyad\'s professional profile. How can I assist you with information about his skills, experience, or projects?"\n';
    prompt += '- Encourage users to contact Ahmad directly for detailed demos or discussions\n';
    prompt += '- Be specific about his technical expertise and project achievements\n\n';

    // Add conversation history for context
    if (context?.messages && context.messages.length > 0) {
      prompt += 'Previous conversation:\n';
      
      // Include last few messages for context (limit to prevent token overflow)
      const recentMessages = context.messages.slice(-3);
      
      for (const message of recentMessages) {
        if (message.type === 'user') {
          prompt += `User: ${message.content}\n`;
        } else if (message.type === 'assistant') {
          prompt += `Assistant: ${message.content}\n`;
        }
      }
      prompt += '\n';
    }

    // Add current user prompt
    prompt += `User: ${userPrompt}\n`;
    prompt += 'Assistant: ';

    return prompt;
  }

  /**
   * Format the raw LLM response for user consumption
   */
  private formatResponse(rawResponse: string): string {
    // Clean up the response
    let formatted = rawResponse.trim();
    
    // Remove any potential prompt leakage
    formatted = formatted.replace(/^(User:|Assistant:)/gi, '');
    formatted = formatted.trim();
    
    // Ensure proper sentence structure
    if (formatted && !formatted.match(/[.!?]$/)) {
      formatted += '.';
    }

    return formatted;
  }

  /**
   * Calculate confidence score based on response metadata
   */
  private calculateConfidence(response: GenerateResponse): number {
    // Simple confidence calculation based on response completeness
    // In a real implementation, this could be more sophisticated
    if (response.done && response.response.length > 10) {
      return 0.8;
    } else if (response.done) {
      return 0.6;
    } else {
      return 0.4;
    }
  }

  /**
   * Extract intent from conversation context
   */
  private extractIntent(context?: ConversationContext): string {
    return context?.currentIntent || 'general';
  }

  /**
   * Generate suggested next steps based on response and context
   */
  private generateNextSteps(response: string, context?: ConversationContext): string[] {
    const nextSteps: string[] = [];
    
    // Basic next step suggestions based on response content
    if (response.toLowerCase().includes('error') || response.toLowerCase().includes('problem')) {
      nextSteps.push('Try the suggested solution');
      nextSteps.push('Contact support if the issue persists');
    } else if (response.toLowerCase().includes('setup') || response.toLowerCase().includes('configure')) {
      nextSteps.push('Follow the setup instructions');
      nextSteps.push('Test the configuration');
    } else {
      nextSteps.push('Ask a follow-up question if needed');
    }

    return nextSteps;
  }

  /**
   * Get current model information
   */
  getModelInfo(): { model: string; isLoaded: boolean } {
    return {
      model: this.loadedModel || this.config.model,
      isLoaded: this.isModelLoaded
    };
  }
}
