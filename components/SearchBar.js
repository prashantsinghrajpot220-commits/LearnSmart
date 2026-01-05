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
exports.SearchBar = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var colors_1 = require("@/constants/colors");
var QASearchService_1 = require("@/services/QASearchService");
var SearchBar = function (_a) {
    var value = _a.value, onChangeText = _a.onChangeText, onSubmit = _a.onSubmit, _b = _a.placeholder, placeholder = _b === void 0 ? 'Search questions...' : _b, onSuggestions = _a.onSuggestions;
    var _c = (0, react_1.useState)([]), suggestions = _c[0], setSuggestions = _c[1];
    var _d = (0, react_1.useState)(false), showSuggestions = _d[0], setShowSuggestions = _d[1];
    var _e = (0, react_1.useState)(false), isSearching = _e[0], setIsSearching = _e[1];
    var fadeAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    var debounceRef = (0, react_1.useRef)(null);
    var performSearch = (0, react_1.useCallback)(function (keyword) { return __awaiter(void 0, void 0, void 0, function () {
        var results, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(keyword.trim().length >= 2)) return [3 /*break*/, 6];
                    setIsSearching(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, QASearchService_1.qaSearchService.getSuggestions(keyword)];
                case 2:
                    results = _a.sent();
                    setSuggestions(results);
                    setShowSuggestions(results.length > 0);
                    onSuggestions === null || onSuggestions === void 0 ? void 0 : onSuggestions(results);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Search suggestions error:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSearching(false);
                    return [7 /*endfinally*/];
                case 5: return [3 /*break*/, 7];
                case 6:
                    setSuggestions([]);
                    setShowSuggestions(false);
                    onSuggestions === null || onSuggestions === void 0 ? void 0 : onSuggestions([]);
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); }, [onSuggestions]);
    var handleChangeText = function (text) {
        onChangeText(text);
        // Clear previous debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        // Debounce search suggestions (400ms)
        debounceRef.current = setTimeout(function () {
            performSearch(text);
        }, 400);
    };
    var handleSubmit = function () {
        react_native_1.Keyboard.dismiss();
        setShowSuggestions(false);
        onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit();
    };
    var handleClear = function () {
        onChangeText('');
        setSuggestions([]);
        setShowSuggestions(false);
        react_native_1.Keyboard.dismiss();
    };
    var handleSuggestionPress = function (suggestion) {
        onChangeText(suggestion);
        setShowSuggestions(false);
        react_native_1.Keyboard.dismiss();
        onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit();
    };
    (0, react_1.useEffect)(function () {
        if (showSuggestions) {
            react_native_1.Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
        else {
            react_native_1.Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [showSuggestions, fadeAnim]);
    (0, react_1.useEffect)(function () {
        return function () {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.searchContainer}>
        <vector_icons_1.Ionicons name="search" size={20} color={colors_1.Colors.light.textSecondary} style={styles.searchIcon}/>
        <react_native_1.TextInput style={styles.input} value={value} onChangeText={handleChangeText} placeholder={placeholder} placeholderTextColor={colors_1.Colors.light.textSecondary} returnKeyType="search" onSubmitEditing={handleSubmit} autoCapitalize="none" autoCorrect={false}/>
        {isSearching && (<react_native_1.Animated.View style={[styles.loadingIndicator, { opacity: fadeAnim }]}>
            <react_native_1.ActivityIndicator size="small" color={colors_1.Colors.light.primary}/>
          </react_native_1.Animated.View>)}
        {value.length > 0 && !isSearching && (<react_native_1.TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <vector_icons_1.Ionicons name="close-circle" size={20} color={colors_1.Colors.light.textSecondary}/>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>

      {showSuggestions && (<react_native_1.Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}>
          {suggestions.map(function (suggestion, index) { return (<react_native_1.TouchableOpacity key={"".concat(suggestion, "-").concat(index)} style={styles.suggestionItem} onPress={function () { return handleSuggestionPress(suggestion); }}>
              <vector_icons_1.Ionicons name="search" size={16} color={colors_1.Colors.light.textSecondary}/>
              <react_native_1.Text style={styles.suggestionText} numberOfLines={1}>
                {suggestion}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>); })}
        </react_native_1.Animated.View>)}
    </react_native_1.View>);
};
exports.SearchBar = SearchBar;
var styles = react_native_1.StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1000,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors_1.Colors.light.cardBackground,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: colors_1.Colors.light.border,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors_1.Colors.light.text,
        padding: 0,
    },
    loadingIndicator: {
        marginLeft: 8,
    },
    clearButton: {
        padding: 4,
        marginLeft: 8,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 54,
        left: 0,
        right: 0,
        backgroundColor: colors_1.Colors.light.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors_1.Colors.light.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors_1.Colors.light.border,
    },
    suggestionText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: colors_1.Colors.light.text,
    },
});
exports.default = exports.SearchBar;
