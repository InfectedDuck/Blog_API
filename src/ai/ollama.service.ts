import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OllamaService {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('OLLAMA_URL', 'http://localhost:11434');
    this.model = this.configService.get<string>('OLLAMA_MODEL', 'mistral');
  }

  async generate(prompt: string): Promise<string> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Ollama returned ${res.status}`);
      }

      const data = await res.json();
      return data.response || 'No response generated.';
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return 'Analysis timed out. Please try again with a shorter text.';
      }
      if (error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
        return 'AI service is not available. Please ensure Ollama is running locally (ollama serve).';
      }
      return `AI analysis failed: ${error.message}`;
    }
  }
}
