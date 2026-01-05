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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentValidator = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var content_1 = require("@/types/content");
var contentRating_1 = require("@/utils/contentRating");
var sanitizer_1 = require("@/utils/sanitizer");
var SafetyChecker_1 = require("@/services/SafetyChecker");
var STORAGE_KEYS = {
    EVENTS: '@learnsmart/moderation_events',
    QUARANTINE: '@learnsmart/moderation_quarantine',
};
var quarantineCache = null;
var initPromise = null;
function ensureInitialized() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (quarantineCache)
                return [2 /*return*/];
            if (initPromise)
                return [2 /*return*/, initPromise];
            initPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                var raw, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEYS.QUARANTINE)];
                        case 1:
                            raw = _a.sent();
                            quarantineCache = raw ? JSON.parse(raw) : {};
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            // Failed to load quarantine cache - initialize empty cache
                            quarantineCache = {};
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
            return [2 /*return*/, initPromise];
        });
    });
}
function nowIso() {
    return new Date().toISOString();
}
function decisionToStatus(decision) {
    if (decision === 'quarantine')
        return 'pending';
    return 'approved';
}
function appendModerationEvent(event) {
    return __awaiter(this, void 0, void 0, function () {
        var existingRaw, existing, next, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEYS.EVENTS)];
                case 1:
                    existingRaw = _a.sent();
                    existing = existingRaw ? JSON.parse(existingRaw) : [];
                    next = __spreadArray([event], existing, true).slice(0, 200);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(next))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateQuarantine(contentId, update) {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureInitialized()];
                case 1:
                    _a.sent();
                    quarantineCache = quarantineCache !== null && quarantineCache !== void 0 ? quarantineCache : {};
                    quarantineCache[contentId] = update;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.QUARANTINE, JSON.stringify(quarantineCache))];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var ContentValidator = /** @class */ (function () {
    function ContentValidator() {
    }
    ContentValidator.getModerationEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var raw, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEYS.EVENTS)];
                    case 1:
                        raw = _b.sent();
                        return [2 /*return*/, raw ? JSON.parse(raw) : []];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContentValidator.isQuarantined = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ensureInitialized()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Boolean((quarantineCache === null || quarantineCache === void 0 ? void 0 : quarantineCache[contentId]) && quarantineCache[contentId].status === 'pending')];
                }
            });
        });
    };
    ContentValidator.isQuarantinedSync = function (contentId) {
        return Boolean((quarantineCache === null || quarantineCache === void 0 ? void 0 : quarantineCache[contentId]) && quarantineCache[contentId].status === 'pending');
    };
    ContentValidator.approveContent = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, updateQuarantine(contentId, { status: 'approved', updatedAt: nowIso(), reasons: [] })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentValidator.rejectContent = function (contentId_1) {
        return __awaiter(this, arguments, void 0, function (contentId, reasons) {
            if (reasons === void 0) { reasons = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, updateQuarantine(contentId, { status: 'rejected', updatedAt: nowIso(), reasons: reasons })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentValidator.quarantineContent = function (contentId, reasons) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, updateQuarantine(contentId, { status: 'pending', updatedAt: nowIso(), reasons: reasons })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentValidator.validateTextSync = function (_a) {
        var text = _a.text, context = _a.context;
        var sanitizedText = (0, sanitizer_1.sanitizeTextForDisplay)(text);
        var safety = SafetyChecker_1.SafetyChecker.checkTextSafetySync(sanitizedText);
        var rating = safety.rating;
        var ageAllowed = (0, contentRating_1.isRatingAllowedForAgeGroup)(context.ageGroup, rating);
        var decision = 'allow';
        var safe = safety.safe;
        var reasons = __spreadArray([], safety.reasons, true);
        if (!safe) {
            decision = 'block';
        }
        else if (!ageAllowed) {
            decision = 'filter';
        }
        var result = {
            decision: decision,
            rating: rating,
            safe: safe,
            flags: safety.flags,
            reasons: reasons,
            sanitizedText: sanitizedText,
            fallbackText: decision === 'filter' || decision === 'block' ? 'This content is not available for your age group.' : undefined,
        };
        return { sanitizedText: sanitizedText, result: result };
    };
    ContentValidator.validateText = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var sanitizedText, result_1, safety, ageAllowed, decision, result, event_1;
            var text = _b.text, context = _b.context;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, ensureInitialized()];
                    case 1:
                        _c.sent();
                        sanitizedText = (0, sanitizer_1.sanitizeText)(text);
                        if (this.isQuarantinedSync(context.contentId)) {
                            result_1 = {
                                decision: 'quarantine',
                                rating: content_1.ContentRating.R,
                                safe: false,
                                flags: [],
                                reasons: ['quarantined'],
                                sanitizedText: '',
                                fallbackText: 'This content is temporarily unavailable while we review it.',
                            };
                            return [2 /*return*/, { sanitizedText: '', result: result_1 }];
                        }
                        return [4 /*yield*/, SafetyChecker_1.SafetyChecker.checkTextSafety(sanitizedText, context)];
                    case 2:
                        safety = _c.sent();
                        ageAllowed = (0, contentRating_1.isRatingAllowedForAgeGroup)(context.ageGroup, safety.rating);
                        decision = 'allow';
                        if (!safety.safe) {
                            decision = 'quarantine';
                        }
                        else if (!ageAllowed) {
                            decision = 'filter';
                        }
                        result = {
                            decision: decision,
                            rating: safety.rating,
                            safe: safety.safe,
                            flags: safety.flags,
                            reasons: safety.reasons,
                            sanitizedText: sanitizedText,
                            fallbackText: decision === 'filter'
                                ? 'Some content was hidden because it is not appropriate for your age group.'
                                : decision === 'quarantine'
                                    ? 'This content is temporarily unavailable while we review it.'
                                    : undefined,
                        };
                        if (!(decision !== 'allow')) return [3 /*break*/, 5];
                        event_1 = {
                            id: "mod_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8)),
                            createdAt: nowIso(),
                            contentId: context.contentId,
                            contentType: context.contentType,
                            ageGroup: context.ageGroup,
                            decision: decision,
                            rating: result.rating,
                            flags: result.flags,
                            reasons: result.reasons,
                            source: context.source,
                            status: decisionToStatus(decision),
                        };
                        return [4 /*yield*/, appendModerationEvent(event_1)];
                    case 3:
                        _c.sent();
                        if (!(decision === 'quarantine')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.quarantineContent(context.contentId, result.reasons)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [2 /*return*/, { sanitizedText: sanitizedText, result: result }];
                }
            });
        });
    };
    ContentValidator.validateLessonContentSync = function (lesson, context) {
        var _this = this;
        var rating = content_1.ContentRating.G;
        var decision = 'allow';
        var titleRes = this.validateTextSync({
            text: lesson.title,
            context: __assign(__assign({}, context), { contentType: content_1.ContentType.Lesson }),
        });
        rating = (0, contentRating_1.maxRating)(rating, titleRes.result.rating);
        if (titleRes.result.decision !== 'allow') {
            return {
                content: null,
                rating: rating,
                decision: titleRes.result.decision === 'block' ? 'block' : 'filter',
            };
        }
        var bulletPoints = lesson.bulletPoints
            .map(function (bp) {
            return _this.validateTextSync({
                text: bp,
                context: __assign(__assign({}, context), { contentType: content_1.ContentType.Lesson }),
            });
        })
            .filter(function (r) { return r.result.decision === 'allow'; })
            .map(function (r) { return r.sanitizedText; });
        var paragraphs = lesson.paragraphs
            .map(function (p) {
            return _this.validateTextSync({
                text: p,
                context: __assign(__assign({}, context), { contentType: content_1.ContentType.Lesson }),
            });
        })
            .filter(function (r) { return r.result.decision === 'allow'; })
            .map(function (r) { return r.sanitizedText; });
        var sanitized = {
            title: titleRes.sanitizedText,
            icon: (0, sanitizer_1.sanitizeTextForDisplay)(lesson.icon, { maxLength: 8, preserveNewlines: false }),
            bulletPoints: bulletPoints,
            paragraphs: paragraphs,
            imageUrl: lesson.imageUrl,
            diagramData: lesson.diagramData,
        };
        if (bulletPoints.length === 0 && paragraphs.length === 0) {
            return { content: null, rating: rating, decision: 'filter' };
        }
        return { content: sanitized, rating: rating, decision: decision };
    };
    ContentValidator.validateQuizQuestions = function (questions, context) {
        return __awaiter(this, void 0, void 0, function () {
            var safeQuestions, _i, questions_1, q, baseCtx, questionRes, explanationRes, options, blockedOption, _a, _b, opt, optRes;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, ensureInitialized()];
                    case 1:
                        _c.sent();
                        safeQuestions = [];
                        _i = 0, questions_1 = questions;
                        _c.label = 2;
                    case 2:
                        if (!(_i < questions_1.length)) return [3 /*break*/, 10];
                        q = questions_1[_i];
                        baseCtx = __assign(__assign({}, context), { contentId: "".concat(context.contentId, ":").concat(q.id), contentType: content_1.ContentType.QuizQuestion });
                        if (this.isQuarantinedSync(baseCtx.contentId))
                            return [3 /*break*/, 9];
                        return [4 /*yield*/, this.validateText({ text: q.question, context: baseCtx })];
                    case 3:
                        questionRes = _c.sent();
                        if (questionRes.result.decision !== 'allow')
                            return [3 /*break*/, 9];
                        return [4 /*yield*/, this.validateText({ text: q.explanation, context: baseCtx })];
                    case 4:
                        explanationRes = _c.sent();
                        if (explanationRes.result.decision !== 'allow')
                            return [3 /*break*/, 9];
                        options = [];
                        blockedOption = false;
                        _a = 0, _b = q.options;
                        _c.label = 5;
                    case 5:
                        if (!(_a < _b.length)) return [3 /*break*/, 8];
                        opt = _b[_a];
                        return [4 /*yield*/, this.validateText({ text: opt, context: baseCtx })];
                    case 6:
                        optRes = _c.sent();
                        if (optRes.result.decision !== 'allow') {
                            blockedOption = true;
                            return [3 /*break*/, 8];
                        }
                        options.push(optRes.sanitizedText);
                        _c.label = 7;
                    case 7:
                        _a++;
                        return [3 /*break*/, 5];
                    case 8:
                        if (blockedOption)
                            return [3 /*break*/, 9];
                        safeQuestions.push(__assign(__assign({}, q), { question: questionRes.sanitizedText, explanation: explanationRes.sanitizedText, options: options }));
                        _c.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10: return [2 /*return*/, safeQuestions];
                }
            });
        });
    };
    ContentValidator.validateBooksSync = function (books, context) {
        var _this = this;
        return books
            .map(function (b) {
            var baseCtx = __assign(__assign({}, context), { contentId: "".concat(context.contentId, ":").concat(b.id), contentType: content_1.ContentType.Book });
            var titleRes = _this.validateTextSync({ text: b.title, context: baseCtx });
            var authorRes = _this.validateTextSync({ text: b.author, context: baseCtx });
            var descRes = _this.validateTextSync({ text: b.description, context: baseCtx });
            var amazonUrl = b.amazonUrl
                ? (0, sanitizer_1.sanitizeUrl)(b.amazonUrl, {
                    allowlistDomains: [
                        'amazon.com',
                        'amazon.co.uk',
                        'amazon.ca',
                        'amazon.de',
                        'amazon.fr',
                        'amazon.es',
                        'amazon.it',
                        'amazon.co.jp',
                        'amazon.in',
                        'amazon.com.au',
                    ],
                })
                : null;
            var combinedDecision = [titleRes, authorRes, descRes].some(function (r) { return r.result.decision === 'block'; })
                ? 'block'
                : [titleRes, authorRes, descRes].some(function (r) { return r.result.decision === 'filter'; })
                    ? 'filter'
                    : 'allow';
            var hasProductIdentifier = Boolean(b.asin || b.isbn);
            if (combinedDecision !== 'allow')
                return null;
            if (!amazonUrl && !hasProductIdentifier)
                return null;
            return __assign(__assign({}, b), { title: titleRes.sanitizedText, author: authorRes.sanitizedText, description: descRes.sanitizedText, amazonUrl: amazonUrl !== null && amazonUrl !== void 0 ? amazonUrl : undefined });
        })
            .filter(function (b) { return Boolean(b); });
    };
    ContentValidator.validatePathwaysSync = function (pathways, context) {
        var _this = this;
        return pathways
            .map(function (p) {
            var baseCtx = __assign(__assign({}, context), { contentId: "".concat(context.contentId, ":").concat(p.id), contentType: content_1.ContentType.Pathway });
            var titleRes = _this.validateTextSync({ text: p.title, context: baseCtx });
            var descRes = _this.validateTextSync({ text: p.description, context: baseCtx });
            var decision = titleRes.result.decision === 'block' || descRes.result.decision === 'block'
                ? 'block'
                : titleRes.result.decision === 'filter' || descRes.result.decision === 'filter'
                    ? 'filter'
                    : 'allow';
            if (decision !== 'allow')
                return null;
            return __assign(__assign({}, p), { title: titleRes.sanitizedText, description: descRes.sanitizedText });
        })
            .filter(function (p) { return Boolean(p); });
    };
    return ContentValidator;
}());
exports.ContentValidator = ContentValidator;
