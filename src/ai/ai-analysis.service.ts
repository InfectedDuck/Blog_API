import { Injectable } from '@nestjs/common';
import { NlpService, type NlpResult } from './nlp.service.js';
import { OllamaService } from './ollama.service.js';

export interface AnalysisResult {
  nlp: NlpResult;
  aiResponse: string;
  mode: string;
}

const MODE_INSTRUCTIONS: Record<string, string> = {
  'emotional-support':
    'The user may have written about personal experiences. Based on the sentiment and keywords, provide empathetic, supportive feedback. If the sentiment is negative, offer comfort and perspective. If positive, celebrate with them. Reference specific keywords from their writing to show you understand their content. Be warm and genuine.',
  'writing-feedback':
    'Provide constructive feedback on the writing. Comment on the topics covered (based on keywords), the emotional tone, the length, and suggest improvements. Be specific and encouraging.',
  'topic-insights':
    'Based on the keywords, entities, and key phrases, provide deeper insights on the topics discussed. Suggest related topics, interesting connections between the identified themes, and potential directions for further exploration.',
  'content-summary':
    'Provide a concise summary of the blog post based on the extracted keywords, phrases, and sentiment. Highlight the main themes and the overall tone.',
};

@Injectable()
export class AiAnalysisService {
  constructor(
    private nlpService: NlpService,
    private ollamaService: OllamaService,
  ) {}

  async analyzePost(content: string, mode: string): Promise<AnalysisResult> {
    const nlp = await this.nlpService.analyze(content);

    const modeInstructions = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS['content-summary'];

    const prompt = `You are an AI assistant analyzing a blog post. Here is the structured analysis of the text:

KEYWORDS: ${nlp.keywords.join(', ') || 'None extracted'}
KEY PHRASES: ${nlp.keyPhrases.join(', ') || 'None extracted'}
ENTITIES: ${nlp.entities.join(', ') || 'None detected'}
SENTIMENT: ${nlp.sentiment.label} (score: ${nlp.sentiment.score.toFixed(2)})
WORD COUNT: ${nlp.wordCount}
READING TIME: ${nlp.readingTimeMinutes} min

The user has requested analysis in "${mode}" mode.

${modeInstructions}

Provide a thoughtful, helpful response based on the above analysis. Keep it concise (2-3 paragraphs).`;

    const aiResponse = await this.ollamaService.generate(prompt);

    return { nlp, aiResponse, mode };
  }
}
