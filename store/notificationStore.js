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
exports.useNotificationStore = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var zustand_1 = require("zustand");
var STORAGE_KEY = '@learnsmart/in_app_notifications';
var MAX_NOTIFICATIONS = 50;
function generateId(prefix) {
    return "".concat(prefix, "_").concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8));
}
exports.useNotificationStore = (0, zustand_1.create)(function (set, get) { return ({
    notifications: [],
    activeNotificationId: null,
    loadNotifications: function () { return __awaiter(void 0, void 0, void 0, function () {
        var raw, notifications, activeNotificationId, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEY)];
                case 1:
                    raw = _c.sent();
                    notifications = raw ? JSON.parse(raw) : [];
                    activeNotificationId = (_b = (_a = notifications.find(function (n) { return !n.read; })) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
                    set({ notifications: notifications, activeNotificationId: activeNotificationId });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _c.sent();
                    // Debug statement removed
                    set({ notifications: [], activeNotificationId: null });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    pushNotification: function (notification) { return __awaiter(void 0, void 0, void 0, function () {
        var current, nextNotification, next, activeNotificationId, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    current = get().notifications;
                    nextNotification = {
                        id: (_a = notification.id) !== null && _a !== void 0 ? _a : generateId('notif'),
                        type: notification.type,
                        title: notification.title,
                        message: notification.message,
                        createdAt: new Date().toISOString(),
                        read: false,
                        data: notification.data,
                    };
                    next = __spreadArray([nextNotification], current, true).slice(0, MAX_NOTIFICATIONS);
                    activeNotificationId = (_b = get().activeNotificationId) !== null && _b !== void 0 ? _b : nextNotification.id;
                    set({ notifications: next, activeNotificationId: activeNotificationId });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, JSON.stringify(next))];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _c.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    dismissActive: function () { return __awaiter(void 0, void 0, void 0, function () {
        var activeNotificationId, notifications, nextActive, error_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    activeNotificationId = get().activeNotificationId;
                    if (!activeNotificationId)
                        return [2 /*return*/];
                    notifications = get().notifications.map(function (n) {
                        return n.id === activeNotificationId ? __assign(__assign({}, n), { read: true }) : n;
                    });
                    nextActive = (_b = (_a = notifications.find(function (n) { return !n.read; })) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
                    set({ notifications: notifications, activeNotificationId: nextActive });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, JSON.stringify(notifications))];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _c.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    markAsRead: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var notifications, nextActive, error_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    notifications = get().notifications.map(function (n) { return (n.id === id ? __assign(__assign({}, n), { read: true }) : n); });
                    nextActive = (get().activeNotificationId === id ? (_b = (_a = notifications.find(function (n) { return !n.read; })) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null : get().activeNotificationId);
                    set({ notifications: notifications, activeNotificationId: nextActive });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, JSON.stringify(notifications))];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _c.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getUnreadCount: function () {
        return get().notifications.filter(function (n) { return !n.read; }).length;
    },
    markAllAsRead: function () { return __awaiter(void 0, void 0, void 0, function () {
        var notifications, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notifications = get().notifications.map(function (n) { return (__assign(__assign({}, n), { read: true })); });
                    set({ notifications: notifications, activeNotificationId: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, JSON.stringify(notifications))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    clearAll: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ notifications: [], activeNotificationId: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, JSON.stringify([]))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getNotificationsByType: function (type) {
        return get().notifications.filter(function (n) { return n.type === type; });
    },
    removeNotification: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var notifications, nextActive, error_7;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    notifications = get().notifications.filter(function (n) { return n.id !== id; });
                    nextActive = get().activeNotificationId === id
                        ? (_b = (_a = notifications.find(function (n) { return !n.read; })) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null
                        : get().activeNotificationId;
                    set({ notifications: notifications, activeNotificationId: nextActive });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, JSON.stringify(notifications))];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _c.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
}); });
