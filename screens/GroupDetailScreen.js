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
exports.default = GroupDetailScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("@/components/ThemeContext");
var StudyGroupService_1 = require("@/services/StudyGroupService");
var GroupQuizService_1 = require("@/services/GroupQuizService");
var GroupChatMessage_1 = require("@/components/GroupChatMessage");
var GroupNoteCard_1 = require("@/components/GroupNoteCard");
var GroupLeaderboard_1 = require("@/components/GroupLeaderboard");
var userStore_1 = require("@/store/userStore");
var quizStore_1 = require("@/store/quizStore");
var QuizCard_1 = require("@/components/QuizCard");
var TABS = ['Chat', 'Notes', 'Members', 'Quizzes', 'Leaderboard', 'Schedule'];
function GroupDetailScreen() {
    var _this = this;
    var _a;
    var groupId = (0, expo_router_1.useLocalSearchParams)().groupId;
    var router = (0, expo_router_1.useRouter)();
    var _b = (0, ThemeContext_1.useTheme)(), colors = _b.colors, isDark = _b.isDark;
    var _c = (0, userStore_1.useUserStore)(), userId = _c.userId, userName = _c.userName, selectedAvatar = _c.selectedAvatar, selectedClass = _c.selectedClass;
    var _d = (0, react_1.useState)(null), group = _d[0], setGroup = _d[1];
    var _e = (0, react_1.useState)('Chat'), tab = _e[0], setTab = _e[1];
    var _f = (0, react_1.useState)([]), messages = _f[0], setMessages = _f[1];
    var _g = (0, react_1.useState)(''), chatText = _g[0], setChatText = _g[1];
    var _h = (0, react_1.useState)([]), notes = _h[0], setNotes = _h[1];
    var _j = (0, react_1.useState)(''), noteText = _j[0], setNoteText = _j[1];
    var _k = (0, react_1.useState)([]), schedule = _k[0], setSchedule = _k[1];
    var _l = (0, react_1.useState)(''), scheduleTitle = _l[0], setScheduleTitle = _l[1];
    var _m = (0, react_1.useState)(''), scheduleWhen = _m[0], setScheduleWhen = _m[1];
    var _o = (0, react_1.useState)(null), inviteCode = _o[0], setInviteCode = _o[1];
    var _p = (0, react_1.useState)(''), inviteUsername = _p[0], setInviteUsername = _p[1];
    var _q = (0, react_1.useState)([]), quizzes = _q[0], setQuizzes = _q[1];
    var _r = (0, react_1.useState)(''), quizSubject = _r[0], setQuizSubject = _r[1];
    var _s = (0, react_1.useState)(''), quizChapter = _s[0], setQuizChapter = _s[1];
    var _t = (0, react_1.useState)('25'), quizReward = _t[0], setQuizReward = _t[1];
    var _u = (0, react_1.useState)('24'), quizDeadlineHours = _u[0], setQuizDeadlineHours = _u[1];
    var _v = (0, react_1.useState)(null), activeQuiz = _v[0], setActiveQuiz = _v[1];
    var _w = (0, react_1.useState)(false), quizModalVisible = _w[0], setQuizModalVisible = _w[1];
    var _x = (0, react_1.useState)(false), submittingQuiz = _x[0], setSubmittingQuiz = _x[1];
    var _y = (0, react_1.useState)(null), completedQuizResult = _y[0], setCompletedQuizResult = _y[1];
    var isAdmin = Boolean(group === null || group === void 0 ? void 0 : group.adminIds.includes(userId));
    var latestQuiz = (_a = quizzes[0]) !== null && _a !== void 0 ? _a : null;
    var styles = (0, react_1.useMemo)(function () { return getStyles(colors, isDark); }, [colors, isDark]);
    var loadGroup = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var g;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!groupId)
                        return [2 /*return*/];
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.getGroup(groupId)];
                case 1:
                    g = _a.sent();
                    setGroup(g);
                    return [2 /*return*/];
            }
        });
    }); }, [groupId]);
    (0, react_1.useEffect)(function () {
        loadGroup();
        var unsub = StudyGroupService_1.studyGroupService.subscribeToGroups(function () {
            loadGroup();
        });
        return unsub;
    }, [loadGroup]);
    (0, react_1.useEffect)(function () {
        if (!groupId)
            return;
        var unsubChat = StudyGroupService_1.studyGroupService.subscribeToChat(groupId, setMessages);
        var unsubNotes = StudyGroupService_1.studyGroupService.subscribeToNotes(groupId, setNotes);
        var unsubSchedule = StudyGroupService_1.studyGroupService.subscribeToSchedule(groupId, setSchedule);
        var unsubQuizzes = GroupQuizService_1.groupQuizService.subscribe(groupId, function (items) {
            setQuizzes(items);
        });
        return function () {
            unsubChat();
            unsubNotes();
            unsubSchedule();
            unsubQuizzes();
        };
    }, [groupId]);
    var handleLeaveGroup = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (!groupId)
                return [2 /*return*/];
            react_native_1.Alert.alert('Leave group?', 'You can join again later with an invite code.', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: function () { return __awaiter(_this, void 0, void 0, function () {
                        var error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.leaveGroup(groupId)];
                                case 1:
                                    _a.sent();
                                    router.back();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _a.sent();
                                    react_native_1.Alert.alert('Could not leave', error_1 instanceof Error ? error_1.message : 'Please try again.');
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); },
                },
            ]);
            return [2 /*return*/];
        });
    }); };
    var handleSendMessage = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!groupId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.sendChatMessage(groupId, chatText)];
                case 2:
                    _a.sent();
                    setChatText('');
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    react_native_1.Alert.alert('Could not send message', error_2 instanceof Error ? error_2.message : 'Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleAddNote = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!groupId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.addNote(groupId, noteText)];
                case 2:
                    _a.sent();
                    setNoteText('');
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    react_native_1.Alert.alert('Could not post note', error_3 instanceof Error ? error_3.message : 'Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleAddSchedule = function () { return __awaiter(_this, void 0, void 0, function () {
        var title, whenInput, when, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!groupId)
                        return [2 /*return*/];
                    title = scheduleTitle.trim();
                    if (!title) {
                        react_native_1.Alert.alert('Missing title', 'Add a short schedule title.');
                        return [2 /*return*/];
                    }
                    whenInput = scheduleWhen.trim();
                    when = whenInput ? new Date(whenInput) : new Date(Date.now() + 60 * 60 * 1000);
                    if (Number.isNaN(when.getTime())) {
                        react_native_1.Alert.alert('Invalid date', 'Try a format like 2026-01-02 18:30');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.addScheduleEntry(groupId, {
                            title: title,
                            scheduledAt: when.toISOString(),
                        })];
                case 2:
                    _a.sent();
                    setScheduleTitle('');
                    setScheduleWhen('');
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    react_native_1.Alert.alert('Could not add schedule', error_4 instanceof Error ? error_4.message : 'Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleGenerateInvite = function () { return __awaiter(_this, void 0, void 0, function () {
        var code, error_5;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!groupId)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.createInviteCode(groupId)];
                case 2:
                    code = _b.sent();
                    setInviteCode(code);
                    return [4 /*yield*/, react_native_1.Share.share({
                            message: "Join my LearnSmart study group \u201C".concat((_a = group === null || group === void 0 ? void 0 : group.name) !== null && _a !== void 0 ? _a : '', "\u201D with this invite code: ").concat(code),
                        })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _b.sent();
                    react_native_1.Alert.alert('Could not create invite', error_5 instanceof Error ? error_5.message : 'Please try again.');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleInviteByUsername = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!groupId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.inviteByUsername(groupId, inviteUsername)];
                case 2:
                    _a.sent();
                    setInviteUsername('');
                    react_native_1.Alert.alert('Invite sent', 'If that user is on this device, they will see a notification.');
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    react_native_1.Alert.alert('Could not invite', error_6 instanceof Error ? error_6.message : 'Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRemoveMember = function (memberId) { return __awaiter(_this, void 0, void 0, function () {
        var error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!groupId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.removeMember(groupId, memberId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    react_native_1.Alert.alert('Could not remove member', error_7 instanceof Error ? error_7.message : 'Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateQuiz = function () { return __awaiter(_this, void 0, void 0, function () {
        var reward, hours, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!groupId)
                        return [2 /*return*/];
                    if (!quizSubject.trim() || !quizChapter.trim()) {
                        react_native_1.Alert.alert('Missing fields', 'Please enter a subject and chapter.');
                        return [2 /*return*/];
                    }
                    reward = Number(quizReward) || 0;
                    hours = Number(quizDeadlineHours) || 24;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, GroupQuizService_1.groupQuizService.createGroupQuiz({
                            groupId: groupId,
                            className: selectedClass || 'Class',
                            subject: quizSubject.trim(),
                            chapter: quizChapter.trim(),
                            deadline: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
                            reward: reward,
                        })];
                case 2:
                    _a.sent();
                    setQuizSubject('');
                    setQuizChapter('');
                    setQuizReward('25');
                    setQuizDeadlineHours('24');
                    setTab('Quizzes');
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    react_native_1.Alert.alert('Could not create quiz', error_8 instanceof Error ? error_8.message : 'Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var openQuiz = function (quiz) {
        setActiveQuiz(quiz);
        setCompletedQuizResult(null);
        quizStore_1.useQuizStore.getState().setQuestions(quiz.questions, quiz.chapter, quiz.subject, quiz.chapter);
        setQuizModalVisible(true);
    };
    var closeQuiz = function () {
        setQuizModalVisible(false);
        setActiveQuiz(null);
        setCompletedQuizResult(null);
        quizStore_1.useQuizStore.getState().resetQuiz();
    };
    var handleEndQuiz = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!activeQuiz)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, quizStore_1.useQuizStore.getState().endQuiz()];
                case 2:
                    result = _a.sent();
                    if (!result) {
                        closeQuiz();
                        return [2 /*return*/];
                    }
                    setCompletedQuizResult({
                        score: result.score,
                        correctAnswers: result.correctAnswers,
                        totalQuestions: result.totalQuestions,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _a.sent();
                    react_native_1.Alert.alert('Could not finish quiz', error_9 instanceof Error ? error_9.message : 'Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSubmitQuizResult = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!groupId || !activeQuiz)
                        return [2 /*return*/];
                    if (!completedQuizResult) {
                        closeQuiz();
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setSubmittingQuiz(true);
                    return [4 /*yield*/, GroupQuizService_1.groupQuizService.submitGroupQuizResult({
                            groupId: groupId,
                            groupQuizId: activeQuiz.id,
                            score: completedQuizResult.score,
                            correctAnswers: completedQuizResult.correctAnswers,
                            totalQuestions: completedQuizResult.totalQuestions,
                        })];
                case 2:
                    _a.sent();
                    closeQuiz();
                    setTab('Leaderboard');
                    return [3 /*break*/, 5];
                case 3:
                    error_10 = _a.sent();
                    react_native_1.Alert.alert('Could not submit quiz', error_10 instanceof Error ? error_10.message : 'Please try again.');
                    return [3 /*break*/, 5];
                case 4:
                    setSubmittingQuiz(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (!group) {
        return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <react_native_1.View style={styles.content}>
          <react_native_1.Text style={styles.loadingText}>Loading group…</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.SafeAreaView>);
    }
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.ScrollView contentContainerStyle={styles.content}>
        <react_native_1.View style={styles.groupHeader}>
          <react_native_1.View style={styles.groupIcon}>
            <react_native_1.Text style={styles.groupIconText}>{group.icon || '👥'}</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.groupMeta}>
            <react_native_1.Text style={styles.groupName} numberOfLines={1}>
              {group.name}
            </react_native_1.Text>
            <react_native_1.Text style={styles.groupDesc} numberOfLines={2}>
              {group.description}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View style={styles.headerButtons}>
          <react_native_1.TouchableOpacity style={styles.secondaryButton} onPress={handleLeaveGroup}>
            <react_native_1.Text style={styles.secondaryButtonText}>Leave</react_native_1.Text>
          </react_native_1.TouchableOpacity>

          {isAdmin ? (<react_native_1.TouchableOpacity style={styles.primaryButton} onPress={handleGenerateInvite}>
              <react_native_1.Text style={styles.primaryButtonText}>Invite</react_native_1.Text>
            </react_native_1.TouchableOpacity>) : null}
        </react_native_1.View>

        {inviteCode ? (<react_native_1.View style={styles.inviteCodeCard}>
            <react_native_1.Text style={styles.inviteTitle}>Invite Code</react_native_1.Text>
            <react_native_1.Text style={styles.inviteCode}>{inviteCode}</react_native_1.Text>
            <react_native_1.Text style={styles.inviteHint}>Share this code to let others join.</react_native_1.Text>
          </react_native_1.View>) : null}

        {isAdmin ? (<react_native_1.View style={styles.inviteByUsernameCard}>
            <react_native_1.Text style={styles.sectionTitle}>Invite by username</react_native_1.Text>
            <react_native_1.View style={styles.inlineRow}>
              <react_native_1.TextInput value={inviteUsername} onChangeText={setInviteUsername} placeholder="Username" placeholderTextColor={colors.textSecondary} style={styles.input} autoCapitalize="none"/>
              <react_native_1.TouchableOpacity style={styles.joinButton} onPress={handleInviteByUsername}>
                <react_native_1.Text style={styles.joinButtonText}>Send</react_native_1.Text>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>
          </react_native_1.View>) : null}

        <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
          {TABS.map(function (t) { return (<react_native_1.TouchableOpacity key={t} style={[styles.tabChip, tab === t ? styles.tabChipActive : null]} onPress={function () { return setTab(t); }}>
              <react_native_1.Text style={[styles.tabChipText, tab === t ? styles.tabChipTextActive : null]}>{t}</react_native_1.Text>
            </react_native_1.TouchableOpacity>); })}
        </react_native_1.ScrollView>

        {tab === 'Chat' ? (<react_native_1.View style={styles.tabSection}>
            {messages.length === 0 ? (<react_native_1.Text style={styles.emptySubtitle}>No messages yet. Say hello!</react_native_1.Text>) : (messages.map(function (m) { return <GroupChatMessage_1.default key={m.id} message={m} group={group}/>; }))}

            <react_native_1.View style={styles.inlineRow}>
              <react_native_1.TextInput value={chatText} onChangeText={setChatText} placeholder="Type a message…" placeholderTextColor={colors.textSecondary} style={styles.input}/>
              <react_native_1.TouchableOpacity style={styles.joinButton} onPress={handleSendMessage}>
                <react_native_1.Text style={styles.joinButtonText}>Send</react_native_1.Text>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>
          </react_native_1.View>) : null}

        {tab === 'Notes' ? (<react_native_1.View style={styles.tabSection}>
            <react_native_1.View style={styles.inlineRow}>
              <react_native_1.TextInput value={noteText} onChangeText={setNoteText} placeholder="Share a note with the group…" placeholderTextColor={colors.textSecondary} style={styles.input}/>
              <react_native_1.TouchableOpacity style={styles.joinButton} onPress={handleAddNote}>
                <react_native_1.Text style={styles.joinButtonText}>Post</react_native_1.Text>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>

            <react_native_1.View style={{ marginTop: theme_1.Spacing.md }}>
              {notes.length === 0 ? (<react_native_1.Text style={styles.emptySubtitle}>No notes yet.</react_native_1.Text>) : (notes.map(function (n) { return <GroupNoteCard_1.default key={n.id} note={n} group={group}/>; }))}
            </react_native_1.View>
          </react_native_1.View>) : null}

        {tab === 'Members' ? (<react_native_1.View style={styles.tabSection}>
            <react_native_1.Text style={styles.sectionTitle}>Members ({group.members.length})</react_native_1.Text>
            {group.members.map(function (memberId) {
                var _a;
                var profile = group.memberProfiles[memberId];
                var displayName = (_a = profile === null || profile === void 0 ? void 0 : profile.userName) !== null && _a !== void 0 ? _a : memberId;
                var isMemberAdmin = group.adminIds.includes(memberId);
                return (<react_native_1.View key={memberId} style={styles.memberRow}>
                  <react_native_1.View style={styles.memberMeta}>
                    <react_native_1.Text style={styles.memberName}>{displayName}</react_native_1.Text>
                    <react_native_1.Text style={styles.memberRole}>{isMemberAdmin ? 'Admin' : 'Member'}</react_native_1.Text>
                  </react_native_1.View>

                  {isAdmin && memberId !== userId ? (<react_native_1.TouchableOpacity style={styles.kickButton} onPress={function () { return handleRemoveMember(memberId); }}>
                      <react_native_1.Text style={styles.kickText}>Remove</react_native_1.Text>
                    </react_native_1.TouchableOpacity>) : null}
                </react_native_1.View>);
            })}
          </react_native_1.View>) : null}

        {tab === 'Quizzes' ? (<react_native_1.View style={styles.tabSection}>
            {isAdmin ? (<react_native_1.View style={styles.quizCreateCard}>
                <react_native_1.Text style={styles.sectionTitle}>Create a group quiz</react_native_1.Text>
                <react_native_1.TextInput value={quizSubject} onChangeText={setQuizSubject} placeholder="Subject (e.g., Mathematics)" placeholderTextColor={colors.textSecondary} style={styles.input}/>
                <react_native_1.TextInput value={quizChapter} onChangeText={setQuizChapter} placeholder="Chapter / Topic" placeholderTextColor={colors.textSecondary} style={[styles.input, { marginTop: theme_1.Spacing.sm }]}/>

                <react_native_1.View style={[styles.inlineRow, { marginTop: theme_1.Spacing.sm }]}> 
                  <react_native_1.TextInput value={quizReward} onChangeText={setQuizReward} placeholder="Reward" placeholderTextColor={colors.textSecondary} style={[styles.input, { flex: 1 }]} keyboardType="numeric"/>
                  <react_native_1.View style={{ width: theme_1.Spacing.md }}/>
                  <react_native_1.TextInput value={quizDeadlineHours} onChangeText={setQuizDeadlineHours} placeholder="Hours" placeholderTextColor={colors.textSecondary} style={[styles.input, { flex: 1 }]} keyboardType="numeric"/>
                </react_native_1.View>

                <react_native_1.TouchableOpacity style={[styles.primaryButton, { marginTop: theme_1.Spacing.md }]} onPress={handleCreateQuiz}>
                  <react_native_1.Text style={styles.primaryButtonText}>Create Quiz</react_native_1.Text>
                </react_native_1.TouchableOpacity>
              </react_native_1.View>) : null}

            <react_native_1.View style={{ marginTop: theme_1.Spacing.lg }}>
              <react_native_1.Text style={styles.sectionTitle}>Quiz challenges</react_native_1.Text>
              {quizzes.length === 0 ? (<react_native_1.Text style={styles.emptySubtitle}>No group quizzes yet.</react_native_1.Text>) : (quizzes.map(function (q) {
                var taken = Boolean(q.results[userId]);
                return (<react_native_1.View key={q.id} style={styles.quizRow}>
                      <react_native_1.View style={{ flex: 1 }}>
                        <react_native_1.Text style={styles.quizTitle}>{q.subject}: {q.chapter}</react_native_1.Text>
                        <react_native_1.Text style={styles.quizMeta}>
                          Reward {q.reward} · {Object.keys(q.results).length}/{group.members.length} completed
                        </react_native_1.Text>
                      </react_native_1.View>
                      <react_native_1.TouchableOpacity style={taken ? styles.secondaryButton : styles.joinButton} onPress={function () { return openQuiz(q); }}>
                        <react_native_1.Text style={taken ? styles.secondaryButtonText : styles.joinButtonText}>{taken ? 'Retake' : 'Take'}</react_native_1.Text>
                      </react_native_1.TouchableOpacity>
                    </react_native_1.View>);
            }))}
            </react_native_1.View>
          </react_native_1.View>) : null}

        {tab === 'Leaderboard' ? (<react_native_1.View style={styles.tabSection}>
            <react_native_1.Text style={styles.sectionTitle}>Leaderboard</react_native_1.Text>
            {!latestQuiz ? (<react_native_1.Text style={styles.emptySubtitle}>Create a quiz to start competing.</react_native_1.Text>) : (<GroupLeaderboard_1.default group={group} quiz={latestQuiz}/>)}
          </react_native_1.View>) : null}

        {tab === 'Schedule' ? (<react_native_1.View style={styles.tabSection}>
            <react_native_1.Text style={styles.sectionTitle}>Study schedule</react_native_1.Text>
            <react_native_1.Text style={styles.emptySubtitle}>Add coordinated study times for your group.</react_native_1.Text>

            <react_native_1.TextInput value={scheduleTitle} onChangeText={setScheduleTitle} placeholder="Session title (e.g., Algebra revision)" placeholderTextColor={colors.textSecondary} style={styles.input}/>
            <react_native_1.TextInput value={scheduleWhen} onChangeText={setScheduleWhen} placeholder="When (e.g., 2026-01-02 18:30)" placeholderTextColor={colors.textSecondary} style={[styles.input, { marginTop: theme_1.Spacing.sm }]} autoCapitalize="none"/>
            <react_native_1.TouchableOpacity style={[styles.primaryButton, { marginTop: theme_1.Spacing.md }]} onPress={handleAddSchedule}>
              <react_native_1.Text style={styles.primaryButtonText}>Add</react_native_1.Text>
            </react_native_1.TouchableOpacity>

            <react_native_1.View style={{ marginTop: theme_1.Spacing.lg }}>
              {schedule.length === 0 ? (<react_native_1.Text style={styles.emptySubtitle}>No scheduled sessions yet.</react_native_1.Text>) : (schedule
                .slice()
                .sort(function (a, b) { return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(); })
                .map(function (s) { return (<react_native_1.View key={s.id} style={styles.scheduleRow}>
                      <react_native_1.Text style={styles.scheduleTitle}>{s.title}</react_native_1.Text>
                      <react_native_1.Text style={styles.scheduleMeta}>{new Date(s.scheduledAt).toLocaleString()}</react_native_1.Text>
                    </react_native_1.View>); }))}
            </react_native_1.View>
          </react_native_1.View>) : null}

        <react_native_1.View style={styles.bottomSpacer}/>
      </react_native_1.ScrollView>

      <react_native_1.Modal visible={quizModalVisible} transparent animationType="slide" onRequestClose={closeQuiz}>
        <react_native_1.View style={styles.modalOverlay}>
          <react_native_1.View style={styles.quizModalCard}>
            <react_native_1.View style={styles.quizModalHeader}>
              <react_native_1.Text style={styles.modalTitle} numberOfLines={1}>
                {activeQuiz ? "".concat(activeQuiz.subject, ": ").concat(activeQuiz.chapter) : 'Group Quiz'}
              </react_native_1.Text>
              <react_native_1.TouchableOpacity onPress={closeQuiz}>
                <react_native_1.Text style={styles.closeText}>✕</react_native_1.Text>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>

            <react_native_1.View style={styles.quizModalContent}>
              {activeQuiz ? (<GroupQuizFlow onFinish={handleEndQuiz} submitting={submittingQuiz}/>) : null}
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>
    </react_native_1.SafeAreaView>);
}
function GroupQuizFlow(_a) {
    var onFinish = _a.onFinish, submitting = _a.submitting;
    var _b = (0, quizStore_1.useQuizStore)(), questions = _b.questions, currentQuestionIndex = _b.currentQuestionIndex, isQuizActive = _b.isQuizActive, selectedAnswers = _b.selectedAnswers;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var isLast = currentQuestionIndex === questions.length - 1;
    var isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
    var handleNext = function () {
        quizStore_1.useQuizStore.getState().nextQuestion();
    };
    var handlePrev = function () {
        quizStore_1.useQuizStore.getState().previousQuestion();
    };
    if (!isQuizActive) {
        var score = quizStore_1.useQuizStore.getState().score;
        return (<react_native_1.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme_1.Spacing.lg }}>
        <react_native_1.Text style={{ fontSize: theme_1.FontSizes.xxl, fontWeight: theme_1.FontWeights.bold, color: colors.primary }}>{score}%</react_native_1.Text>
        <react_native_1.Text style={{ fontSize: theme_1.FontSizes.md, color: colors.textSecondary, marginTop: 6, textAlign: 'center' }}>
          Quiz complete. Your score has been recorded.
        </react_native_1.Text>
        <react_native_1.TouchableOpacity onPress={onFinish} disabled={submitting} style={{
                marginTop: theme_1.Spacing.lg,
                backgroundColor: colors.primary,
                paddingVertical: theme_1.Spacing.md,
                paddingHorizontal: theme_1.Spacing.xl,
                borderRadius: theme_1.BorderRadius.lg,
                opacity: submitting ? 0.7 : 1,
            }}>
          <react_native_1.Text style={{ color: '#FFFFFF', fontWeight: theme_1.FontWeights.bold }}>{submitting ? 'Submitting…' : 'Back to Group'}</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    }
    var question = questions[currentQuestionIndex];
    if (!question)
        return null;
    return (<react_native_1.View style={{ flex: 1 }}>
      <QuizCard_1.default question={question} questionNumber={currentQuestionIndex + 1} totalQuestions={questions.length} onNext={handleNext} onPrevious={handlePrev}/>

      <react_native_1.View style={{ flexDirection: 'row', marginTop: theme_1.Spacing.md }}>
        <react_native_1.TouchableOpacity onPress={handlePrev} disabled={currentQuestionIndex === 0} style={{
            flex: 1,
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: theme_1.BorderRadius.lg,
            paddingVertical: theme_1.Spacing.md,
            alignItems: 'center',
            opacity: currentQuestionIndex === 0 ? 0.5 : 1,
        }}>
          <react_native_1.Text style={{ color: colors.text, fontWeight: theme_1.FontWeights.bold }}>Previous</react_native_1.Text>
        </react_native_1.TouchableOpacity>

        <react_native_1.View style={{ width: theme_1.Spacing.md }}/>

        {isLast ? (<react_native_1.TouchableOpacity onPress={onFinish} disabled={!isAnswered || submitting} style={{
                flex: 1,
                backgroundColor: colors.primary,
                borderRadius: theme_1.BorderRadius.lg,
                paddingVertical: theme_1.Spacing.md,
                alignItems: 'center',
                opacity: !isAnswered || submitting ? 0.6 : 1,
            }}>
            <react_native_1.Text style={{ color: '#FFFFFF', fontWeight: theme_1.FontWeights.bold }}>{submitting ? 'Submitting…' : 'Finish'}</react_native_1.Text>
          </react_native_1.TouchableOpacity>) : (<react_native_1.TouchableOpacity onPress={handleNext} disabled={!isAnswered} style={{
                flex: 1,
                backgroundColor: colors.primary,
                borderRadius: theme_1.BorderRadius.lg,
                paddingVertical: theme_1.Spacing.md,
                alignItems: 'center',
                opacity: !isAnswered ? 0.6 : 1,
            }}>
            <react_native_1.Text style={{ color: '#FFFFFF', fontWeight: theme_1.FontWeights.bold }}>Next</react_native_1.Text>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
        },
        content: {
            paddingTop: 90,
            paddingHorizontal: theme_1.Spacing.lg,
            paddingBottom: 140,
        },
        loadingText: {
            color: colors.textSecondary,
            paddingVertical: theme_1.Spacing.md,
        },
        groupHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme_1.Spacing.md,
        },
        groupIcon: {
            width: 54,
            height: 54,
            borderRadius: 27,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme_1.Spacing.md,
        },
        groupIconText: {
            fontSize: 28,
        },
        groupMeta: {
            flex: 1,
        },
        groupName: {
            fontSize: theme_1.FontSizes.xl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: 2,
        },
        groupDesc: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            lineHeight: theme_1.FontSizes.sm * 1.35,
        },
        headerButtons: {
            flexDirection: 'row',
            marginBottom: theme_1.Spacing.md,
        },
        primaryButton: {
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: theme_1.BorderRadius.lg,
            paddingVertical: theme_1.Spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
            marginLeft: theme_1.Spacing.md,
        },
        primaryButtonText: {
            color: '#FFFFFF',
            fontWeight: theme_1.FontWeights.bold,
            fontSize: theme_1.FontSizes.md,
        },
        secondaryButton: {
            flex: 1,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            borderRadius: theme_1.BorderRadius.lg,
            paddingVertical: theme_1.Spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
            borderWidth: 1,
            borderColor: colors.border,
        },
        secondaryButtonText: {
            color: colors.text,
            fontWeight: theme_1.FontWeights.bold,
            fontSize: theme_1.FontSizes.md,
        },
        inviteCodeCard: {
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.md,
        },
        inviteTitle: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            marginBottom: 6,
            fontWeight: theme_1.FontWeights.semibold,
        },
        inviteCode: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.primary,
        },
        inviteHint: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            marginTop: 6,
        },
        inviteByUsernameCard: {
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            marginBottom: theme_1.Spacing.md,
        },
        tabRow: {
            marginVertical: theme_1.Spacing.md,
        },
        tabChip: {
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.sm,
            backgroundColor: colors.cardBackground,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.border,
            marginRight: theme_1.Spacing.sm,
        },
        tabChipActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        tabChipText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.text,
            fontWeight: theme_1.FontWeights.semibold,
        },
        tabChipTextActive: {
            color: '#FFFFFF',
        },
        tabSection: {
            marginTop: theme_1.Spacing.sm,
        },
        sectionTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: theme_1.Spacing.sm,
        },
        emptySubtitle: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            marginBottom: theme_1.Spacing.md,
        },
        inlineRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        input: {
            flex: 1,
            height: 48,
            borderRadius: theme_1.BorderRadius.md,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: theme_1.Spacing.md,
            color: colors.text,
            backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
        },
        joinButton: {
            marginLeft: theme_1.Spacing.md,
            backgroundColor: colors.primary,
            borderRadius: theme_1.BorderRadius.md,
            paddingHorizontal: theme_1.Spacing.lg,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
        },
        joinButtonText: {
            color: '#FFFFFF',
            fontWeight: theme_1.FontWeights.bold,
        },
        memberRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.lg,
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: theme_1.Spacing.sm,
        },
        memberMeta: {
            flex: 1,
        },
        memberName: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: 2,
        },
        memberRole: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
        },
        kickButton: {
            backgroundColor: '#E07856',
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.sm,
            borderRadius: theme_1.BorderRadius.md,
        },
        kickText: {
            color: '#FFFFFF',
            fontWeight: theme_1.FontWeights.bold,
            fontSize: theme_1.FontSizes.sm,
        },
        quizCreateCard: {
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
        },
        quizRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.lg,
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
            marginTop: theme_1.Spacing.sm,
        },
        quizTitle: {
            fontSize: theme_1.FontSizes.md,
            color: colors.text,
            fontWeight: theme_1.FontWeights.bold,
        },
        quizMeta: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            marginTop: 4,
        },
        scheduleRow: {
            padding: theme_1.Spacing.md,
            borderRadius: theme_1.BorderRadius.lg,
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: theme_1.Spacing.sm,
        },
        scheduleTitle: {
            fontSize: theme_1.FontSizes.md,
            color: colors.text,
            fontWeight: theme_1.FontWeights.bold,
        },
        scheduleMeta: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            marginTop: 4,
        },
        bottomSpacer: {
            height: theme_1.Spacing.xl,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: theme_1.Spacing.lg,
            justifyContent: 'center',
        },
        quizModalCard: {
            height: '90%',
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.xl,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
        },
        quizModalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: theme_1.Spacing.lg,
            paddingVertical: theme_1.Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        modalTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            flex: 1,
            paddingRight: theme_1.Spacing.md,
        },
        closeText: {
            fontSize: 18,
            color: colors.textSecondary,
        },
        quizModalContent: {
            flex: 1,
            padding: theme_1.Spacing.lg,
        },
    });
};
