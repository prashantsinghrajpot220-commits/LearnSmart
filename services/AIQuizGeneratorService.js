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
exports.aiQuizGeneratorService = exports.AIQuizGeneratorService = void 0;
var OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
var API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
var AIQuizGeneratorService = /** @class */ (function () {
    function AIQuizGeneratorService() {
    }
    AIQuizGeneratorService.getInstance = function () {
        if (!AIQuizGeneratorService.instance) {
            AIQuizGeneratorService.instance = new AIQuizGeneratorService();
        }
        return AIQuizGeneratorService.instance;
    };
    AIQuizGeneratorService.prototype.generateQuiz = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var subject, chapter, lessonContent, _a, difficulty, _b, questionCount, topic, prompt_1, response, data, content, error_1;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        subject = options.subject, chapter = options.chapter, lessonContent = options.lessonContent, _a = options.difficulty, difficulty = _a === void 0 ? 'medium' : _a, _b = options.questionCount, questionCount = _b === void 0 ? 5 : _b, topic = options.topic;
                        if (!OPENAI_API_KEY) {
                            return [2 /*return*/, this.getFallbackQuiz(subject, chapter, difficulty, questionCount)];
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 4, , 5]);
                        prompt_1 = this.buildQuizPrompt({
                            subject: subject,
                            chapter: chapter,
                            lessonContent: lessonContent,
                            difficulty: difficulty,
                            topic: topic,
                        });
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
                                    max_tokens: 2000,
                                    temperature: 0.7,
                                }),
                            })];
                    case 2:
                        response = _e.sent();
                        if (!response.ok) {
                            throw new Error("API error: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _e.sent();
                        content = ((_d = (_c = data.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) || '';
                        return [2 /*return*/, this.parseQuizResponse(content, subject, chapter, difficulty, topic || chapter)];
                    case 4:
                        error_1 = _e.sent();
                        // Error generating quiz, returning fallback
                        return [2 /*return*/, this.getFallbackQuiz(subject, chapter, difficulty, questionCount)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AIQuizGeneratorService.prototype.getSystemPrompt = function () {
        return "You are an expert educational quiz generator for NCERT curriculum students (Class 1-12).\n\nYour task is to generate high-quality multiple-choice questions based on the provided subject and chapter content.\n\n**Requirements:**\n1. Generate exactly the requested number of questions (5 by default)\n2. Each question must have exactly 4 options (A, B, C, D)\n3. Only ONE correct answer per question\n4. Questions must be age-appropriate for the class level\n5. Difficulty must match the specified level (easy/medium/hard)\n6. Provide clear, concise explanations for the correct answer\n7. Questions should test understanding, not just memorization\n8. Avoid repeating questions within the same quiz\n\n**Difficulty Guidelines:**\n- Easy: Basic facts, definitions, direct recall\n- Medium: Application of concepts, simple problem-solving\n- Hard: Complex problem-solving, analysis, synthesis\n\n**Response Format:**\nReturn ONLY a JSON array with the following structure:\n[\n  {\n    \"question\": \"Question text here\",\n    \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n    \"correctAnswer\": 0,\n    \"explanation\": \"Clear explanation of why this is correct\"\n  }\n]\n\nNote: correctAnswer should be 0, 1, 2, or 3 (index of correct option in the options array).";
    };
    AIQuizGeneratorService.prototype.buildQuizPrompt = function (context) {
        var prompt = "Generate ".concat(5, " multiple-choice questions for the following topic:\n\n");
        prompt += "**Subject:** ".concat(context.subject, "\n");
        prompt += "**Chapter:** ".concat(context.chapter, "\n");
        prompt += "**Difficulty:** ".concat(context.difficulty, "\n");
        if (context.topic) {
            prompt += "**Specific Topic:** ".concat(context.topic, "\n");
        }
        if (context.lessonContent) {
            prompt += "\n**Lesson Content:**\n".concat(context.lessonContent, "\n");
        }
        prompt += "\nGenerate questions that test understanding of this content. Questions should be unique and not repetitive.";
        return prompt;
    };
    AIQuizGeneratorService.prototype.parseQuizResponse = function (content, subject, chapter, difficulty, topic) {
        try {
            // Try to extract JSON from the response
            var jsonMatch = content.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No JSON array found in response');
            }
            var parsed = JSON.parse(jsonMatch[0]);
            var questions_1 = [];
            if (!Array.isArray(parsed)) {
                throw new Error('Response is not an array');
            }
            parsed.forEach(function (item, index) {
                if (item.question && item.options && Array.isArray(item.options) && item.options.length === 4) {
                    questions_1.push({
                        id: "".concat(subject, "-").concat(chapter, "-").concat(Date.now(), "-").concat(index),
                        question: item.question,
                        options: item.options,
                        correctAnswer: typeof item.correctAnswer === 'number' ? item.correctAnswer : 0,
                        explanation: item.explanation || 'No explanation provided',
                        difficulty: difficulty,
                        topic: topic,
                        generatedAt: Date.now(),
                    });
                }
            });
            // If we didn't get enough questions, fill with fallback
            while (questions_1.length < 5) {
                var fallback = this.getFallbackQuestions(subject, chapter, difficulty, topic);
                questions_1.push.apply(questions_1, fallback.slice(0, 5 - questions_1.length));
            }
            return questions_1.slice(0, 5);
        }
        catch (error) {
            // Error parsing quiz response, returning fallback
            return this.getFallbackQuiz(subject, chapter, difficulty, 5);
        }
    };
    AIQuizGeneratorService.prototype.getFallbackQuiz = function (subject, chapter, difficulty, count) {
        return this.getFallbackQuestions(subject, chapter, difficulty, chapter).slice(0, count);
    };
    AIQuizGeneratorService.prototype.getFallbackQuestions = function (subject, chapter, difficulty, topic) {
        // Generate generic fallback questions
        var baseQuestions = [
            {
                question: "What is the main concept covered in ".concat(chapter, "?"),
                options: [
                    'The first key concept',
                    'The second key concept',
                    'The third key concept',
                    'The fourth key concept',
                ],
                correctAnswer: 0,
                explanation: "This question tests understanding of the main concept in ".concat(chapter, "."),
            },
            {
                question: "Which of the following is a characteristic of ".concat(topic, "?"),
                options: ['Characteristic A', 'Characteristic B', 'Characteristic C', 'Characteristic D'],
                correctAnswer: 1,
                explanation: "This tests knowledge about ".concat(topic, " characteristics."),
            },
            {
                question: "How would you apply the concept of ".concat(topic, " in a real-world scenario?"),
                options: ['Application A', 'Application B', 'Application C', 'Application D'],
                correctAnswer: 2,
                explanation: "This tests practical application of ".concat(topic, "."),
            },
            {
                question: "What is the relationship between the concepts in ".concat(chapter, "?"),
                options: [
                    'They are unrelated',
                    'They are complementary',
                    'They are contradictory',
                    'They are sequential',
                ],
                correctAnswer: 1,
                explanation: "This tests understanding of concept relationships.",
            },
            {
                question: "Which statement about ".concat(topic, " is correct?"),
                options: [
                    'Statement A is correct',
                    'Statement B is correct',
                    'Statement C is correct',
                    'Statement D is correct',
                ],
                correctAnswer: 0,
                explanation: "This tests factual knowledge about ".concat(topic, "."),
            },
        ];
        return baseQuestions.map(function (q, index) { return ({
            id: "".concat(subject, "-").concat(chapter, "-fallback-").concat(Date.now(), "-").concat(index),
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: difficulty,
            topic: topic,
            generatedAt: Date.now(),
        }); });
    };
    AIQuizGeneratorService.prototype.getRecommendedDifficulty = function (userAccuracy) {
        if (userAccuracy >= 80) {
            return 'hard';
        }
        else if (userAccuracy >= 60) {
            return 'medium';
        }
        else {
            return 'easy';
        }
    };
    return AIQuizGeneratorService;
}());
exports.AIQuizGeneratorService = AIQuizGeneratorService;
exports.aiQuizGeneratorService = AIQuizGeneratorService.getInstance();
