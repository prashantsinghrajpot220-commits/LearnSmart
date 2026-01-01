import { SummarizationResult } from '@/types/notes';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export class NoteSummarizerService {
  private static instance: NoteSummarizerService;

  private constructor() {}

  public static getInstance(): NoteSummarizerService {
    if (!NoteSummarizerService.instance) {
      NoteSummarizerService.instance = new NoteSummarizerService();
    }
    return NoteSummarizerService.instance;
  }

  async summarizeText(
    text: string,
    context?: {
      subject?: string;
      chapter?: string;
      language?: 'en' | 'hi' | 'hinglish';
    }
  ): Promise<SummarizationResult> {
    if (!OPENAI_API_KEY) {
      return this.getFallbackSummary(text, context);
    }

    try {
      const prompt = this.buildSummarizationPrompt(text, context);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      return this.parseSummarizationResponse(content);
    } catch (error) {
      console.error('AI Summarization Error:', error);
      return this.getFallbackSummary(text, context);
    }
  }

  private getSystemPrompt(): string {
    return `You are an expert educational content summarizer for students.

Your task is to transform verbose spoken or written text into clean, organized study notes.

**Requirements:**
1. Create a concise, well-structured summary
2. Extract key concepts and important information
3. Organize content with clear headings and bullet points
4. Use simple, student-friendly language
5. Maintain educational accuracy
6. Suggest a relevant title for the notes
7. Identify relevant keywords/tags

**Format:**
- Use markdown formatting
- Start with a clear, descriptive title (e.g., "## Photosynthesis")
- Use bullet points for key concepts
- Group related information together
- Keep it concise but comprehensive

**Response Format:**
Return a JSON object with the following structure:
{
  "summary": "The formatted summary in markdown",
  "keyPoints": ["Key point 1", "Key point 2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "suggestedTitle": "Descriptive title",
  "suggestedTags": ["tag1", "tag2", ...]
}`;
  }

  private buildSummarizationPrompt(
    text: string,
    context?: {
      subject?: string;
      chapter?: string;
      language?: 'en' | 'hi' | 'hinglish';
    }
  ): string {
    let prompt = `Please summarize and organize the following text into clean study notes:\n\n`;
    
    if (context?.subject) {
      prompt += `**Subject:** ${context.subject}\n`;
    }
    if (context?.chapter) {
      prompt += `**Chapter:** ${context.chapter}\n`;
    }
    if (context?.language) {
      prompt += `**Language:** ${context.language}\n`;
    }

    prompt += `\n**Text to summarize:**\n${text}\n\n`;
    prompt += `Create well-structured, easy-to-read study notes from this content.`;

    return prompt;
  }

  private parseSummarizationResponse(content: string): SummarizationResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        summary: parsed.summary || content,
        keyPoints: parsed.keyPoints || [],
        keywords: parsed.keywords || [],
        suggestedTitle: parsed.suggestedTitle || 'Study Notes',
        suggestedTags: parsed.suggestedTags || [],
      };
    } catch (error) {
      console.error('Failed to parse summarization response:', error);
      // Return the raw content as summary
      return {
        summary: content,
        keyPoints: [],
        keywords: [],
        suggestedTitle: 'Study Notes',
        suggestedTags: [],
      };
    }
  }

  private getFallbackSummary(
    text: string,
    context?: {
      subject?: string;
      chapter?: string;
    }
  ): SummarizationResult {
    // Create a basic summary without AI
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keyPoints = sentences.slice(0, 5).map(s => s.trim());
    
    // Extract potential keywords (capitalized words)
    const words = text.split(/\s+/);
    const keywords = words
      .filter(w => /^[A-Z][a-z]+$/.test(w))
      .slice(0, 10);

    const summary = `## ${context?.chapter || 'Study Notes'}\n\n` +
      keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n') +
      '\n\n**Note:** AI summarization is currently unavailable. Enable API access for better summaries.';

    return {
      summary,
      keyPoints,
      keywords,
      suggestedTitle: context?.chapter || 'Study Notes',
      suggestedTags: context?.subject ? [context.subject] : [],
    };
  }

  async formatAsStudyNote(
    title: string,
    content: string,
    metadata?: {
      subject?: string;
      chapter?: string;
      tags?: string[];
    }
  ): Promise<string> {
    let note = `## ${title}\n\n`;

    if (metadata?.subject || metadata?.chapter) {
      note += '**Context:** ';
      if (metadata.subject) note += `${metadata.subject}`;
      if (metadata.chapter) note += ` - ${metadata.chapter}`;
      note += '\n\n';
    }

    note += content;

    if (metadata?.tags && metadata.tags.length > 0) {
      note += `\n\n**Tags:** ${metadata.tags.join(', ')}`;
    }

    return note;
  }

  extractKeyConcepts(text: string): string[] {
    // Simple keyword extraction
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'shall', 'can', 'to', 'from', 'in',
      'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
      'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'as', 'at', 'by', 'if',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we',
      'they', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how',
      'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
      'such', 'no', 'not', 'only', 'own', 'same', 'than', 'too', 'very',
    ]);

    const wordFrequency = new Map<string, number>();
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word) && /^[a-z]+$/.test(word)) {
        wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
      }
    });

    return Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }
}

export const noteSummarizerService = NoteSummarizerService.getInstance();
