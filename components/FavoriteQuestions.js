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
exports.FavoriteQuestions = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var colors_1 = require("@/constants/colors");
var QuestionCard_1 = require("./QuestionCard");
var userStore_1 = require("@/store/userStore");
var QAForumService_1 = require("@/services/QAForumService");
var FavoriteQuestions = function (_a) {
    var onQuestionPress = _a.onQuestionPress, onEmpty = _a.onEmpty;
    var router = (0, expo_router_1.useRouter)();
    var _b = (0, userStore_1.useUserStore)(), favoriteQuestions = _b.favoriteQuestions, removeFromFavorites = _b.removeFromFavorites;
    var _c = (0, react_1.useState)([]), favorites = _c[0], setFavorites = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    (0, react_1.useEffect)(function () {
        var loadFavorites = function () { return __awaiter(void 0, void 0, void 0, function () {
            var questions, favoriteQuestionsList, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, QAForumService_1.qaForumService.getQuestions()];
                    case 1:
                        questions = _a.sent();
                        favoriteQuestionsList = questions.filter(function (q) {
                            return favoriteQuestions.includes(q.id);
                        });
                        setFavorites(favoriteQuestionsList);
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Failed to load favorites:', error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadFavorites();
    }, [favoriteQuestions]);
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
    var handleRemoveFavorite = function (questionId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, removeFromFavorites(questionId)];
                case 1:
                    _a.sent();
                    setFavorites(function (prev) { return prev.filter(function (q) { return q.id !== questionId; }); });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Failed to remove favorite:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var renderQuestionCard = function (_a) {
        var item = _a.item;
        return (<react_native_1.View style={styles.cardWrapper}>
      <react_native_1.TouchableOpacity style={styles.favoriteButton} onPress={function () { return handleRemoveFavorite(item.id); }}>
        <vector_icons_1.Ionicons name="bookmark" size={20} color={colors_1.Colors.light.primary}/>
      </react_native_1.TouchableOpacity>
      <QuestionCard_1.QuestionCard question={item} onPress={function () { return handleQuestionPress(item.id); }}/>
    </react_native_1.View>);
    };
    if (loading) {
        return (<react_native_1.View style={styles.loadingContainer}>
        <react_native_1.ActivityIndicator size="small" color={colors_1.Colors.light.primary}/>
      </react_native_1.View>);
    }
    if (favorites.length === 0) {
        return (<react_native_1.View style={styles.emptyContainer}>
        <vector_icons_1.Ionicons name="bookmark-outline" size={48} color={colors_1.Colors.light.textSecondary}/>
        <react_native_1.Text style={styles.emptyTitle}>No Saved Questions</react_native_1.Text>
        <react_native_1.Text style={styles.emptySubtitle}>
          Bookmark questions you want to revisit later
        </react_native_1.Text>
        {onEmpty && (<react_native_1.TouchableOpacity style={styles.browseButton} onPress={onEmpty}>
            <react_native_1.Text style={styles.browseButtonText}>Browse Questions</react_native_1.Text>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.title}>Saved Questions</react_native_1.Text>
        <react_native_1.View style={styles.countBadge}>
          <react_native_1.Text style={styles.countText}>{favorites.length}</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.FlatList data={favorites} keyExtractor={function (item) { return item.id; }} renderItem={renderQuestionCard} scrollEnabled={false} contentContainerStyle={styles.listContent} ListFooterComponent={favorites.length > 0 ? (<react_native_1.View style={styles.footer}>
              <react_native_1.Text style={styles.footerText}>
                Tap the bookmark to remove from favorites
              </react_native_1.Text>
            </react_native_1.View>) : null}/>
    </react_native_1.View>);
};
exports.FavoriteQuestions = FavoriteQuestions;
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
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors_1.Colors.light.border,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors_1.Colors.light.text,
    },
    countBadge: {
        backgroundColor: colors_1.Colors.light.primary + '20',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors_1.Colors.light.primary,
    },
    cardWrapper: {
        position: 'relative',
    },
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
        padding: 4,
        backgroundColor: colors_1.Colors.light.cardBackground,
        borderRadius: 12,
    },
    listContent: {
        padding: 12,
    },
    footer: {
        padding: 12,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: colors_1.Colors.light.textSecondary,
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: colors_1.Colors.light.text,
    },
    emptySubtitle: {
        marginTop: 8,
        fontSize: 14,
        color: colors_1.Colors.light.textSecondary,
        textAlign: 'center',
    },
    browseButton: {
        marginTop: 20,
        backgroundColor: colors_1.Colors.light.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    browseButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
});
exports.default = exports.FavoriteQuestions;
