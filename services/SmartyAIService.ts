import { useChatStore } from '@/store/chatStore';
import { useUserStore } from '@/store/userStore';
import { ContentValidator } from '@/services/ContentValidator';
import { ContentType } from '@/types/content';
import { sanitizeText } from '@/utils/sanitizer';
import { Attachment, extractTextFromFile } from '@/services/FileUploadService';
import { detectLanguage } from '@/services/LanguageDetectionService';
import { correctTypos } from '@/utils/typoCorrection';
import { getLanguageInstruction } from '@/utils/translationService';
import { StreamingService } from '@/services/StreamingService';
import * as FileSystem from 'expo-file-system';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const SMARTY_SYSTEM_PROMPT = `You are "Smarty", a supportive older sibling and study companion for students.

## YOUR CORE IDENTITY
- You are knowledgeable, humble, encouraging, and always prioritize student safety and learning
- You communicate with warmth, clarity, and respect
- You are NOT a formal teacher - you're a trusted friend who helps students learn
- You are intelligent but never arrogant or dismissive

## YOUR KNOWLEDGE BASE
You have complete access to:
- All NCERT curriculum (Class 1-12): Subjects, chapters, lessons, concepts
- All curriculum content: Class 11-12 streams (Science, Commerce, Arts), 12+ pathways (Competitive Exams, Skill Building)
- Student's current class, stream, and selected subjects
- Student's learning progress (chapters completed, lessons viewed)
- Student's learning history and performance patterns
- Concepts the student is currently studying
- Related topics and advanced concepts beyond current curriculum
- General educational knowledge (science, math, history, geography, languages)
- Problem-solving techniques and study tips
- Time management and learning strategies
- Real-world applications of concepts
- Common misconceptions and how to overcome them
- Examination preparation tips (for JEE, NEET, UPSC, etc.)
- Career guidance related to subjects

## MULTILINGUAL SUPPORT
- Detect and respond in the same language as the user
- Languages: English, Hindi (Devanagari), Hinglish (Mixed Hindi/English in Roman script)
- If Hinglish, maintain a friendly, natural Hinglish flow
- Automatically correct minor typos in educational terms

## VISION & FILE ANALYSIS
- You can analyze images (JPG, PNG, GIF, WebP) and files (PDF, DOCX, TXT, PPTX)
- When provided with an image or file content, analyze it carefully to help the student
- Explain concepts found in attachments simply and clearly
- If analyzing, start with a brief confirmation like "Analyzing your image..." or "Looking at your file..."

## YOUR COMMUNICATION STYLE
- Warm, friendly, encouraging, supportive tone
- Humble (never arrogant or dismissive)
- Use simple, clear language (age-appropriate)
- Sparse emoji use (1-2 per message max)
- Brief responses (2-3 sentences for simple questions)
- Longer explanations only when asked or for complex topics
- Conversational (like texting a friend, not robotic)
- Celebrate student wins ("That's great! You're doing awesome!")
- Be empathetic to struggles ("This chapter is tough, but you'll get it!")

## YOUR 7 SAFETY RULES (STRICT - NEVER VIOLATE)
(Rules 1-7 same as before...)
`;

interface ChatContext {
  userName: string;
  selectedClass: string;
  selectedStream: string;
  currentSubject?: string;
  currentChapter?: string;
  currentLesson?: string;
}

