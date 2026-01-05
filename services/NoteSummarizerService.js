"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteSummarizerService = exports.NoteSummarizerService = void 0;
var OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
var API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
var NoteSummarizerService = /** @class */ (function () {
    function NoteSummarizerService() {
    }
    NoteSummarizerService.getInstance = function () {
        if (!NoteSummarizerService.instance) {
            NoteSummarizerService.instance = new NoteSummarizerService();
        }
        return NoteSummarizerService.instance;
    };
    NoteSummarizerService.prototype.summarizeText = function (text, context) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt_1, response, data, content, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!OPENAI_API_KEY) {
                            return [2 /*return*/, this.getFallbackSummary(text, context)];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        prompt_1 = this.buildSummarizationPrompt(text, context);
                        return [4 /*yield*/, fetch(API_ENDPOINT, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: "Bearer ".concat(OPENAI_API_KEY),
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
                                            content: prompt_1,
                                        },
                                    ],
                                    max_tokens: 1000,
                                    temperature: 0.5,
                                }),
                            })];
                    case 2:
                        response = _c.sent();
                        if (!response.ok) {
                            throw new Error("API error: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _c.sent();
                        content = ((_b = (_a = data.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || '';
                        return [2 /*return*/, this.parseSummarizationResponse(content)];
                    case 4:
                        error_1 = _c.sent();
                        // Error handled silently
                        return [2 /*return*/, this.getFallbackSummary(text, context)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NoteSummarizerService.prototype.getSystemPrompt = function () {
        return "You are an expert educational content summarizer for students.\n\nYour task is to transform verbose spoken or written text into clean, organized study notes.\n\n**Requirements:**\n1. Create a concise, well-structured summary\n2. Extract key concepts and important information\n3. Organize content with clear headings and bullet points\n4. Use simple, student-friendly language\n5. Maintain educational accuracy\n6. Suggest a relevant title for the notes\n7. Identify relevant keywords/tags\n\n**Format:**\n- Use markdown formatting\n- Start with a clear, descriptive title (e.g., \"## Photosynthesis\")\n- Use bullet points for key concepts\n- Group related information together\n- Keep it concise but comprehensive\n\n**Response Format:**\nReturn a JSON object with the following structure:\n{\n  \"summary\": \"The formatted summary in markdown\",\n  \"keyPoints\": [\"Key point 1\", \"Key point 2\", ...],\n  \"keywords\": [\"keyword1\", \"keyword2\", ...],\n  \"suggestedTitle\": \"Descriptive title\",\n  \"suggestedTags\": [\"tag1\", \"tag2\", ...]\n}";
    };
    NoteSummarizerService.prototype.buildSummarizationPrompt = function (text, context) {
        var prompt = "Please summarize and organize the following text into clean study notes:\n\n";
        if (context === null || context === void 0 ? void 0 : context.subject) {
            prompt += "**Subject:** ".concat(context.subject, "\n");
        }
        if (context === null || context === void 0 ? void 0 : context.chapter) {
            prompt += "**Chapter:** ".concat(context.chapter, "\n");
        }
        if (context === null || context === void 0 ? void 0 : context.language) {
            prompt += "**Language:** ".concat(context.language, "\n");
        }
        prompt += "\n**Text to summarize:**\n".concat(text, "\n\n");
        prompt += "Create well-structured, easy-to-read study notes from this content.";
        return prompt;
    };
    NoteSummarizerService.prototype.parseSummarizationResponse = function (content) {
        try {
            // Try to extract JSON from the response
            var jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON object found in response');
            }
            var parsed = JSON.parse(jsonMatch[0]);
            return {
                summary: parsed.summary || content,
                keyPoints: parsed.keyPoints || [],
                keywords: parsed.keywords || [],
                suggestedTitle: parsed.suggestedTitle || 'Study Notes',
                suggestedTags: parsed.suggestedTags || [],
            };
        }
        catch (error) {
            // Error handled silently
            // Return the raw content as summary
            return {
                summary: content,
                keyPoints: [],
                keywords: [],
                suggestedTitle: 'Study Notes',
                suggestedTags: [],
            };
        }
    };
    NoteSummarizerService.prototype.getFallbackSummary = function (text, context) {
        // Create a basic summary without AI
        var sentences = text.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
        var keyPoints = sentences.slice(0, 5).map(function (s) { return s.trim(); });
        // Extract potential keywords (capitalized words)
        var words = text.split(/\s+/);
        var keywords = words
            .filter(function (w) { return /^[A-Z][a-z]+$/.test(w); })
            .slice(0, 10);
        var summary = "## ".concat((context === null || context === void 0 ? void 0 : context.chapter) || 'Study Notes', "\n\n") +
            keyPoints.map(function (point, i) { return "".concat(i + 1, ". ").concat(point); }).join('\n') +
            '\n\n**Note:** AI summarization is currently unavailable. Enable API access for better summaries.';
        return {
            summary: summary,
            keyPoints: keyPoints,
            keywords: keywords,
            suggestedTitle: (context === null || context === void 0 ? void 0 : context.chapter) || 'Study Notes',
            suggestedTags: (context === null || context === void 0 ? void 0 : context.subject) ? [context.subject] : [],
        };
    };
    NoteSummarizerService.prototype.formatAsStudyNote = function (title, content, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var note;
            return __generator(this, function (_a) {
                note = "## ".concat(title, "\n\n");
                if ((metadata === null || metadata === void 0 ? void 0 : metadata.subject) || (metadata === null || metadata === void 0 ? void 0 : metadata.chapter)) {
                    note += '**Context:** ';
                    if (metadata.subject)
                        note += "".concat(metadata.subject);
                    if (metadata.chapter)
                        note += " - ".concat(metadata.chapter);
                    note += '\n\n';
                }
                note += content;
                if ((metadata === null || metadata === void 0 ? void 0 : metadata.tags) && metadata.tags.length > 0) {
                    note += "\n\n**Tags:** ".concat(metadata.tags.join(', '));
                }
                return [2 /*return*/, note];
            });
        });
    };
    NoteSummarizerService.prototype.extractKeyConcepts = function (text) {
        // Simple keyword extraction
        var words = text.toLowerCase().split(/\s+/);
        var stopWords = new Set([
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
        var wordFrequency = new Map();
        words.forEach(function (word) {
            if (word.length > 3 && !stopWords.has(word) && /^[a-z]+$/.test(word)) {
                wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
            }
        });
        return Array.from(wordFrequency.entries())
            .sort(function (a, b) { return b[1] - a[1]; })
            .slice(0, 10)
            .map(function (_a) {
            var word = _a[0];
            return word;
        });
    };
    return NoteSummarizerService;
}());
exports.NoteSummarizerService = NoteSummarizerService;
exports.noteSummarizerService = NoteSummarizerService.getInstance();
