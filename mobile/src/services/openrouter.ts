interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateTemplate(prompt: string, model: string = 'openai/gpt-oss-20b:free'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://leadmessenger.app',
          'X-Title': 'LeadMessenger',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional email template generator. Create concise, effective email templates for job outreach and networking. Always respond with just the template content, no explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        } as OpenRouterRequest)
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || 'Failed to generate template';
    } catch (error) {
      console.error('Error generating template:', error);
      throw error;
    }
  }

  async generateSubjectLine(templateBody: string, model: string = 'openai/gpt-oss-20b:free'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://leadmessenger.app',
          'X-Title': 'LeadMessenger',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional email subject line generator. Create compelling, concise subject lines (max 60 characters) for email templates. Always respond with just the subject line, no quotes or explanations.'
            },
            {
              role: 'user',
              content: `Generate a subject line for this email template:\n\n${templateBody}`
            }
          ],
          temperature: 0.7,
          max_tokens: 100
        } as OpenRouterRequest)
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content?.trim() || 'Subject Line';
    } catch (error) {
      console.error('Error generating subject line:', error);
      throw error;
    }
  }
}

// Available FREE models for template generation
export const OPENROUTER_MODELS = {
  'gpt-oss-20b': 'openai/gpt-oss-20b:free',
  'deepseek-r1-qwen': 'deepseek/deepseek-r1-0528-qwen3-8b:free',
  'deepseek-r1': 'deepseek/deepseek-r1-0528:free',
} as const;

export type OpenRouterModel = keyof typeof OPENROUTER_MODELS;
