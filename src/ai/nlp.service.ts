import { Injectable } from '@nestjs/common';

export interface NlpResult {
  keywords: string[];
  entities: string[];
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  keyPhrases: string[];
  wordCount: number;
  readingTimeMinutes: number;
}

@Injectable()
export class NlpService {
  async analyze(text: string): Promise<NlpResult> {
    const plainText = text.replace(/<[^>]*>/g, '').trim();
    const words = plainText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const keywords = await this.extractKeywords(plainText);
    const { entities, keyPhrases } = await this.extractEntitiesAndPhrases(plainText);
    const sentiment = await this.analyzeSentiment(plainText);

    return { keywords, entities, sentiment, keyPhrases, wordCount, readingTimeMinutes };
  }

  private async extractKeywords(text: string): Promise<string[]> {
    try {
      const natural = await import('natural');
      const tfidf = new natural.TfIdf();
      tfidf.addDocument(text);
      const terms: string[] = [];
      tfidf.listTerms(0).slice(0, 10).forEach((item: any) => {
        if (item.term.length > 2) {
          terms.push(item.term);
        }
      });
      return terms;
    } catch {
      return this.fallbackKeywords(text);
    }
  }

  private fallbackKeywords(text: string): string[] {
    const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'this', 'that', 'these', 'those', 'it', 'its']);
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w));
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w]) => w);
  }

  private async analyzeSentiment(text: string): Promise<{ score: number; label: 'positive' | 'negative' | 'neutral' }> {
    try {
      const natural = await import('natural');
      const tokenizer = new natural.WordTokenizer();
      const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
      const tokens = tokenizer.tokenize(text) || [];
      const score = analyzer.getSentiment(tokens);
      const label = score > 0.05 ? 'positive' : score < -0.05 ? 'negative' : 'neutral';
      return { score: Math.round(score * 100) / 100, label };
    } catch {
      return { score: 0, label: 'neutral' };
    }
  }

  private async extractEntitiesAndPhrases(text: string): Promise<{ entities: string[]; keyPhrases: string[] }> {
    try {
      const nlp = (await import('compromise')).default;
      const doc = nlp(text);
      const people = doc.people().out('array') as string[];
      const places = doc.places().out('array') as string[];
      const orgs = doc.organizations().out('array') as string[];
      const entities = [...new Set([...people, ...places, ...orgs])].slice(0, 10);
      const nouns = doc.nouns().out('array') as string[];
      const keyPhrases = [...new Set(nouns)].slice(0, 8);
      return { entities, keyPhrases };
    } catch {
      return { entities: [], keyPhrases: [] };
    }
  }
}