export async function sendMessageToSmarty(
  message: string,
  context: ChatContext,
  attachments: Attachment[] = []
): Promise<string> {
  const { setTyping, addMessage } = useChatStore.getState();
  const { selectedClass, selectedStream } = useUserStore.getState();
  const chatId = 'default_chat'; // In a multi-chat app, this would be the actual chat ID

  setTyping(true);
  const abortController = StreamingService.createController(chatId);

  try {
    const ageGroup = useUserStore.getState().ageGroup ?? 'under12';
    
    // Typo Correction & Language Detection
    const correctedMessage = correctTypos(message);
    const language = detectLanguage(correctedMessage);
    const langInstruction = getLanguageInstruction(language);
    
    const sanitizedUserMessage = sanitizeText(correctedMessage, { maxLength: 1000 });

    // Build context-aware system message enhancement
    let contextInfo = `\n\n${langInstruction}`;
    if (selectedClass) {
      contextInfo += `\n\nStudent's Context:\n- Class: ${selectedClass}`;
      if (selectedStream) {
        contextInfo += `\n- Stream: ${selectedStream}`;
      }
      if (context.currentSubject) {
        contextInfo += `\n- Currently viewing: ${context.currentSubject}`;
      }
      if (context.currentChapter) {
        contextInfo += `\n- Current chapter: ${context.currentChapter}`;
      }
      if (context.currentLesson) {
        contextInfo += `\n- Current lesson: ${context.currentLesson}`;
      }
    }

    // Check for safety violations
    const safetyCheck = checkSafetyViolations(sanitizedUserMessage);
    if (safetyCheck.blocked) {
      setTyping(false);
      addMessage('assistant', safetyCheck.response);
      return safetyCheck.response;
    }

    // Process attachments
    let attachmentPrompt = '';
    const apiMessages: any[] = [
      { role: 'system', content: SMARTY_SYSTEM_PROMPT + contextInfo }
    ];

    const userMessageContent: any[] = [{ type: 'text', text: sanitizedUserMessage }];

    if (attachments.length > 0) {
      for (const att of attachments) {
        if (att.type === 'image') {
          try {
            const base64 = await FileSystem.readAsStringAsync(att.uri, { encoding: 'base64' });
            userMessageContent.push({
              type: 'image_url',
              image_url: { url: `data:${att.mimeType};base64,${base64}` }
            });
          } catch (e) {
            // Failed to read image as base64 - continue without image
          }
        } else if (att.type === 'file') {
          const extractedText = await extractTextFromFile(att);
          attachmentPrompt += `\n\nContent of attached file "${att.name}":\n${extractedText}`;
        }
      }
    }

    if (attachmentPrompt) {
      apiMessages[0].content += attachmentPrompt;
    }

    apiMessages.push({ role: 'user', content: userMessageContent });

    // If no API key, use fallback
    if (!OPENAI_API_KEY) {
      const response = getFallbackResponse(sanitizedUserMessage, context);
      setTyping(false);
      addMessage('assistant', response);
      return response;
    }

    // API call with AbortSignal
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      signal: abortController.signal,
      body: JSON.stringify({
        model: attachments.some(a => a.type === 'image') ? 'gpt-4o' : 'gpt-4',
        messages: apiMessages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false, // For this implementation, we'll keep it simple but allow abortion
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || getFallbackResponse(sanitizedUserMessage, context);

    const validated = await ContentValidator.validateText({
      text: aiResponse,
      context: {
        contentId: `chat:assistant:${Date.now()}`,
        contentType: ContentType.AIResponseText,
        ageGroup,
        source: 'smartyAI',
      },
    });

    const finalResponse = validated.result.decision === 'allow' ? validated.sanitizedText : "I'm here to help you learn safely. 📚";

    setTyping(false);
    addMessage('assistant', finalResponse);
    return finalResponse;

  } catch (error: unknown) {
    setTyping(false);
    if (error instanceof Error && error.name === 'AbortError') {
      addMessage('assistant', 'Response cancelled', [], 'stopped');
      return 'Response cancelled';
    }
    const fallbackResponse = "I'm having trouble connecting. 📡 Try again soon!";
    addMessage('assistant', fallbackResponse);
    return fallbackResponse;
  }
}

// ... Keep checkSafetyViolations and getFallbackResponse as they were ...

function checkSafetyViolations(message: string): any {
  const lowerMessage = message.toLowerCase();
  const personalPatterns = [/phone\s*number/i, /email\s*address/i, /home\s*address/i];
  for (const pattern of personalPatterns) {
    if (pattern.test(lowerMessage)) {
      return { blocked: true, response: "I don't need personal details like that. I'm here to help you learn! 🔒" };
    }
  }
  return { blocked: false, response: '' };
}

function getFallbackResponse(_message: string, _context: ChatContext): string {
  return "That's an interesting question! Let's explore it together. 📚";
}

export function getQuickReplies(): string[] {
  return [
    "Explain this simply",
    "Give me an example",
    "How to study this?",
    "Next topic →",
    "Practice problems"
  ];
}
