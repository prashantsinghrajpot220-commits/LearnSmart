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
exports.TrendingQuestions = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var colors_1 = require("@/constants/colors");
var QASearchService_1 = require("@/services/QASearchService");
var SECTIONS = [
    { key: 'trending', title: 'Trending', icon: 'flame-outline' },
    { key: 'recent', title: 'Recently Asked', icon: 'time-outline' },
    { key: 'popular', title: 'Popular', icon: 'eye-outline' },
    { key: 'helpful', title: 'Most Helpful', icon: 'thumbs-up-outline' },
];
var TrendingQuestions = function (_a) {
    var onQuestionPress = _a.onQuestionPress, _b = _a.maxItems, maxItems = _b === void 0 ? 5 : _b;
    var router = (0, expo_router_1.useRouter)();
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), discoveryData = _d[0], setDiscoveryData = _d[1];
    var _e = (0, react_1.useState)('trending'), activeSection = _e[0], setActiveSection = _e[1];
    (0, react_1.useEffect)(function () {
        var fetchDiscovery = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, QASearchService_1.qaSearchService.getDiscoverySections()];
                    case 1:
                        data = _a.sent();
                        setDiscoveryData(data);
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Failed to fetch discovery data:', error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchDiscovery();
    }, []);
    var handleQuestionPress = function (questionId) {
        if (onQuestionPress) {
            onQuestionPress(questionId);
        }
        else {
            router.push({
                pathname: '/question-detail',
                params: { questionId: questionId },
            });
        }
    };
    var renderQuestionItem = function (_a) {
        var item = _a.item, index = _a.index;
        return (<react_native_1.TouchableOpacity style={styles.questionItem} onPress={function () { return handleQuestionPress(item.id); }}>
      <react_native_1.View style={styles.rankContainer}>
        <react_native_1.Text style={styles.rankText}>#{index + 1}</react_native_1.Text>
      </react_native_1.View>
      <react_native_1.View style={styles.questionContent}>
        <react_native_1.Text style={styles.questionTitle} numberOfLines={2}>
          {item.title}
        </react_native_1.Text>
        <react_native_1.View style={styles.questionMeta}>
          <react_native_1.View style={styles.metaItem}>
            <vector_icons_1.Ionicons name="chatbubble-outline" size={14} color={colors_1.Colors.light.textSecondary}/>
            <react_native_1.Text style={styles.metaText}>{item.answerCount || 0}</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.metaItem}>
            <vector_icons_1.Ionicons name="eye-outline" size={14} color={colors_1.Colors.light.textSecondary}/>
            <react_native_1.Text style={styles.metaText}>{item.viewCount || 0}</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
            <react_native_1.Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
              {item.difficulty}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
      <vector_icons_1.Ionicons name="chevron-forward" size={20} color={colors_1.Colors.light.textSecondary}/>
    </react_native_1.TouchableOpacity>);
    };
    if (loading) {
        return (<react_native_1.View style={styles.loadingContainer}>
        <react_native_1.ActivityIndicator size="small" color={colors_1.Colors.light.primary}/>
      </react_native_1.View>);
    }
    if (!discoveryData) {
        return null;
    }
    var currentQuestions = discoveryData[activeSection];
    return (<react_native_1.View style={styles.container}>
      {/* Section Tabs */}
      <react_native_2.ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionTabs} contentContainerStyle={styles.sectionTabsContent}>
        {SECTIONS.map(function (section) { return (<react_native_1.TouchableOpacity key={section.key} style={[
                styles.sectionTab,
                activeSection === section.key && styles.sectionTabActive,
            ]} onPress={function () { return setActiveSection(section.key); }}>
            <vector_icons_1.Ionicons name={section.icon} size={18} color={activeSection === section.key ? colors_1.Colors.light.primary : colors_1.Colors.light.textSecondary}/>
            <react_native_1.Text style={[
                styles.sectionTabText,
                activeSection === section.key && styles.sectionTabTextActive,
            ]}>
              {section.title}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>); })}
      </react_native_2.ScrollView>

      {/* Questions List */}
      {currentQuestions.length === 0 ? (<react_native_1.View style={styles.emptyContainer}>
          <vector_icons_1.Ionicons name="chatbubbles-outline" size={40} color={colors_1.Colors.light.textSecondary}/>
          <react_native_1.Text style={styles.emptyText}>No questions yet</react_native_1.Text>
        </react_native_1.View>) : (<react_native_1.FlatList data={currentQuestions.slice(0, maxItems)} keyExtractor={function (item) { return item.id; }} renderItem={renderQuestionItem} scrollEnabled={false} contentContainerStyle={styles.questionsList}/>)}
    </react_native_1.View>);
};
exports.TrendingQuestions = TrendingQuestions;
var getDifficultyColor = function (difficulty) {
    switch (difficulty) {
        case 'easy': return colors_1.Colors.light.success;
        case 'medium': return colors_1.Colors.light.warning;
        case 'hard': return colors_1.Colors.light.error;
        default: return colors_1.Colors.light.textSecondary;
    }
};
var react_native_2 = require("react-native");
var styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: colors_1.Colors.light.cardBackground,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors_1.Colors.light.border,
        overflow: 'hidden',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTabs: {
        borderBottomWidth: 1,
        borderBottomColor: colors_1.Colors.light.border,
    },
    sectionTabsContent: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    sectionTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 4,
        gap: 6,
    },
    sectionTabActive: {
        backgroundColor: colors_1.Colors.light.primary + '15',
    },
    sectionTabText: {
        fontSize: 13,
        fontWeight: '500',
        color: colors_1.Colors.light.textSecondary,
    },
    sectionTabTextActive: {
        color: colors_1.Colors.light.primary,
    },
    questionsList: {
        padding: 12,
    },
    questionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: colors_1.Colors.light.background,
    },
    rankContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors_1.Colors.light.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors_1.Colors.light.primary,
    },
    questionContent: {
        flex: 1,
        marginRight: 8,
    },
    questionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors_1.Colors.light.text,
        marginBottom: 6,
        lineHeight: 20,
    },
    questionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: colors_1.Colors.light.textSecondary,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: colors_1.Colors.light.textSecondary,
    },
});
exports.default = exports.TrendingQuestions;
