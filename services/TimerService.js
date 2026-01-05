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
exports.timerService = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var SESSIONS_STORAGE_KEY = '@learnsmart_pomodoro_sessions';
var SETTINGS_STORAGE_KEY = '@learnsmart_pomodoro_settings';
var ACTIVE_SESSION_KEY = '@learnsmart_active_pomodoro';
var DEFAULT_SETTINGS = {
    studyDuration: 25,
    breakDuration: 5,
    soundEnabled: true,
    hapticEnabled: true,
    autoStartBreak: false,
    autoStartStudy: false,
};
var TimerService = /** @class */ (function () {
    function TimerService() {
        this.timerInterval = null;
        this.listeners = [];
        this.activeState = null;
    }
    // Settings management
    TimerService.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(SETTINGS_STORAGE_KEY)];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            return [2 /*return*/, __assign(__assign({}, DEFAULT_SETTINGS), JSON.parse(data))];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, DEFAULT_SETTINGS];
                }
            });
        });
    };
    TimerService.prototype.saveSettings = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var current, updated, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        current = _a.sent();
                        updated = __assign(__assign({}, current), settings);
                        return [4 /*yield*/, async_storage_1.default.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Session management
    TimerService.prototype.startStudySession = function (studyDuration, breakDuration, subject, chapter) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = this.generateSessionId();
                        session = {
                            id: sessionId,
                            studyDuration: studyDuration,
                            breakDuration: breakDuration,
                            actualStudyTime: 0,
                            focusScore: 0,
                            phase: 'study',
                            subject: subject,
                            chapter: chapter,
                            treeSurvived: false,
                            startTime: new Date().toISOString(),
                        };
                        // Save session immediately
                        return [4 /*yield*/, this.saveSession(session)];
                    case 1:
                        // Save session immediately
                        _a.sent();
                        // Set up active timer state
                        this.activeState = {
                            remainingTime: studyDuration * 60,
                            phase: 'study',
                            sessionId: sessionId,
                            totalDuration: studyDuration * 60,
                            lastTick: Date.now(),
                            subject: subject,
                            chapter: chapter,
                        };
                        // Start the timer
                        this.startTimer();
                        // Persist active state
                        return [4 /*yield*/, this.saveActiveState(this.activeState)];
                    case 2:
                        // Persist active state
                        _a.sent();
                        return [2 /*return*/, sessionId];
                }
            });
        });
    };
    TimerService.prototype.pauseSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeState)
                            return [2 /*return*/];
                        this.activeState.phase = 'paused';
                        return [4 /*yield*/, this.saveActiveState(this.activeState)];
                    case 1:
                        _a.sent();
                        this.notifyListeners();
                        return [4 /*yield*/, this.getSession(this.activeState.sessionId)];
                    case 2:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 4];
                        session.phase = 'paused';
                        return [4 /*yield*/, this.saveSession(session)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TimerService.prototype.resumeSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeState)
                            return [2 /*return*/];
                        this.activeState.phase = this.activeState.remainingTime === this.activeState.totalDuration ? 'study' : 'break';
                        this.activeState.lastTick = Date.now();
                        return [4 /*yield*/, this.saveActiveState(this.activeState)];
                    case 1:
                        _a.sent();
                        this.startTimer();
                        this.notifyListeners();
                        return [4 /*yield*/, this.getSession(this.activeState.sessionId)];
                    case 2:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 4];
                        session.phase = this.activeState.phase;
                        return [4 /*yield*/, this.saveSession(session)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TimerService.prototype.resetSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stopTimer();
                        this.activeState = null;
                        return [4 /*yield*/, async_storage_1.default.removeItem(ACTIVE_SESSION_KEY)];
                    case 1:
                        _a.sent();
                        this.notifyListeners();
                        return [2 /*return*/];
                }
            });
        });
    };
    TimerService.prototype.startBreakSession = function (breakDuration) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeState)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        settings = _a.sent();
                        return [4 /*yield*/, this.getSession(this.activeState.sessionId)];
                    case 2:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 4];
                        // Save the completed study session
                        session.actualStudyTime = settings.studyDuration * 60 - this.activeState.remainingTime;
                        session.phase = 'break';
                        return [4 /*yield*/, this.saveSession(session)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.activeState.phase = 'break';
                        this.activeState.remainingTime = breakDuration * 60;
                        this.activeState.totalDuration = breakDuration * 60;
                        this.activeState.lastTick = Date.now();
                        return [4 /*yield*/, this.saveActiveState(this.activeState)];
                    case 5:
                        _a.sent();
                        this.startTimer();
                        this.notifyListeners();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Timer management
    TimerService.prototype.startTimer = function () {
        var _this = this;
        this.stopTimer();
        this.timerInterval = setInterval(function () {
            if (!_this.activeState)
                return;
            var now = Date.now();
            var elapsed = Math.floor((now - _this.activeState.lastTick) / 1000);
            if (elapsed > 0) {
                _this.activeState.remainingTime = Math.max(0, _this.activeState.remainingTime - elapsed);
                _this.activeState.lastTick = now;
                if (_this.activeState.remainingTime <= 0) {
                    _this.handleTimerComplete();
                }
                else {
                    _this.saveActiveState(_this.activeState);
                    _this.notifyListeners();
                }
            }
        }, 1000);
    };
    TimerService.prototype.stopTimer = function () {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    };
    TimerService.prototype.handleTimerComplete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var phase, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeState)
                            return [2 /*return*/];
                        phase = this.activeState.phase;
                        // Stop the timer
                        this.stopTimer();
                        return [4 /*yield*/, this.getSession(this.activeState.sessionId)];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 3];
                        if (phase === 'study') {
                            session.actualStudyTime = session.studyDuration * 60;
                            session.endTime = new Date().toISOString();
                            session.phase = 'break';
                        }
                        else {
                            session.endTime = new Date().toISOString();
                            session.phase = 'study';
                        }
                        return [4 /*yield*/, this.saveSession(session)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        // Clear active state
                        this.activeState = null;
                        return [4 /*yield*/, async_storage_1.default.removeItem(ACTIVE_SESSION_KEY)];
                    case 4:
                        _a.sent();
                        this.notifyListeners();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Session storage
    TimerService.prototype.saveSession = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var sessions, index, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getAllSessions()];
                    case 1:
                        sessions = _a.sent();
                        index = sessions.findIndex(function (s) { return s.id === session.id; });
                        if (index >= 0) {
                            sessions[index] = session;
                        }
                        else {
                            sessions.push(session);
                        }
                        return [4 /*yield*/, async_storage_1.default.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TimerService.prototype.getSession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var sessions, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getAllSessions()];
                    case 1:
                        sessions = _a.sent();
                        return [2 /*return*/, sessions.find(function (s) { return s.id === sessionId; }) || null];
                    case 2:
                        error_4 = _a.sent();
                        // Error handled silently
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TimerService.prototype.getAllSessions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(SESSIONS_STORAGE_KEY)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data ? JSON.parse(data) : []];
                    case 2:
                        error_5 = _a.sent();
                        // Error handled silently
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TimerService.prototype.getSessionHistory = function () {
        return __awaiter(this, arguments, void 0, function (days) {
            var sessions, cutoffDate_1, error_6;
            if (days === void 0) { days = 7; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getAllSessions()];
                    case 1:
                        sessions = _a.sent();
                        cutoffDate_1 = new Date();
                        cutoffDate_1.setDate(cutoffDate_1.getDate() - days);
                        cutoffDate_1.setHours(0, 0, 0, 0);
                        return [2 /*return*/, sessions.filter(function (session) {
                                var sessionDate = new Date(session.startTime);
                                return sessionDate >= cutoffDate_1;
                            })];
                    case 2:
                        error_6 = _a.sent();
                        // Error handled silently
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TimerService.prototype.updateFocusScore = function (sessionId, score) {
        return __awaiter(this, void 0, void 0, function () {
            var session, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getSession(sessionId)];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 3];
                        session.focusScore = score;
                        return [4 /*yield*/, this.saveSession(session)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TimerService.prototype.markTreeSurvived = function (sessionId, survived) {
        return __awaiter(this, void 0, void 0, function () {
            var session, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getSession(sessionId)];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 3];
                        session.treeSurvived = survived;
                        return [4 /*yield*/, this.saveSession(session)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_8 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Active state management
    TimerService.prototype.saveActiveState = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.setItem(ACTIVE_SESSION_KEY, JSON.stringify(state))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TimerService.prototype.loadActiveState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, state, elapsed, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, async_storage_1.default.getItem(ACTIVE_SESSION_KEY)];
                    case 1:
                        data = _a.sent();
                        if (!data) return [3 /*break*/, 4];
                        state = JSON.parse(data);
                        elapsed = Math.floor((Date.now() - state.lastTick) / 1000);
                        if (!(elapsed > 0 && state.remainingTime > 0)) return [3 /*break*/, 3];
                        state.remainingTime = Math.max(0, state.remainingTime - elapsed);
                        state.lastTick = Date.now();
                        if (!(state.remainingTime <= 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.handleTimerComplete()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 3:
                        this.activeState = state;
                        this.startTimer();
                        return [2 /*return*/, state];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_10 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    // Listener management
    TimerService.prototype.subscribe = function (listener) {
        var _this = this;
        this.listeners.push(listener);
        // Immediately notify with current state
        listener(this.activeState || null);
        // Return unsubscribe function
        return function () {
            _this.listeners = _this.listeners.filter(function (l) { return l !== listener; });
        };
    };
    TimerService.prototype.notifyListeners = function () {
        var _this = this;
        this.listeners.forEach(function (listener) {
            listener(_this.activeState || null);
        });
    };
    // Stats
    TimerService.prototype.getStats = function () {
        return __awaiter(this, arguments, void 0, function (days) {
            var sessions, completedSessions, error_11;
            if (days === void 0) { days = 7; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getSessionHistory(days)];
                    case 1:
                        sessions = _a.sent();
                        completedSessions = sessions.filter(function (s) { return s.endTime; });
                        return [2 /*return*/, {
                                totalSessions: completedSessions.length,
                                totalStudyTime: Math.floor(completedSessions.reduce(function (sum, s) { return sum + (s.actualStudyTime / 60); }, 0)),
                                averageFocusScore: completedSessions.length > 0
                                    ? Math.round(completedSessions.reduce(function (sum, s) { return sum + s.focusScore; }, 0) / completedSessions.length)
                                    : 0,
                                treesGrown: completedSessions.filter(function (s) { return s.treeSurvived; }).length,
                            }];
                    case 2:
                        error_11 = _a.sent();
                        // Error handled silently
                        return [2 /*return*/, {
                                totalSessions: 0,
                                totalStudyTime: 0,
                                averageFocusScore: 0,
                                treesGrown: 0,
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Cleanup
    TimerService.prototype.destroy = function () {
        this.stopTimer();
        this.listeners = [];
        this.activeState = null;
    };
    TimerService.prototype.generateSessionId = function () {
        return "session_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
    };
    return TimerService;
}());
exports.timerService = new TimerService();
