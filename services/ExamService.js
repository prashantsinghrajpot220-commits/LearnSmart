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
exports.examService = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var majorExams_1 = require("@/data/majorExams");
var EXAMS_STORAGE_KEY = '@learnsmart_exams';
var REMINDERS_STORAGE_KEY = '@learnsmart_exam_reminders';
var ExamService = /** @class */ (function () {
    function ExamService() {
        this.exams = [];
        this.initialized = false;
    }
    ExamService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.initialized)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, async_storage_1.default.getItem(EXAMS_STORAGE_KEY)];
                    case 2:
                        data = _a.sent();
                        if (!data) return [3 /*break*/, 3];
                        this.exams = JSON.parse(data);
                        return [3 /*break*/, 5];
                    case 3:
                        // Initialize with major exams if first time
                        this.exams = __spreadArray([], majorExams_1.majorExams, true);
                        return [4 /*yield*/, this.saveExams()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.initialized = true;
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        // Failed to initialize exam service - use default data
                        this.exams = __spreadArray([], majorExams_1.majorExams, true);
                        this.initialized = true;
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Exam CRUD operations
    ExamService.prototype.getAllExams = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.exams];
                }
            });
        });
    };
    ExamService.prototype.getUpcomingExams = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, (0, majorExams_1.getUpcomingExams)(this.exams, limit)];
                }
            });
        });
    };
    ExamService.prototype.getExamById = function (examId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.exams.find(function (exam) { return exam.id === examId; }) || null];
                }
            });
        });
    };
    ExamService.prototype.addExam = function (exam) {
        return __awaiter(this, void 0, void 0, function () {
            var newExam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        newExam = __assign(__assign({}, exam), { id: "exam_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), completed: false, color: (0, majorExams_1.getUrgencyColor)((0, majorExams_1.getDaysRemaining)(exam.date)) });
                        this.exams.push(newExam);
                        return [4 /*yield*/, this.saveExams()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, newExam];
                }
            });
        });
    };
    ExamService.prototype.updateExam = function (examId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        index = this.exams.findIndex(function (exam) { return exam.id === examId; });
                        if (index === -1)
                            return [2 /*return*/, null];
                        // Update urgency color if date changed
                        if (updates.date) {
                            updates.color = (0, majorExams_1.getUrgencyColor)((0, majorExams_1.getDaysRemaining)(updates.date));
                        }
                        this.exams[index] = __assign(__assign({}, this.exams[index]), updates);
                        return [4 /*yield*/, this.saveExams()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.exams[index]];
                }
            });
        });
    };
    ExamService.prototype.deleteExam = function (examId) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        index = this.exams.findIndex(function (exam) { return exam.id === examId; });
                        if (index === -1)
                            return [2 /*return*/, false];
                        // Don't allow deleting pre-populated exams, only mark as completed
                        if (this.exams[index].isPrePopulated) {
                            return [2 /*return*/, false];
                        }
                        this.exams.splice(index, 1);
                        return [4 /*yield*/, this.saveExams()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ExamService.prototype.markExamCompleted = function (examId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.updateExam(examId, { completed: true })];
            });
        });
    };
    ExamService.prototype.refreshExamUrgency = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        this.exams = this.exams.map(function (exam) {
                            if (!exam.completed) {
                                return __assign(__assign({}, exam), { color: (0, majorExams_1.getUrgencyColor)((0, majorExams_1.getDaysRemaining)(exam.date)) });
                            }
                            return exam;
                        });
                        return [4 /*yield*/, this.saveExams()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Exam reminders
    ExamService.prototype.setReminder = function (examId, daysBefore) {
        return __awaiter(this, void 0, void 0, function () {
            var reminders, existingIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getReminders()];
                    case 1:
                        reminders = _a.sent();
                        existingIndex = reminders.findIndex(function (r) { return r.examId === examId && r.daysBefore === daysBefore; });
                        if (existingIndex >= 0) {
                            reminders[existingIndex].reminderSent = false;
                        }
                        else {
                            reminders.push({
                                examId: examId,
                                daysBefore: daysBefore,
                                reminderSent: false,
                            });
                        }
                        return [4 /*yield*/, async_storage_1.default.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ExamService.prototype.removeReminder = function (examId, daysBefore) {
        return __awaiter(this, void 0, void 0, function () {
            var reminders, filtered;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getReminders()];
                    case 1:
                        reminders = _a.sent();
                        filtered = reminders.filter(function (r) { return !(r.examId === examId && r.daysBefore === daysBefore); });
                        return [4 /*yield*/, async_storage_1.default.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(filtered))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ExamService.prototype.getReminders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(REMINDERS_STORAGE_KEY)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data ? JSON.parse(data) : []];
                    case 2:
                        error_2 = _a.sent();
                        // Failed to get reminders - return empty array
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExamService.prototype.getExamReminders = function (examId) {
        return __awaiter(this, void 0, void 0, function () {
            var reminders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getReminders()];
                    case 1:
                        reminders = _a.sent();
                        return [2 /*return*/, reminders.filter(function (r) { return r.examId === examId; })];
                }
            });
        });
    };
    // Search and filter
    ExamService.prototype.searchExams = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        lowerQuery = query.toLowerCase();
                        return [2 /*return*/, this.exams.filter(function (exam) {
                                return exam.name.toLowerCase().includes(lowerQuery) ||
                                    exam.subject.toLowerCase().includes(lowerQuery);
                            })];
                }
            });
        });
    };
    ExamService.prototype.getExamsBySubject = function (subject) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.exams.filter(function (exam) { return exam.subject.toLowerCase().includes(subject.toLowerCase()); })];
                }
            });
        });
    };
    ExamService.prototype.getExamsByUrgency = function (color) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.exams.filter(function (exam) { return exam.color === color && !exam.completed; })];
                }
            });
        });
    };
    // Stats
    ExamService.prototype.getExamStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, weekFromNow, monthFromNow, upcomingExams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        now = new Date();
                        weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                        upcomingExams = this.exams.filter(function (exam) { return !exam.completed; });
                        return [2 /*return*/, {
                                total: upcomingExams.length,
                                upcoming: upcomingExams.length,
                                thisWeek: upcomingExams.filter(function (exam) {
                                    var examDate = new Date(exam.date);
                                    return examDate <= weekFromNow;
                                }).length,
                                thisMonth: upcomingExams.filter(function (exam) {
                                    var examDate = new Date(exam.date);
                                    return examDate <= monthFromNow;
                                }).length,
                            }];
                }
            });
        });
    };
    // Helper methods
    ExamService.prototype.saveExams = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.setItem(EXAMS_STORAGE_KEY, JSON.stringify(this.exams))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExamService.prototype.resetToDefault = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.exams = __spreadArray([], majorExams_1.majorExams, true);
                        return [4 /*yield*/, this.saveExams()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ExamService.prototype.getDaysRemaining = function (examId) {
        return __awaiter(this, void 0, void 0, function () {
            var exam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getExamById(examId)];
                    case 1:
                        exam = _a.sent();
                        return [2 /*return*/, exam ? (0, majorExams_1.getDaysRemaining)(exam.date) : null];
                }
            });
        });
    };
    // Utility methods for formatting
    ExamService.prototype.getUrgencyColor = function (daysRemaining) {
        return (0, majorExams_1.getUrgencyColor)(daysRemaining);
    };
    ExamService.prototype.formatDaysRemaining = function (days) {
        if (days < 0)
            return 'Exam passed';
        if (days === 0)
            return 'Today!';
        if (days === 1)
            return 'Tomorrow';
        if (days < 7)
            return "".concat(days, " days");
        var weeks = Math.floor(days / 7);
        var remainingDays = days % 7;
        if (remainingDays === 0)
            return "".concat(weeks, " week").concat(weeks > 1 ? 's' : '');
        return "".concat(weeks, " week").concat(weeks > 1 ? 's' : '', " ").concat(remainingDays, " days");
    };
    return ExamService;
}());
exports.examService = new ExamService();
