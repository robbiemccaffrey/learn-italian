// Ensure dotenv is loaded
import dotenv from 'dotenv';
dotenv.config();

interface OpenAIError {
  error?: {
    message?: string;
  };
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export class ChatGPTService {
  private static apiUrl = 'https://api.openai.com/v1/chat/completions';

  private static getApiKey(): string {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found in environment variables');
      console.error('Current env keys:', Object.keys(process.env).filter(k => k.includes('OPENAI')));
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    return apiKey;
  }

  static async translate(text: string, sourceLang: string = 'it', targetLang: string = 'en'): Promise<string> {
    const apiKey = this.getApiKey();

    const prompt = `Translate the following Italian text to English. Only return the translation, nothing else: ${text}`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const error = await response.json() as OpenAIError;
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json() as OpenAIResponse;
      return data.choices?.[0]?.message?.content?.trim() || text;
    } catch (error) {
      console.error('ChatGPT translation error:', error);
      throw error;
    }
  }

  static async generatePhrase(word: string): Promise<string> {
    const apiKey = this.getApiKey();

    const prompt = `Create a simple, natural Italian sentence using the word '${word}'. The sentence should be appropriate for language learning. Only return the sentence, no explanation.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json() as OpenAIError;
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json() as OpenAIResponse;
      return data.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('ChatGPT phrase generation error:', error);
      throw error;
    }
  }
}

