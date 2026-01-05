"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.generateQuizQuestions = generateQuizQuestions;
exports.validateQuizQuestions = validateQuizQuestions;
var quizStore_1 = require("@/store/quizStore");
var OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
var API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
var QUIZ_SYSTEM_PROMPT = "You are an expert quiz generator for educational content. Your task is to generate 5 unique, high-quality multiple choice questions based on the given topic.\n\n## QUIZ GENERATION RULES:\n\n### Question Quality:\n- Questions should test understanding, not just memorization\n- Include a mix of difficulty levels (2 easy, 2 medium, 1 challenging)\n- Each question should be clear and unambiguous\n- Use age-appropriate language for school students (Class 6-12)\n\n### Format Requirements:\n- Return exactly 5 questions in a JSON array\n- Each question must have exactly 4 options (A, B, C, D)\n- Exactly one option must be correct\n- Provide a brief explanation for the correct answer\n\n### Safety & Educational Standards:\n- NEVER include harmful, dangerous, or inappropriate content\n- Questions must be purely educational\n- Avoid controversial or sensitive topics\n- Focus on academic concepts and factual knowledge\n\n### Response Format:\nReturn a JSON object with this structure:\n{\n  \"questions\": [\n    {\n      \"id\": \"q1\",\n      \"question\": \"Question text here?\",\n      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n      \"correctAnswer\": 0,\n      \"explanation\": \"Brief explanation of why this answer is correct\"\n    }\n  ]\n}\n\ncorrectAnswer should be the index (0-3) of the correct option.";
function generateQuizQuestions(className, subject, chapter) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, setLoading, setError, userPrompt, fallbackQuestions, response, errorText, data, content, parsedResponse, questions, error_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = quizStore_1.useQuizStore.getState(), setLoading = _a.setLoading, setError = _a.setError;
                    setLoading(true);
                    setError(null);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    userPrompt = "Generate 5 multiple choice questions about \"".concat(chapter, "\" for ").concat(className, " students studying ").concat(subject, ".\n\nRequirements:\n- Each question should test different aspects of the chapter\n- Include conceptual questions, application questions, and factual recall\n- Make options plausible but clearly distinguishable\n- Provide educational explanations\n\nTopic content context:\n").concat(chapter, " in ").concat(subject, " for ").concat(className, "\n\nPlease generate fresh, unique questions - do not repeat questions from previous quizzes.");
                    // If no API key, generate fallback quiz
                    if (!OPENAI_API_KEY) {
                        fallbackQuestions = generateFallbackQuiz(className, subject, chapter);
                        setLoading(false);
                        return [2 /*return*/, fallbackQuestions];
                    }
                    return [4 /*yield*/, fetch(API_ENDPOINT, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(OPENAI_API_KEY),
                            },
                            body: JSON.stringify({
                                model: 'gpt-4',
                                messages: [
                                    { role: 'system', content: QUIZ_SYSTEM_PROMPT },
                                    { role: 'user', content: userPrompt },
                                ],
                                max_tokens: 2000,
                                temperature: 0.8,
                            }),
                        })];
                case 2:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorText = _d.sent();
                    // Error handled silently
                    throw new Error("API error: ".concat(response.status));
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    data = _d.sent();
                    content = (_c = (_b = data.choices[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
                    if (!content) {
                        throw new Error('No content in API response');
                    }
                    parsedResponse = parseQuizResponse(content);
                    if (!parsedResponse || !parsedResponse.questions || parsedResponse.questions.length === 0) {
                        throw new Error('Failed to parse quiz questions');
                    }
                    questions = parsedResponse.questions.map(function (q, index) { return ({
                        id: "quiz-".concat(Date.now(), "-").concat(index),
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                    }); });
                    setLoading(false);
                    return [2 /*return*/, questions];
                case 6:
                    error_1 = _d.sent();
                    // Error handled silently
                    setError(error_1 instanceof Error ? error_1.message : 'Failed to generate quiz questions');
                    setLoading(false);
                    // Return fallback quiz on error
                    return [2 /*return*/, generateFallbackQuiz(className, subject, chapter)];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function parseQuizResponse(content) {
    try {
        // Try to parse directly
        return JSON.parse(content);
    }
    catch (_a) {
        // Try to extract JSON from markdown code blocks
        var jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[1]);
            }
            catch (_b) {
                // Error handled silently
            }
        }
        // Try to find JSON object in text
        var braceMatch = content.match(/\{[\s\S]*\}/);
        if (braceMatch) {
            try {
                return JSON.parse(braceMatch[0]);
            }
            catch (_c) {
                // Error handled silently
            }
        }
        return null;
    }
}
function generateFallbackQuiz(_className, _subject, chapter) {
    // Generate basic educational questions based on chapter name
    var baseQuestions = {
        'Chemical Reactions and Equations': [
            {
                id: 'fallback-1',
                question: 'What is a chemical reaction?',
                options: [
                    'A physical change in matter',
                    'A process where substances change into different substances',
                    'Mixing two liquids together',
                    'Heating a substance until it melts',
                ],
                correctAnswer: 1,
                explanation: 'A chemical reaction is a process where reactants transform into products with different chemical properties.',
            },
            {
                id: 'fallback-2',
                question: 'Which of the following is NOT a sign of a chemical reaction?',
                options: [
                    'Change in color',
                    'Production of gas',
                    'Change in temperature',
                    'Change in shape without chemical change',
                ],
                correctAnswer: 3,
                explanation: 'Change in shape without chemical change is a physical change, not a chemical reaction.',
            },
            {
                id: 'fallback-3',
                question: 'In a balanced chemical equation, what must be conserved?',
                options: [
                    'Mass only',
                    'Atoms of each element',
                    'Volume of gases',
                    'Temperature',
                ],
                correctAnswer: 1,
                explanation: 'According to the law of conservation of mass, atoms of each element must be equal on both sides.',
            },
            {
                id: 'fallback-4',
                question: 'What type of reaction is represented by: A + B → AB?',
                options: [
                    'Decomposition reaction',
                    'Combination reaction',
                    'Displacement reaction',
                    'Double displacement reaction',
                ],
                correctAnswer: 1,
                explanation: 'A combination reaction (or synthesis) is when two or more substances combine to form a single product.',
            },
            {
                id: 'fallback-5',
                question: 'What does the arrow (→) in a chemical equation indicate?',
                options: [
                    'Equals sign',
                    'Direction of reaction from reactants to products',
                    'Heat being added',
                    'Catalyst presence',
                ],
                correctAnswer: 1,
                explanation: 'The arrow shows the direction of the reaction, indicating reactants transform into products.',
            },
        ],
        default: [
            {
                id: 'fallback-1',
                question: "What is the main focus of the chapter \"".concat(chapter, "\"?"),
                options: [
                    "Understanding ".concat(chapter, " fundamentals and key concepts"),
                    'Memorizing dates and facts',
                    'Learning random unrelated topics',
                    'Solving complex mathematical problems',
                ],
                correctAnswer: 0,
                explanation: "This chapter focuses on building understanding of ".concat(chapter, " fundamentals."),
            },
            {
                id: 'fallback-2',
                question: "Which statement best describes \"".concat(chapter, "\"?"),
                options: [
                    "An advanced topic requiring prior knowledge of ".concat(chapter),
                    "An introductory chapter covering ".concat(chapter, " basics"),
                    'A review of previous topics',
                    'An optional supplementary chapter',
                ],
                correctAnswer: 1,
                explanation: "This chapter introduces the fundamental concepts of ".concat(chapter, "."),
            },
            {
                id: 'fallback-3',
                question: 'What is the best way to learn this chapter effectively?',
                options: [
                    'Memorizing without understanding',
                    'Active practice and concept application',
                    'Skipping difficult sections',
                    'Only reading once',
                ],
                correctAnswer: 1,
                explanation: 'Active practice and applying concepts is the most effective learning strategy.',
            },
            {
                id: 'fallback-4',
                question: 'Why is it important to understand this chapter?',
                options: [
                    'It is required for exams only',
                    'It builds foundation for advanced topics',
                    'It is not actually important',
                    'Only teachers need to understand it',
                ],
                correctAnswer: 1,
                explanation: 'Understanding fundamentals builds the foundation for learning advanced concepts.',
            },
            {
                id: 'fallback-5',
                question: "What should you do if you find \"".concat(chapter, "\" challenging?"),
                options: [
                    'Give up immediately',
                    'Ask for help and practice more',
                    'Skip to the next chapter',
                    'Copy answers from others',
                ],
                correctAnswer: 1,
                explanation: 'Seeking help and practicing consistently is the best approach to overcome challenges.',
            },
        ],
    };
    return baseQuestions[chapter] || baseQuestions.default.map(function (q, index) { return (__assign(__assign({}, q), { id: "fallback-".concat(Date.now(), "-").concat(index) })); });
}
function validateQuizQuestions(questions) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, questions_1, question;
        return __generator(this, function (_a) {
            if (!Array.isArray(questions) || questions.length === 0) {
                return [2 /*return*/, false];
            }
            for (_i = 0, questions_1 = questions; _i < questions_1.length; _i++) {
                question = questions_1[_i];
                // Validate question structure
                if (!question.id || !question.question || !question.explanation) {
                    return [2 /*return*/, false];
                }
                // Validate options
                if (!Array.isArray(question.options) || question.options.length !== 4) {
                    return [2 /*return*/, false];
                }
                // Validate correct answer index
                if (typeof question.correctAnswer !== 'number' ||
                    question.correctAnswer < 0 ||
                    question.correctAnswer > 3) {
                    return [2 /*return*/, false];
                }
                // Validate all options are non-empty strings
                if (!question.options.every(function (opt) { return typeof opt === 'string' && opt.trim().length > 0; })) {
                    return [2 /*return*/, false];
                }
            }
            return [2 /*return*/, true];
        });
    });
}
