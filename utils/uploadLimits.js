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
exports.getRemainingImages = exports.canUploadImage = exports.incrementImageUploadCount = exports.getUploadLimits = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var MAX_DAILY_IMAGES = 6;
var RESET_HOUR_UTC = 2;
var LIMIT_STORAGE_KEY = '@smarty_upload_limits';
var getUploadLimits = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, now, todayReset, limits, newLimits, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, async_storage_1.default.getItem(LIMIT_STORAGE_KEY)];
            case 1:
                data = _a.sent();
                now = Date.now();
                todayReset = getTodayResetTimestamp();
                if (!data) {
                    return [2 /*return*/, { imageCount: 0, lastResetTimestamp: todayReset }];
                }
                limits = JSON.parse(data);
                if (!(now >= todayReset && limits.lastResetTimestamp < todayReset)) return [3 /*break*/, 3];
                newLimits = { imageCount: 0, lastResetTimestamp: todayReset };
                return [4 /*yield*/, saveUploadLimits(newLimits)];
            case 2:
                _a.sent();
                return [2 /*return*/, newLimits];
            case 3: return [2 /*return*/, limits];
            case 4:
                error_1 = _a.sent();
                console.error('Error getting upload limits:', error_1);
                return [2 /*return*/, { imageCount: 0, lastResetTimestamp: Date.now() }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getUploadLimits = getUploadLimits;
var incrementImageUploadCount = function () { return __awaiter(void 0, void 0, void 0, function () {
    var limits;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getUploadLimits)()];
            case 1:
                limits = _a.sent();
                limits.imageCount += 1;
                return [4 /*yield*/, saveUploadLimits(limits)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.incrementImageUploadCount = incrementImageUploadCount;
var canUploadImage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var limits;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getUploadLimits)()];
            case 1:
                limits = _a.sent();
                return [2 /*return*/, limits.imageCount < MAX_DAILY_IMAGES];
        }
    });
}); };
exports.canUploadImage = canUploadImage;
var getRemainingImages = function () { return __awaiter(void 0, void 0, void 0, function () {
    var limits;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getUploadLimits)()];
            case 1:
                limits = _a.sent();
                return [2 /*return*/, Math.max(0, MAX_DAILY_IMAGES - limits.imageCount)];
        }
    });
}); };
exports.getRemainingImages = getRemainingImages;
var saveUploadLimits = function (limits) { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, async_storage_1.default.setItem(LIMIT_STORAGE_KEY, JSON.stringify(limits))];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error saving upload limits:', error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getTodayResetTimestamp = function () {
    var now = new Date();
    var reset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), RESET_HOUR_UTC, 0, 0, 0));
    // If current time is before today's reset, the relevant reset was yesterday
    if (now.getTime() < reset.getTime()) {
        reset.setUTCDate(reset.getUTCDate() - 1);
    }
    return reset.getTime();
};
