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
exports.studyGroupService = exports.StudyGroupService = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
var ContentValidator_1 = require("@/services/ContentValidator");
var NotificationService_1 = require("@/services/NotificationService");
var content_1 = require("@/types/content");
var userStore_1 = require("@/store/userStore");
var STORAGE_KEYS = {
    GROUPS: '@learnsmart/study_groups',
    CHAT: function (groupId) { return "@learnsmart/study_group_chat:".concat(groupId); },
    NOTES: function (groupId) { return "@learnsmart/study_group_notes:".concat(groupId); },
    SCHEDULE: function (groupId) { return "@learnsmart/study_group_schedule:".concat(groupId); },
};
var MAX_CHAT_MESSAGES = 250;
var MAX_NOTES = 250;
var MAX_SCHEDULE = 100;
function randomId(prefix) {
    return "".concat(prefix, "_").concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 9));
}
function validateUserText(text, contentId) {
    var _a, _b;
    var ageGroup = ((_a = userStore_1.useUserStore.getState().ageGroup) !== null && _a !== void 0 ? _a : 'under12');
    var _c = ContentValidator_1.ContentValidator.validateTextSync({
        text: text,
        context: {
            contentId: contentId,
            contentType: content_1.ContentType.UserGeneratedText,
            ageGroup: ageGroup,
            source: 'StudyGroupService',
        },
    }), sanitizedText = _c.sanitizedText, result = _c.result;
    if (result.decision !== 'allow') {
        throw new Error((_b = result.fallbackText) !== null && _b !== void 0 ? _b : 'This content is not allowed.');
    }
    return sanitizedText;
}
var StudyGroupService = /** @class */ (function () {
    function StudyGroupService() {
        this.groupsCache = null;
        this.chatCache = new Map();
        this.notesCache = new Map();
        this.scheduleCache = new Map();
        this.groupListeners = new Set();
        this.chatListeners = new Map();
        this.notesListeners = new Map();
        this.scheduleListeners = new Map();
    }
    StudyGroupService.getInstance = function () {
        if (!StudyGroupService.instance) {
            StudyGroupService.instance = new StudyGroupService();
        }
        return StudyGroupService.instance;
    };
    StudyGroupService.prototype.ensureGroupsLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var raw, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.groupsCache)
                            return [2 /*return*/, this.groupsCache];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEYS.GROUPS)];
                    case 2:
                        raw = _a.sent();
                        this.groupsCache = raw ? JSON.parse(raw) : [];
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // Error handled silently
                        this.groupsCache = [];
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, this.groupsCache];
                }
            });
        });
    };
    StudyGroupService.prototype.persistGroups = function (next) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.groupsCache = next;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(next))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        this.groupListeners.forEach(function (cb) { return cb(next); });
                        return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.subscribeToGroups = function (listener) {
        var _this = this;
        this.groupListeners.add(listener);
        void this.ensureGroupsLoaded().then(function (groups) { return listener(groups); });
        return function () {
            _this.groupListeners.delete(listener);
        };
    };
    StudyGroupService.prototype.getMyGroups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userId, groups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = userStore_1.useUserStore.getState().userId;
                        return [4 /*yield*/, this.ensureGroupsLoaded()];
                    case 1:
                        groups = _a.sent();
                        return [2 /*return*/, groups
                                .filter(function (g) { return g.members.includes(userId); })
                                .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
                }
            });
        });
    };
    StudyGroupService.prototype.getGroup = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var groups;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ensureGroupsLoaded()];
                    case 1:
                        groups = _b.sent();
                        return [2 /*return*/, (_a = groups.find(function (g) { return g.id === groupId; })) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    StudyGroupService.prototype.createGroup = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, userName, selectedAvatar, addStudyGroupMembership, id, createdAt, name, description, icon, group, groups;
            var _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), userId = _a.userId, userName = _a.userName, selectedAvatar = _a.selectedAvatar, addStudyGroupMembership = _a.addStudyGroupMembership;
                        if (!userId)
                            throw new Error('User not initialized');
                        id = randomId('group');
                        createdAt = new Date().toISOString();
                        name = validateUserText(params.name.trim(), "study_group:".concat(id, ":name"));
                        description = validateUserText(params.description.trim(), "study_group:".concat(id, ":description"));
                        icon = ((_c = params.icon) === null || _c === void 0 ? void 0 : _c.trim()) || '👥';
                        group = {
                            id: id,
                            name: name,
                            description: description,
                            icon: icon,
                            createdBy: userId,
                            members: [userId],
                            adminIds: [userId],
                            createdAt: createdAt,
                            isPrivate: params.isPrivate,
                            memberProfiles: (_b = {},
                                _b[userId] = { userName: userName || 'You', avatar: selectedAvatar || 'Robot' },
                                _b),
                            inviteCodes: [],
                        };
                        return [4 /*yield*/, this.ensureGroupsLoaded()];
                    case 1:
                        groups = _d.sent();
                        return [4 /*yield*/, this.persistGroups(__spreadArray([group], groups, true))];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, addStudyGroupMembership({ groupId: id, role: 'admin', joinedAt: createdAt })];
                    case 3:
                        _d.sent();
                        return [2 /*return*/, group];
                }
            });
        });
    };
    StudyGroupService.prototype.updateGroup = function (groupId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, groups, idx, group, next, newGroups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = userStore_1.useUserStore.getState().userId;
                        return [4 /*yield*/, this.ensureGroupsLoaded()];
                    case 1:
                        groups = _a.sent();
                        idx = groups.findIndex(function (g) { return g.id === groupId; });
                        if (idx === -1)
                            throw new Error('Group not found');
                        group = groups[idx];
                        if (!group.adminIds.includes(userId))
                            throw new Error('Admin permission required');
                        next = __assign(__assign({}, group), { name: updates.name !== undefined ? validateUserText(updates.name.trim(), "study_group:".concat(groupId, ":name")) : group.name, description: updates.description !== undefined
                                ? validateUserText(updates.description.trim(), "study_group:".concat(groupId, ":description"))
                                : group.description, icon: updates.icon !== undefined ? updates.icon : group.icon, isPrivate: updates.isPrivate !== undefined ? updates.isPrivate : group.isPrivate });
                        newGroups = __spreadArray([], groups, true);
                        newGroups[idx] = next;
                        return [4 /*yield*/, this.persistGroups(newGroups)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, next];
                }
            });
        });
    };
    StudyGroupService.prototype.createInviteCode = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, groups, idx, group, code, next, newGroups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = userStore_1.useUserStore.getState().userId;
                        return [4 /*yield*/, this.ensureGroupsLoaded()];
                    case 1:
                        groups = _a.sent();
                        idx = groups.findIndex(function (g) { return g.id === groupId; });
                        if (idx === -1)
                            throw new Error('Group not found');
                        group = groups[idx];
                        if (!group.adminIds.includes(userId))
                            throw new Error('Admin permission required');
                        code = randomId('invite');
                        next = __assign(__assign({}, group), { inviteCodes: __spreadArray([code], group.inviteCodes, true).slice(0, 25) });
                        newGroups = __spreadArray([], groups, true);
                        newGroups[idx] = next;
                        return [4 /*yield*/, this.persistGroups(newGroups)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, code];
                }
            });
        });
    };
    StudyGroupService.prototype.inviteByUsername = function (groupId, username) {
        return __awaiter(this, void 0, void 0, function () {
            var group, userName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGroup(groupId)];
                    case 1:
                        group = _a.sent();
                        if (!group)
                            throw new Error('Group not found');
                        userName = userStore_1.useUserStore.getState().userName;
                        if (username.trim().toLowerCase() === (userName || '').trim().toLowerCase()) {
                            NotificationService_1.notificationService.notifyGroupInvite({ groupId: groupId, groupName: group.name, invitedBy: userName || 'Someone' });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.joinGroupByCode = function (codeOrGroupId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, userName, selectedAvatar, addStudyGroupMembership, groups, code, idx, group, joinedAt, next, newGroups;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), userId = _a.userId, userName = _a.userName, selectedAvatar = _a.selectedAvatar, addStudyGroupMembership = _a.addStudyGroupMembership;
                        return [4 /*yield*/, this.ensureGroupsLoaded()];
                    case 1:
                        groups = _c.sent();
                        code = codeOrGroupId.trim();
                        idx = groups.findIndex(function (g) { return g.id === code || g.inviteCodes.includes(code); });
                        if (idx === -1)
                            throw new Error('Invalid group code');
                        group = groups[idx];
                        if (group.members.includes(userId))
                            return [2 /*return*/, group];
                        if (group.isPrivate && group.id !== code && !group.inviteCodes.includes(code)) {
                            throw new Error('Invite code required');
                        }
                        joinedAt = new Date().toISOString();
                        next = __assign(__assign({}, group), { members: __spreadArray(__spreadArray([], group.members, true), [userId], false), memberProfiles: __assign(__assign({}, group.memberProfiles), (_b = {}, _b[userId] = { userName: userName || 'You', avatar: selectedAvatar || 'Robot' }, _b)) });
                        newGroups = __spreadArray([], groups, true);
                        newGroups[idx] = next;
                        return [4 /*yield*/, this.persistGroups(newGroups)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, addStudyGroupMembership({ groupId: group.id, role: 'member', joinedAt: joinedAt })];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, next];
                }
            });
        });
    };
    StudyGroupService.prototype.leaveGroup = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, removeStudyGroupMembership, groups, idx, group, nextMembers, nextAdmins, nextProfiles, next, newGroups;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), userId = _a.userId, removeStudyGroupMembership = _a.removeStudyGroupMembership;
                        return [4 /*yield*/, this.ensureGroupsLoaded()];
                    case 1:
                        groups = _b.sent();
                        idx = groups.findIndex(function (g) { return g.id === groupId; });
                        if (idx === -1)
                            throw new Error('Group not found');
                        group = groups[idx];
                        if (!group.members.includes(userId))
                            return [2 /*return*/];
                        nextMembers = group.members.filter(function (m) { return m !== userId; });
                        nextAdmins = group.adminIds.filter(function (a) { return a !== userId; });
                        nextProfiles = __assign({}, group.memberProfiles);
                        delete nextProfiles[userId];
                        next = __assign(__assign({}, group), { members: nextMembers, adminIds: nextAdmins, memberProfiles: nextProfiles });
                        if (next.adminIds.length === 0 && next.members.length > 0) {
                            next = __assign(__assign({}, next), { adminIds: [next.members[0]] });
                        }
                        newGroups = __spreadArray([], groups, true);
                        newGroups[idx] = next;
                        return [4 /*yield*/, this.persistGroups(newGroups)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, removeStudyGroupMembership(groupId)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.removeMember = function (groupId, memberId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, groups, idx, group, nextProfiles, next, newGroups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = userStore_1.useUserStore.getState().userId;
                        return [4 /*yield*/, this.ensureGroupsLoaded()];
                    case 1:
                        groups = _a.sent();
                        idx = groups.findIndex(function (g) { return g.id === groupId; });
                        if (idx === -1)
                            throw new Error('Group not found');
                        group = groups[idx];
                        if (!group.adminIds.includes(userId))
                            throw new Error('Admin permission required');
                        if (!group.members.includes(memberId))
                            return [2 /*return*/];
                        nextProfiles = __assign({}, group.memberProfiles);
                        delete nextProfiles[memberId];
                        next = __assign(__assign({}, group), { members: group.members.filter(function (m) { return m !== memberId; }), adminIds: group.adminIds.filter(function (a) { return a !== memberId; }), memberProfiles: nextProfiles });
                        newGroups = __spreadArray([], groups, true);
                        newGroups[idx] = next;
                        return [4 /*yield*/, this.persistGroups(newGroups)];
                    case 2:
                        _a.sent();
                        if (!(memberId === userStore_1.useUserStore.getState().userId)) return [3 /*break*/, 4];
                        return [4 /*yield*/, userStore_1.useUserStore.getState().removeStudyGroupMembership(groupId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.promoteToAdmin = function (groupId, memberId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, addStudyGroupMembership, groups, idx, group, next, newGroups;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userStore_1.useUserStore.getState(), userId = _a.userId, addStudyGroupMembership = _a.addStudyGroupMembership;
                        return [4 /*yield*/, this.ensureGroupsLoaded()];
                    case 1:
                        groups = _b.sent();
                        idx = groups.findIndex(function (g) { return g.id === groupId; });
                        if (idx === -1)
                            throw new Error('Group not found');
                        group = groups[idx];
                        if (!group.adminIds.includes(userId))
                            throw new Error('Admin permission required');
                        if (!group.members.includes(memberId))
                            throw new Error('User is not a member');
                        next = __assign(__assign({}, group), { adminIds: group.adminIds.includes(memberId) ? group.adminIds : __spreadArray(__spreadArray([], group.adminIds, true), [memberId], false) });
                        newGroups = __spreadArray([], groups, true);
                        newGroups[idx] = next;
                        return [4 /*yield*/, this.persistGroups(newGroups)];
                    case 2:
                        _b.sent();
                        if (!(memberId === userId)) return [3 /*break*/, 4];
                        return [4 /*yield*/, addStudyGroupMembership({ groupId: groupId, role: 'admin', joinedAt: new Date().toISOString() })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.loadChat = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, raw, messages, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cached = this.chatCache.get(groupId);
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEYS.CHAT(groupId))];
                    case 2:
                        raw = _a.sent();
                        messages = raw ? JSON.parse(raw) : [];
                        this.chatCache.set(groupId, messages);
                        return [2 /*return*/, messages];
                    case 3:
                        error_3 = _a.sent();
                        // Error handled silently
                        this.chatCache.set(groupId, []);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.persistChat = function (groupId, messages) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.chatCache.set(groupId, messages);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.CHAT(groupId), JSON.stringify(messages))];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        (_a = this.chatListeners.get(groupId)) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) { return cb(messages); });
                        return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.subscribeToChat = function (groupId, listener) {
        var _this = this;
        var _a;
        var setForGroup = (_a = this.chatListeners.get(groupId)) !== null && _a !== void 0 ? _a : new Set();
        setForGroup.add(listener);
        this.chatListeners.set(groupId, setForGroup);
        void this.loadChat(groupId).then(function (m) { return listener(m); });
        return function () {
            var setNow = _this.chatListeners.get(groupId);
            setNow === null || setNow === void 0 ? void 0 : setNow.delete(listener);
            if (setNow && setNow.size === 0)
                _this.chatListeners.delete(groupId);
        };
    };
    StudyGroupService.prototype.sendChatMessage = function (groupId, message) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, group, trimmed, sanitized, msg, current, next;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = userStore_1.useUserStore.getState().userId;
                        return [4 /*yield*/, this.getGroup(groupId)];
                    case 1:
                        group = _b.sent();
                        if (!group)
                            throw new Error('Group not found');
                        if (!group.members.includes(userId))
                            throw new Error('You are not a member of this group');
                        trimmed = message.trim();
                        if (!trimmed)
                            throw new Error('Message is empty');
                        sanitized = validateUserText(trimmed, "study_group:".concat(groupId, ":message:").concat(Date.now()));
                        msg = {
                            id: randomId('msg'),
                            groupId: groupId,
                            userId: userId,
                            message: sanitized,
                            timestamp: new Date().toISOString(),
                        };
                        return [4 /*yield*/, this.loadChat(groupId)];
                    case 2:
                        current = _b.sent();
                        next = __spreadArray(__spreadArray([], current, true), [msg], false).slice(-MAX_CHAT_MESSAGES);
                        return [4 /*yield*/, this.persistChat(groupId, next)];
                    case 3:
                        _b.sent();
                        NotificationService_1.notificationService.notifyGroupMessage({
                            groupId: groupId,
                            groupName: group.name,
                            fromUserName: ((_a = group.memberProfiles[userId]) === null || _a === void 0 ? void 0 : _a.userName) || 'Someone',
                            preview: sanitized.length > 80 ? "".concat(sanitized.slice(0, 77), "...") : sanitized,
                        });
                        return [2 /*return*/, msg];
                }
            });
        });
    };
    StudyGroupService.prototype.loadNotes = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, raw, notes, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cached = this.notesCache.get(groupId);
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEYS.NOTES(groupId))];
                    case 2:
                        raw = _a.sent();
                        notes = raw ? JSON.parse(raw) : [];
                        this.notesCache.set(groupId, notes);
                        return [2 /*return*/, notes];
                    case 3:
                        error_5 = _a.sent();
                        // Error handled silently
                        this.notesCache.set(groupId, []);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.persistNotes = function (groupId, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.notesCache.set(groupId, notes);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.NOTES(groupId), JSON.stringify(notes))];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        (_a = this.notesListeners.get(groupId)) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) { return cb(notes); });
                        return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.subscribeToNotes = function (groupId, listener) {
        var _this = this;
        var _a;
        var setForGroup = (_a = this.notesListeners.get(groupId)) !== null && _a !== void 0 ? _a : new Set();
        setForGroup.add(listener);
        this.notesListeners.set(groupId, setForGroup);
        void this.loadNotes(groupId).then(function (n) { return listener(n); });
        return function () {
            var setNow = _this.notesListeners.get(groupId);
            setNow === null || setNow === void 0 ? void 0 : setNow.delete(listener);
            if (setNow && setNow.size === 0)
                _this.notesListeners.delete(groupId);
        };
    };
    StudyGroupService.prototype.addNote = function (groupId, content) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, group, trimmed, sanitized, note, current, next;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = userStore_1.useUserStore.getState().userId;
                        return [4 /*yield*/, this.getGroup(groupId)];
                    case 1:
                        group = _a.sent();
                        if (!group)
                            throw new Error('Group not found');
                        if (!group.members.includes(userId))
                            throw new Error('You are not a member of this group');
                        trimmed = content.trim();
                        if (!trimmed)
                            throw new Error('Note is empty');
                        sanitized = validateUserText(trimmed, "study_group:".concat(groupId, ":note:").concat(Date.now()));
                        note = {
                            id: randomId('note'),
                            groupId: groupId,
                            userId: userId,
                            content: sanitized,
                            createdAt: new Date().toISOString(),
                        };
                        return [4 /*yield*/, this.loadNotes(groupId)];
                    case 2:
                        current = _a.sent();
                        next = __spreadArray([note], current, true).slice(0, MAX_NOTES);
                        return [4 /*yield*/, this.persistNotes(groupId, next)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, note];
                }
            });
        });
    };
    StudyGroupService.prototype.loadSchedule = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, raw, entries, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cached = this.scheduleCache.get(groupId);
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEYS.SCHEDULE(groupId))];
                    case 2:
                        raw = _a.sent();
                        entries = raw ? JSON.parse(raw) : [];
                        this.scheduleCache.set(groupId, entries);
                        return [2 /*return*/, entries];
                    case 3:
                        error_7 = _a.sent();
                        // Error handled silently
                        this.scheduleCache.set(groupId, []);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.persistSchedule = function (groupId, entries) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.scheduleCache.set(groupId, entries);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEYS.SCHEDULE(groupId), JSON.stringify(entries))];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        (_a = this.scheduleListeners.get(groupId)) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) { return cb(entries); });
                        return [2 /*return*/];
                }
            });
        });
    };
    StudyGroupService.prototype.subscribeToSchedule = function (groupId, listener) {
        var _this = this;
        var _a;
        var setForGroup = (_a = this.scheduleListeners.get(groupId)) !== null && _a !== void 0 ? _a : new Set();
        setForGroup.add(listener);
        this.scheduleListeners.set(groupId, setForGroup);
        void this.loadSchedule(groupId).then(function (n) { return listener(n); });
        return function () {
            var setNow = _this.scheduleListeners.get(groupId);
            setNow === null || setNow === void 0 ? void 0 : setNow.delete(listener);
            if (setNow && setNow.size === 0)
                _this.scheduleListeners.delete(groupId);
        };
    };
    StudyGroupService.prototype.addScheduleEntry = function (groupId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, group, title, entry, current, next;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = userStore_1.useUserStore.getState().userId;
                        return [4 /*yield*/, this.getGroup(groupId)];
                    case 1:
                        group = _a.sent();
                        if (!group)
                            throw new Error('Group not found');
                        if (!group.members.includes(userId))
                            throw new Error('You are not a member of this group');
                        title = validateUserText(params.title.trim(), "study_group:".concat(groupId, ":schedule:").concat(Date.now()));
                        entry = {
                            id: randomId('schedule'),
                            groupId: groupId,
                            title: title,
                            scheduledAt: params.scheduledAt,
                            createdBy: userId,
                            createdAt: new Date().toISOString(),
                        };
                        return [4 /*yield*/, this.loadSchedule(groupId)];
                    case 2:
                        current = _a.sent();
                        next = __spreadArray([entry], current, true).slice(0, MAX_SCHEDULE);
                        return [4 /*yield*/, this.persistSchedule(groupId, next)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    return StudyGroupService;
}());
exports.StudyGroupService = StudyGroupService;
exports.studyGroupService = StudyGroupService.getInstance();
