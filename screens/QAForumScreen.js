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
exports.QAForumScreen = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var expo_router_1 = require("expo-router");
var ThemeContext_1 = require("@/components/ThemeContext");
var QuestionCard_1 = require("@/components/QuestionCard");
var QAPhotoUpload_1 = require("@/components/QAPhotoUpload");
var SearchBar_1 = require("@/components/SearchBar");
var QuestionFilters_1 = require("@/components/QuestionFilters");
var TrendingQuestions_1 = require("@/components/TrendingQuestions");
var FavoriteQuestions_1 = require("@/components/FavoriteQuestions");
var QAForumService_1 = require("@/services/QAForumService");
var QASearchService_1 = require("@/services/QASearchService");
var errorLogger_1 = require("@/utils/errorLogger");
var QAForumScreen = function () {
    var insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    var router = (0, expo_router_1.useRouter)();
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var styles = getStyles(colors, isDark);
    // Main data
    var _b = (0, react_1.useState)([]), allQuestions = _b[0], setAllQuestions = _b[1];
    var _c = (0, react_1.useState)([]), displayQuestions = _c[0], setDisplayQuestions = _c[1];
    var _d = (0, react_1.useState)(null), searchResult = _d[0], setSearchResult = _d[1];
    var _e = (0, react_1.useState)([]), subjects = _e[0], setSubjects = _e[1];
    var _f = (0, react_1.useState)([]), topics = _f[0], setTopics = _f[1];
    // UI states
    var _g = (0, react_1.useState)(true), loading = _g[0], setLoading = _g[1];
    var _h = (0, react_1.useState)(false), searching = _h[0], setSearching = _h[1];
    var _j = (0, react_1.useState)(false), refreshing = _j[0], setRefreshing = _j[1];
    var _k = (0, react_1.useState)('all'), viewMode = _k[0], setViewMode = _k[1];
    // Search & filter states
    var _l = (0, react_1.useState)(''), searchQuery = _l[0], setSearchQuery = _l[1];
    var _m = (0, react_1.useState)({
        difficulties: [],
        status: [],
        subject: '',
        topic: '',
    }), filters = _m[0], setFilters = _m[1];
    var _o = (0, react_1.useState)(false), showFilters = _o[0], setShowFilters = _o[1];
    // const [showTrending, setShowTrending] = useState(true); // Future feature: toggle trending section
    // Post modal
    var _p = (0, react_1.useState)(false), isPostModalVisible = _p[0], setIsPostModalVisible = _p[1];
    var _q = (0, react_1.useState)(''), title = _q[0], setTitle = _q[1];
    var _r = (0, react_1.useState)(''), description = _r[0], setDescription = _r[1];
    var _s = (0, react_1.useState)(''), subject = _s[0], setSubjectInput = _s[1];
    var _t = (0, react_1.useState)(''), topic = _t[0], setTopicInput = _t[1];
    var _u = (0, react_1.useState)('medium'), difficulty = _u[0], setDifficulty = _u[1];
    var _v = (0, react_1.useState)(null), attachment = _v[0], setAttachment = _v[1];
    var _w = (0, react_1.useState)(false), posting = _w[0], setPosting = _w[1];
    // Pagination
    var _x = (0, react_1.useState)(1), currentPage = _x[0], setCurrentPage = _x[1];
    var _y = (0, react_1.useState)(false), hasMore = _y[0], setHasMore = _y[1];
    // Load initial data
    (0, react_1.useEffect)(function () {
        loadQuestions();
        loadSubjects();
    }, []);
    // Update display when filters change
    (0, react_1.useEffect)(function () {
        if (viewMode === 'all') {
            var applyFiltersAsync = function () { return __awaiter(void 0, void 0, void 0, function () {
                var result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setSearching(true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, QASearchService_1.qaSearchService.search({
                                    keyword: searchQuery,
                                    filters: {
                                        difficulties: filters.difficulties,
                                        status: filters.status,
                                    },
                                    subject: filters.subject || undefined,
                                    topic: filters.topic || undefined,
                                    page: 1,
                                    limit: 20,
                                })];
                        case 2:
                            result = _a.sent();
                            setSearchResult(result);
                            setDisplayQuestions(result.questions);
                            setCurrentPage(1);
                            setHasMore(result.hasMore);
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            (0, errorLogger_1.logError)(error_1, { context: 'Failed to apply filters' });
                            return [3 /*break*/, 5];
                        case 4:
                            setSearching(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            applyFiltersAsync();
        }
    }, [filters, searchQuery, viewMode]);
    // Load subjects for filter dropdown
    var loadSubjects = function () { return __awaiter(void 0, void 0, void 0, function () {
        var loadedSubjects, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, QASearchService_1.qaSearchService.getAllSubjects()];
                case 1:
                    loadedSubjects = _a.sent();
                    setSubjects(loadedSubjects);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    (0, errorLogger_1.logError)(error_2, { context: 'Failed to load subjects' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Load topics when subject changes
    (0, react_1.useEffect)(function () {
        var loadTopics = function () { return __awaiter(void 0, void 0, void 0, function () {
            var loadedTopics, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!filters.subject) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, QASearchService_1.qaSearchService.getTopicsForSubject(filters.subject)];
                    case 2:
                        loadedTopics = _a.sent();
                        setTopics(loadedTopics);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        (0, errorLogger_1.logError)(error_3, { context: 'Failed to load topics' });
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        setTopics([]);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        loadTopics();
    }, [filters.subject]);
    var loadQuestions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var questions, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, QAForumService_1.qaForumService.getQuestions()];
                case 1:
                    questions = _a.sent();
                    setAllQuestions(questions);
                    setDisplayQuestions(questions.slice(0, 20));
                    setHasMore(questions.length > 20);
                    return [3 /*break*/, 4];
                case 2:
                    error_4 = _a.sent();
                    (0, errorLogger_1.logError)(error_4, { context: 'Failed to load questions' });
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var performSearch = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (searchPage) {
            var result_1, error_5;
            if (searchPage === void 0) { searchPage = 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setSearching(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, QASearchService_1.qaSearchService.search({
                                keyword: searchQuery,
                                filters: {
                                    difficulties: filters.difficulties,
                                    status: filters.status,
                                },
                                subject: filters.subject || undefined,
                                topic: filters.topic || undefined,
                                page: searchPage,
                                limit: 20,
                            })];
                    case 2:
                        result_1 = _a.sent();
                        setSearchResult(result_1);
                        if (searchPage === 1) {
                            setDisplayQuestions(result_1.questions);
                            setCurrentPage(1);
                        }
                        else {
                            setDisplayQuestions(function (prev) { return __spreadArray(__spreadArray([], prev, true), result_1.questions, true); });
                        }
                        setHasMore(result_1.hasMore);
                        return [3 /*break*/, 5];
                    case 3:
                        error_5 = _a.sent();
                        (0, errorLogger_1.logError)(error_5, { context: 'Failed to search' });
                        return [3 /*break*/, 5];
                    case 4:
                        setSearching(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    var handleSearch = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (viewMode !== 'search') {
                        setViewMode('search');
                    }
                    return [4 /*yield*/, performSearch(1)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleClearSearch = function () {
        setSearchQuery('');
        setFilters({
            difficulties: [],
            status: [],
            subject: '',
            topic: '',
        });
        setViewMode('all');
        setDisplayQuestions(allQuestions.slice(0, 20));
        setSearchResult(null);
    };
    var handleFiltersChange = function (newFilters) {
        setFilters(newFilters);
    };
    var handleClearFilters = function () {
        setFilters({
            difficulties: [],
            status: [],
            subject: '',
            topic: '',
        });
    };
    var loadMoreQuestions = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!hasMore || searching)
                        return [2 /*return*/];
                    return [4 /*yield*/, performSearch(currentPage + 1)];
                case 1:
                    _a.sent();
                    setCurrentPage(function (prev) { return prev + 1; });
                    return [2 /*return*/];
            }
        });
    }); };
    var onRefresh = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRefreshing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 6, 7]);
                    return [4 /*yield*/, loadQuestions()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadSubjects()];
                case 3:
                    _a.sent();
                    if (!(viewMode === 'search')) return [3 /*break*/, 5];
                    return [4 /*yield*/, performSearch(1)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    setRefreshing(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateQuestion = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_6, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!title || !description || !subject || !topic) {
                        react_native_1.Alert.alert('Error', 'Please fill in all fields');
                        return [2 /*return*/];
                    }
                    setPosting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, QAForumService_1.qaForumService.createQuestion({
                            title: title,
                            description: description,
                            subject: subject,
                            topic: topic,
                            difficulty: difficulty,
                            photo: attachment === null || attachment === void 0 ? void 0 : attachment.uri,
                        })];
                case 2:
                    _a.sent();
                    setIsPostModalVisible(false);
                    resetForm();
                    return [4 /*yield*/, loadSubjects()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_6 = _a.sent();
                    message = error_6 instanceof Error ? error_6.message : 'An unexpected error occurred';
                    react_native_1.Alert.alert('Error', message);
                    return [3 /*break*/, 6];
                case 5:
                    setPosting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var resetForm = function () {
        setTitle('');
        setDescription('');
        setSubjectInput('');
        setTopicInput('');
        setDifficulty('medium');
        setAttachment(null);
    };
    var handleQuestionPress = function (questionId) {
        router.push({
            pathname: '/question-detail',
            params: { questionId: questionId },
        });
    };
    var renderQuestionItem = function (_a) {
        var item = _a.item;
        return (<QuestionCard_1.QuestionCard question={item} onPress={function () { return handleQuestionPress(item.id); }}/>);
    };
    var renderFooter = function () {
        if (!hasMore)
            return null;
        return (<react_native_1.View style={styles.loadMoreContainer}>
        <react_native_1.TouchableOpacity style={styles.loadMoreBtn} onPress={loadMoreQuestions}>
          <react_native_1.Text style={styles.loadMoreText}>Load More</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    };
    var renderEmptyState = function () { return (<react_native_1.View style={styles.emptyContainer}>
      <vector_icons_1.Ionicons name="search-outline" size={64} color={colors.textSecondary}/>
      <react_native_1.Text style={styles.emptyTitle}>
        {searchQuery ? 'No Results Found' : 'No Questions Yet'}
      </react_native_1.Text>
      <react_native_1.Text style={styles.emptySubtitle}>
        {searchQuery
            ? "No questions match \"".concat(searchQuery, "\"")
            : 'Be the first to ask a question!'}
      </react_native_1.Text>
      {!searchQuery && (<react_native_1.TouchableOpacity style={styles.askBtn} onPress={function () { return setIsPostModalVisible(true); }}>
          <react_native_1.Text style={styles.askBtnText}>Ask a Question</react_native_1.Text>
        </react_native_1.TouchableOpacity>)}
    </react_native_1.View>); };
    return (<react_native_1.View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.headerTitle}>Q&A Forum</react_native_1.Text>
        <react_native_1.TouchableOpacity style={styles.postBtn} onPress={function () { return setIsPostModalVisible(true); }}>
          <vector_icons_1.Ionicons name="add" size={24} color="white"/>
          <react_native_1.Text style={styles.postBtnText}>Ask</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      {/* Search Bar */}
      <react_native_1.View style={styles.searchContainer}>
        <SearchBar_1.SearchBar value={searchQuery} onChangeText={setSearchQuery} onSubmit={handleSearch} onSuggestions={function () { }}/>
      </react_native_1.View>

      {/* Filter Toggle */}
      <react_native_1.TouchableOpacity style={styles.filterToggle} onPress={function () { return setShowFilters(!showFilters); }}>
        <vector_icons_1.Ionicons name="options-outline" size={18} color={colors.primary}/>
        <react_native_1.Text style={styles.filterToggleText}>Filters</react_native_1.Text>
        <vector_icons_1.Ionicons name={showFilters ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary}/>
      </react_native_1.TouchableOpacity>

      {/* Filters */}
      {showFilters && (<QuestionFilters_1.QuestionFilters difficulties={filters.difficulties} status={filters.status} subject={filters.subject} topic={filters.topic} subjects={subjects} topics={topics} onFiltersChange={handleFiltersChange} onClear={handleClearFilters}/>)}

      {/* View Mode Tabs */}
      <react_native_1.View style={styles.viewModeTabs}>
        <react_native_1.TouchableOpacity style={[styles.viewModeTab, viewMode === 'all' && styles.viewModeTabActive]} onPress={function () {
            setViewMode('all');
            setDisplayQuestions(allQuestions.slice(0, 20));
            setSearchResult(null);
        }}>
          <react_native_1.Text style={[styles.viewModeTabText, viewMode === 'all' && styles.viewModeTabTextActive]}>
            All Questions
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
        <react_native_1.TouchableOpacity style={[styles.viewModeTab, viewMode === 'search' && styles.viewModeTabActive]} onPress={handleSearch}>
          <react_native_1.Text style={[styles.viewModeTabText, viewMode === 'search' && styles.viewModeTabTextActive]}>
            Search Results
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
        <react_native_1.TouchableOpacity style={[styles.viewModeTab, viewMode === 'favorites' && styles.viewModeTabActive]} onPress={function () { return setViewMode('favorites'); }}>
          <vector_icons_1.Ionicons name="bookmark-outline" size={16} color={viewMode === 'favorites' ? colors.primary : colors.textSecondary}/>
          <react_native_1.Text style={[styles.viewModeTabText, viewMode === 'favorites' && styles.viewModeTabTextActive]}>
            Saved
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      {/* Results Count */}
      {searchResult && (<react_native_1.View style={styles.resultsCount}>
          <react_native_1.Text style={styles.resultsCountText}>
            {searchResult.totalCount} result{searchResult.totalCount !== 1 ? 's' : ''} found
          </react_native_1.Text>
          {searchQuery && (<react_native_1.TouchableOpacity onPress={handleClearSearch}>
              <react_native_1.Text style={styles.clearSearchText}>Clear Search</react_native_1.Text>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>)}

      {/* Trending Section (only in 'all' mode) */}
      {viewMode === 'all' && (<TrendingQuestions_1.TrendingQuestions onQuestionPress={handleQuestionPress} maxItems={5}/>)}

      {/* Favorites Section */}
      {viewMode === 'favorites' ? (<FavoriteQuestions_1.FavoriteQuestions onQuestionPress={handleQuestionPress} onEmpty={function () { return setViewMode('all'); }}/>) : loading ? (<react_native_1.View style={styles.center}>
          <react_native_1.ActivityIndicator size="large" color={colors.primary}/>
        </react_native_1.View>) : (<react_native_1.FlatList data={displayQuestions} keyExtractor={function (item) { return item.id; }} renderItem={renderQuestionItem} ListFooterComponent={renderFooter} ListEmptyComponent={renderEmptyState} contentContainerStyle={styles.listContent} refreshControl={<react_native_1.RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} onEndReached={loadMoreQuestions} onEndReachedThreshold={0.5}/>)}

      {/* Post Question Modal */}
      <react_native_1.Modal visible={isPostModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={function () { return setIsPostModalVisible(false); }}>
        <react_native_1.View style={styles.modalContainer}>
          <react_native_1.View style={styles.modalHeader}>
            <react_native_1.TouchableOpacity onPress={function () { return setIsPostModalVisible(false); }}>
              <react_native_1.Text style={styles.cancelText}>Cancel</react_native_1.Text>
            </react_native_1.TouchableOpacity>
            <react_native_1.Text style={styles.modalTitle}>Ask a Question</react_native_1.Text>
            <react_native_1.TouchableOpacity onPress={handleCreateQuestion} disabled={posting}>
              <react_native_1.Text style={[styles.submitText, posting && { opacity: 0.5 }]}>Post</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>

          <react_native_1.ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
            <react_native_1.TextInput style={styles.titleInput} placeholder="Question Title (e.g. How to solve quadratic equations?)" value={title} onChangeText={setTitle} maxLength={100}/>

            <react_native_1.TextInput style={styles.descriptionInput} placeholder="Describe your question in detail..." value={description} onChangeText={setDescription} multiline textAlignVertical="top"/>

            <react_native_1.View style={styles.row}>
              <react_native_1.View style={styles.inputGroup}>
                <react_native_1.Text style={styles.label}>Subject</react_native_1.Text>
                <react_native_1.TextInput style={styles.smallInput} placeholder="e.g. Math" value={subject} onChangeText={setSubjectInput}/>
              </react_native_1.View>
              <react_native_1.View style={styles.inputGroup}>
                <react_native_1.Text style={styles.label}>Topic</react_native_1.Text>
                <react_native_1.TextInput style={styles.smallInput} placeholder="e.g. Algebra" value={topic} onChangeText={setTopicInput}/>
              </react_native_1.View>
            </react_native_1.View>

            <react_native_1.Text style={styles.label}>Difficulty</react_native_1.Text>
            <react_native_1.View style={styles.difficultyRow}>
              {['easy', 'medium', 'hard'].map(function (d) { return (<react_native_1.TouchableOpacity key={d} style={[
                styles.difficultyBtn,
                difficulty === d && styles.difficultyBtnActive,
                difficulty === d && { borderColor: d === 'easy' ? colors.success : d === 'medium' ? colors.warning : colors.error }
            ]} onPress={function () { return setDifficulty(d); }}>
                  <react_native_1.Text style={[
                styles.difficultyBtnText,
                difficulty === d && { color: d === 'easy' ? colors.success : d === 'medium' ? colors.warning : colors.error }
            ]}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </react_native_1.Text>
                </react_native_1.TouchableOpacity>); })}
            </react_native_1.View>

            <react_native_1.Text style={styles.label}>Attachment (Optional)</react_native_1.Text>
            <QAPhotoUpload_1.QAPhotoUpload attachment={attachment} onAttachment={setAttachment} onRemove={function () { return setAttachment(null); }}/>
            
            {posting && <react_native_1.ActivityIndicator style={{ marginTop: 20 }} color={colors.primary}/>}
          </react_native_1.ScrollView>
        </react_native_1.View>
      </react_native_1.Modal>
    </react_native_1.View>);
};
exports.QAForumScreen = QAForumScreen;
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    postBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
    },
    postBtnText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 6,
    },
    filterToggleText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
    },
    viewModeTabs: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
    },
    viewModeTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 6,
    },
    viewModeTabActive: {
        backgroundColor: colors.primary + '15',
        borderColor: colors.primary,
    },
    viewModeTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    viewModeTabTextActive: {
        color: colors.primary,
    },
    resultsCount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    resultsCountText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    clearSearchText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    emptySubtitle: {
        marginTop: 8,
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    askBtn: {
        marginTop: 20,
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    askBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    loadMoreContainer: {
        padding: 16,
        alignItems: 'center',
    },
    loadMoreBtn: {
        backgroundColor: colors.primary + '15',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    loadMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    cancelText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    submitText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    modalScroll: {
        flex: 1,
    },
    modalContent: {
        padding: 20,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 20,
    },
    descriptionInput: {
        fontSize: 16,
        color: colors.text,
        minHeight: 120,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 8,
    },
    smallInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: colors.text,
        backgroundColor: isDark ? '#333' : '#FFFFFF',
    },
    difficultyRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    difficultyBtn: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: isDark ? '#222' : '#F9F9F9',
    },
    difficultyBtnActive: {
        backgroundColor: isDark ? '#444' : '#f0f0f0',
        borderWidth: 2,
    },
    difficultyBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
}); };
