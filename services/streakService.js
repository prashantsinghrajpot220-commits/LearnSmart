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
exports.useStreakService = exports.streakService = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var STORAGE_KEY = '@learnsmart_streak';
var StreakService = /** @class */ (function () {
    function StreakService() {
        this.data = {
            lastOpenDate: null,
            currentStreak: 0,
            longestStreak: 0,
        };
    }
    StreakService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stored, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEY)];
                    case 1:
                        stored = _a.sent();
                        if (stored) {
                            this.data = JSON.parse(stored);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StreakService.prototype.checkAndUpdateStreak = function () {
        return __awaiter(this, void 0, void 0, function () {
            var today, lastOpen, yesterday, lastOpenDate, todayDate, daysDiff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = this.getTodayDate();
                        lastOpen = this.data.lastOpenDate;
                        if (!!lastOpen) return [3 /*break*/, 2];
                        this.data.currentStreak = 1;
                        this.data.lastOpenDate = today;
                        return [4 /*yield*/, this.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { streak: 1, streakChanged: true, streakReset: false, isNewDay: true }];
                    case 2:
                        // Already opened today
                        if (lastOpen === today) {
                            return [2 /*return*/, { streak: this.data.currentStreak, streakChanged: false, streakReset: false, isNewDay: false }];
                        }
                        yesterday = this.getYesterdayDate();
                        lastOpenDate = new Date(lastOpen);
                        todayDate = new Date(today);
                        daysDiff = Math.floor((todayDate.getTime() - lastOpenDate.getTime()) / (1000 * 60 * 60 * 24));
                        if (!(daysDiff === 1)) return [3 /*break*/, 4];
                        this.data.currentStreak += 1;
                        this.data.lastOpenDate = today;
                        if (this.data.currentStreak > this.data.longestStreak) {
                            this.data.longestStreak = this.data.currentStreak;
                        }
                        return [4 /*yield*/, this.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { streak: this.data.currentStreak, streakChanged: true, streakReset: false, isNewDay: true }];
                    case 4:
                        // Streak broken (missed more than 1 day)
                        // Reset to 1 for new streak
                        this.data.currentStreak = 1;
                        this.data.lastOpenDate = today;
                        return [4 /*yield*/, this.save()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, { streak: 1, streakChanged: true, streakReset: true, isNewDay: true }];
                }
            });
        });
    };
    StreakService.prototype.getStreak = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.data.currentStreak];
            });
        });
    };
    StreakService.prototype.getLongestStreak = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.data.longestStreak];
            });
        });
    };
    StreakService.prototype.resetStreak = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.data.currentStreak = 0;
                        this.data.lastOpenDate = null;
                        return [4 /*yield*/, this.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StreakService.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, JSON.stringify(this.data))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StreakService.prototype.getTodayDate = function () {
        var now = new Date();
        return "".concat(now.getFullYear(), "-").concat(String(now.getMonth() + 1).padStart(2, '0'), "-").concat(String(now.getDate()).padStart(2, '0'));
    };
    StreakService.prototype.getYesterdayDate = function () {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return "".concat(yesterday.getFullYear(), "-").concat(String(yesterday.getMonth() + 1).padStart(2, '0'), "-").concat(String(yesterday.getDate()).padStart(2, '0'));
    };
    return StreakService;
}());
exports.streakService = new StreakService();
// React hook-friendly version
var useStreakService = function () {
    return {
        checkAndUpdateStreak: function () { return exports.streakService.checkAndUpdateStreak(); },
        getStreak: function () { return exports.streakService.getStreak(); },
        getLongestStreak: function () { return exports.streakService.getLongestStreak(); },
        resetStreak: function () { return exports.streakService.resetStreak(); },
        initialize: function () { return exports.streakService.initialize(); },
    };
};
exports.useStreakService = useStreakService;
