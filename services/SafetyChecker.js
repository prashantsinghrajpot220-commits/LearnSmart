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
exports.SafetyChecker = void 0;
var content_1 = require("@/types/content");
var contentRating_1 = require("@/utils/contentRating");
var sanitizer_1 = require("@/utils/sanitizer");
var REMOTE_SAFETY_ENDPOINT = process.env.EXPO_PUBLIC_CONTENT_SAFETY_ENDPOINT || '';
var DEFAULT_OPTIONS = {
    useRemote: Boolean(REMOTE_SAFETY_ENDPOINT),
    timeoutMs: 7000,
    maxRetries: 2,
};
function flag(category, severity, matched) {
    return { category: category, severity: severity, matched: matched };
}
var PROFANITY = [
    /\b(fuck|shit|bitch|asshole|dick|pussy)\b/i,
    /\b(bastard|motherfucker)\b/i,
];
var SEXUAL = [
    /\b(porn|pornography|xxx)\b/i,
    /\b(nude|nudes|sex\s*video)\b/i,
];
var SEXUAL_MINORS = [/\b(child\s*porn|cp\b)\b/i];
var SELF_HARM = [/\b(suicide|kill\s*yourself|self\s*harm|cut\s*myself)\b/i];
var VIOLENCE = [/\b(murder|shoot(ing)?|stab|bomb)\b/i];
var HATE = [/\b(nazi)\b/i];
var PERSONAL_DATA = [
    /\b(phone\s*number|email\s*address|home\s*address)\b/i,
    /\b(credit\s*card|ssn|social\s*security)\b/i,
];
function localFlagsForText(text) {
    var flags = [];
    var scan = function (patterns, makeFlag) {
        for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
            var p = patterns_1[_i];
            var match = text.match(p);
            if (match)
                flags.push(__assign(__assign({}, makeFlag()), { matched: match[0] }));
        }
    };
    scan(SEXUAL_MINORS, function () { return flag('sexual_minors', 'high'); });
    scan(SEXUAL, function () { return flag('sexual', 'high'); });
    scan(SELF_HARM, function () { return flag('self_harm', 'high'); });
    scan(VIOLENCE, function () { return flag('violence', 'high'); });
    scan(HATE, function () { return flag('hate', 'high'); });
    scan(PERSONAL_DATA, function () { return flag('personal_data', 'medium'); });
    scan(PROFANITY, function () { return flag('profanity', 'medium'); });
    var urls = (0, sanitizer_1.extractUrlsFromText)(text);
    var blockedDomains = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl'];
    var _loop_1 = function (url) {
        if (!(0, sanitizer_1.isSafeUrl)(url)) {
            flags.push(flag('malicious_link', 'high', url));
            return "continue";
        }
        var host = (0, sanitizer_1.getHostnameFromUrl)(url);
        if (host && blockedDomains.some(function (d) { return host === d || host.endsWith(".".concat(d)); })) {
            flags.push(flag('malicious_link', 'high', url));
            return "continue";
        }
        if (url.toLowerCase().startsWith('http://')) {
            flags.push(flag('malicious_link', 'medium', url));
        }
    };
    for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
        var url = urls_1[_i];
        _loop_1(url);
    }
    if (urls.length >= 3) {
        flags.push(flag('spam', 'medium', "".concat(urls.length, "_links")));
    }
    return flags;
}
function localSafetyCheck(text) {
    var flags = localFlagsForText(text);
    var rating = (0, contentRating_1.deriveRatingFromFlags)(flags);
    var unsafeHigh = flags.some(function (f) { return f.severity === 'high'; });
    var safe = !unsafeHigh;
    var reasons = flags.map(function (f) { return "".concat(f.category, ":").concat(f.severity); });
    return {
        safe: safe,
        rating: rating,
        flags: flags,
        reasons: reasons,
        provider: 'local',
    };
}
function fetchWithRetry(url, init, timeoutMs, maxRetries) {
    return __awaiter(this, void 0, void 0, function () {
        var lastError, _loop_2, attempt, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_2 = function (attempt) {
                        var controller_1, timeout, res, err_1, delay_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 4]);
                                    controller_1 = new AbortController();
                                    timeout = setTimeout(function () { return controller_1.abort(); }, timeoutMs);
                                    return [4 /*yield*/, fetch(url, __assign(__assign({}, init), { signal: controller_1.signal }))];
                                case 1:
                                    res = _b.sent();
                                    clearTimeout(timeout);
                                    return [2 /*return*/, { value: res }];
                                case 2:
                                    err_1 = _b.sent();
                                    lastError = err_1;
                                    delay_1 = 300 * Math.pow(2, attempt);
                                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, delay_1); })];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt <= maxRetries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_2(attempt)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    attempt += 1;
                    return [3 /*break*/, 1];
                case 4: throw lastError instanceof Error ? lastError : new Error('Remote safety check failed');
            }
        });
    });
}
function remoteSafetyCheck(text, context, options) {
    return __awaiter(this, void 0, void 0, function () {
        var res, errText, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!REMOTE_SAFETY_ENDPOINT) {
                        return [2 /*return*/, { safe: true, rating: content_1.ContentRating.G, flags: [], reasons: [], provider: 'none' }];
                    }
                    return [4 /*yield*/, fetchWithRetry(REMOTE_SAFETY_ENDPOINT, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: text, context: context }),
                        }, options.timeoutMs, options.maxRetries)];
                case 1:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text()];
                case 2:
                    errText = _a.sent();
                    throw new Error("Remote safety check error: ".concat(res.status, " ").concat(errText));
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    data = (_a.sent());
                    return [2 /*return*/, {
                            safe: Boolean(data.safe),
                            rating: data.rating || content_1.ContentRating.G,
                            flags: Array.isArray(data.flags) ? data.flags : [],
                            reasons: Array.isArray(data.reasons) ? data.reasons : [],
                            provider: 'remote',
                        }];
            }
        });
    });
}
var SafetyChecker = /** @class */ (function () {
    function SafetyChecker() {
    }
    SafetyChecker.checkTextSafetySync = function (text) {
        return localSafetyCheck(text);
    };
    SafetyChecker.checkTextSafety = function (text_1, context_1) {
        return __awaiter(this, arguments, void 0, function (text, context, options) {
            var merged, local, remote, flags, rating, safe, err_2;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        merged = __assign(__assign({}, DEFAULT_OPTIONS), options);
                        local = localSafetyCheck(text);
                        if (!merged.useRemote) {
                            return [2 /*return*/, local];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, remoteSafetyCheck(text, context, merged)];
                    case 2:
                        remote = _a.sent();
                        flags = __spreadArray(__spreadArray([], local.flags, true), remote.flags, true);
                        rating = (0, contentRating_1.deriveRatingFromFlags)(flags);
                        safe = local.safe && remote.safe && !flags.some(function (f) { return f.category === 'malicious_link' && f.severity === 'high'; });
                        return [2 /*return*/, {
                                safe: safe,
                                rating: rating,
                                flags: flags,
                                reasons: __spreadArray([], new Set(__spreadArray(__spreadArray([], local.reasons, true), remote.reasons, true)), true),
                                provider: 'remote',
                            }];
                    case 3:
                        err_2 = _a.sent();
                        // Warning handled
                        return [2 /*return*/, local];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SafetyChecker;
}());
exports.SafetyChecker = SafetyChecker;
