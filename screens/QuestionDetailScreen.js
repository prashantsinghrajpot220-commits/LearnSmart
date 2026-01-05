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
exports.QuestionDetailScreen = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var expo_router_1 = require("expo-router");
var ThemeContext_1 = require("../components/ThemeContext");
var QAForumService_1 = require("@/services/QAForumService");
var AnswerCard_1 = require("@/components/AnswerCard");
var userStore_1 = require("@/store/userStore");
var QAPhotoUpload_1 = require("@/components/QAPhotoUpload");
var QuestionDetailScreen = function () {
    var questionId = (0, expo_router_1.useLocalSearchParams)().questionId;
    var insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    var router = (0, expo_router_1.useRouter)();
    var userVotes = (0, userStore_1.useUserStore)().userVotes;
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var styles = getStyles(colors, isDark);
    var _b = (0, react_1.useState)(null), question = _b[0], setQuestion = _b[1];
    var _c = (0, react_1.useState)([]), answers = _c[0], setAnswers = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)('helpfulness'), sortBy = _e[0], setSortBy = _e[1];
    var _f = (0, react_1.useState)(''), answerText = _f[0], setAnswerText = _f[1];
    var _g = (0, react_1.useState)(null), attachment = _g[0], setAttachment = _g[1];
    var _h = (0, react_1.useState)(false), posting = _h[0], setPosting = _h[1];
    (0, react_1.useEffect)(function () {
        var fetchQuestion = function () { return __awaiter(void 0, void 0, void 0, function () {
            var q;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, QAForumService_1.qaForumService.getQuestion(questionId)];
                    case 1:
                        q = _a.sent();
                        if (!q) return [3 /*break*/, 3];
                        setQuestion(q);
                        return [4 /*yield*/, QAForumService_1.qaForumService.incrementViewCount(questionId)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        react_native_1.Alert.alert('Error', 'Question not found');
                        router.back();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchQuestion();
        if (questionId) {
            var unsubscribe = QAForumService_1.qaForumService.subscribeToAnswers(questionId, function (updatedAnswers) {
                setAnswers(QAForumService_1.qaForumService.sortAnswers(updatedAnswers, sortBy));
                setLoading(false);
            });
            return unsubscribe;
        }
    }, [questionId, sortBy, router]);
    var handlePostAnswer = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!answerText.trim() || !questionId)
                        return [2 /*return*/];
                    setPosting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, QAForumService_1.qaForumService.postAnswer(questionId, answerText, attachment === null || attachment === void 0 ? void 0 : attachment.uri)];
                case 2:
                    _a.sent();
                    setAnswerText('');
                    setAttachment(null);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    message = error_1 instanceof Error ? error_1.message : 'An unexpected error occurred';
                    react_native_1.Alert.alert('Error', message);
                    return [3 /*break*/, 5];
                case 4:
                    setPosting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleVote = function (answerId, type) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!questionId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, QAForumService_1.qaForumService.voteAnswer(questionId, answerId, type)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    message = error_2 instanceof Error ? error_2.message : 'An unexpected error occurred';
                    react_native_1.Alert.alert('Error', message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleMarkHelpful = function (answerId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!questionId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, QAForumService_1.qaForumService.markHelpful(questionId, answerId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    message = error_3 instanceof Error ? error_3.message : 'An unexpected error occurred';
                    react_native_1.Alert.alert('Error', message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading || !question) {
        return (<react_native_1.View style={styles.center}>
        <react_native_1.ActivityIndicator size="large" color={colors.primary}/>
      </react_native_1.View>);
    }
    var renderHeader = function () { return (<react_native_1.View style={styles.questionSection}>
      <react_native_1.View style={styles.questionHeader}>
        <react_native_1.View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(question.difficulty, colors) + '20' }]}>
          <react_native_1.Text style={[styles.difficultyText, { color: getDifficultyColor(question.difficulty, colors) }]}>
            {question.difficulty.toUpperCase()}
          </react_native_1.Text>
        </react_native_1.View>
        <react_native_1.Text style={styles.subjectText}>{question.subject} • {question.topic}</react_native_1.Text>
      </react_native_1.View>
      
      <react_native_1.Text style={styles.title}>{question.title}</react_native_1.Text>
      <react_native_1.Text style={styles.description}>{question.description}</react_native_1.Text>
      
      {question.photo && (<react_native_1.Image source={{ uri: question.photo }} style={styles.questionImage} resizeMode="contain"/>)}
      
      <react_native_1.View style={styles.questionFooter}>
        <react_native_1.Text style={styles.footerText}>Asked on {new Date(question.createdAt).toLocaleDateString()}</react_native_1.Text>
        <react_native_1.Text style={styles.footerText}>{question.viewCount} views</react_native_1.Text>
      </react_native_1.View>

      <react_native_1.View style={styles.answersHeader}>
        <react_native_1.Text style={styles.answersTitle}>{answers.length} Answers</react_native_1.Text>
        <react_native_1.View style={styles.sortContainer}>
          <react_native_1.TouchableOpacity onPress={function () { return setSortBy('helpfulness'); }}>
            <react_native_1.Text style={[styles.sortText, sortBy === 'helpfulness' && styles.sortTextActive]}>Helpful</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.Text style={styles.sortDivider}>|</react_native_1.Text>
          <react_native_1.TouchableOpacity onPress={function () { return setSortBy('recency'); }}>
            <react_native_1.Text style={[styles.sortText, sortBy === 'recency' && styles.sortTextActive]}>Newest</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>); };
    return (<react_native_1.KeyboardAvoidingView style={{ flex: 1 }} behavior={react_native_1.Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={react_native_1.Platform.OS === 'ios' ? 90 : 0}>
      <react_native_1.FlatList data={answers} keyExtractor={function (item) { return item.id; }} ListHeaderComponent={renderHeader} renderItem={function (_a) {
            var item = _a.item;
            return (<AnswerCard_1.AnswerCard answer={item} userVote={userVotes[item.id]} onVote={function (type) { return handleVote(item.id, type); }} onMarkHelpful={function () { return handleMarkHelpful(item.id); }}/>);
        }} contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 180 }]}/>

      <react_native_1.View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <QAPhotoUpload_1.QAPhotoUpload attachment={attachment} onAttachment={setAttachment} onRemove={function () { return setAttachment(null); }}/>
        <react_native_1.View style={styles.inputRow}>
          <react_native_1.TextInput style={styles.input} placeholder="Write your answer..." value={answerText} onChangeText={setAnswerText} multiline/>
          <react_native_1.TouchableOpacity style={[styles.sendBtn, (!answerText.trim() || posting) && styles.sendBtnDisabled]} onPress={handlePostAnswer} disabled={!answerText.trim() || posting}>
            {posting ? (<react_native_1.ActivityIndicator size="small" color="white"/>) : (<vector_icons_1.Ionicons name="send" size={20} color="white"/>)}
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.KeyboardAvoidingView>);
};
exports.QuestionDetailScreen = QuestionDetailScreen;
var getDifficultyColor = function (difficulty, colors) {
    switch (difficulty) {
        case 'easy': return colors.success;
        case 'medium': return colors.warning;
        case 'hard': return colors.error;
        default: return colors.textSecondary;
    }
};
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    listContent: {
        padding: 16,
        backgroundColor: colors.background,
    },
    questionSection: {
        marginBottom: 24,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: '700',
    },
    subjectText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
        lineHeight: 28,
    },
    description: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
        marginBottom: 16,
    },
    questionImage: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        backgroundColor: isDark ? '#333' : '#f0f0f0',
        marginBottom: 16,
    },
    questionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 16,
        marginBottom: 24,
    },
    footerText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    answersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    answersTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sortText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    sortTextActive: {
        color: colors.primary,
    },
    sortDivider: {
        color: colors.border,
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.cardBackground,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: isDark ? '#333' : '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingTop: 8,
        maxHeight: 100,
        fontSize: 15,
        color: colors.text,
    },
    sendBtn: {
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: colors.textSecondary,
        opacity: 0.5,
    },
}); };
