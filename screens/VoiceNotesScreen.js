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
exports.default = VoiceNotesScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
var voiceNoteStore_1 = require("@/store/voiceNoteStore");
var NoteCard_1 = require("@/components/NoteCard");
function VoiceNotesScreen() {
    var _this = this;
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var _b = (0, voiceNoteStore_1.useVoiceNoteStore)(), notes = _b.notes, loadNotes = _b.loadNotes, deleteNote = _b.deleteNote, toggleStar = _b.toggleStar;
    var _c = (0, react_1.useState)(''), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = (0, react_1.useState)('all'), filter = _d[0], setFilter = _d[1];
    var _e = (0, react_1.useState)(true), loading = _e[0], setLoading = _e[1];
    (0, react_1.useEffect)(function () {
        loadNotes().then(function () { return setLoading(false); });
    }, [loadNotes]);
    var filteredNotes = (0, react_1.useMemo)(function () {
        var filtered = notes;
        if (searchQuery.trim()) {
            var lowerQuery_1 = searchQuery.toLowerCase();
            filtered = filtered.filter(function (note) {
                return note.title.toLowerCase().includes(lowerQuery_1) ||
                    note.summarizedContent.toLowerCase().includes(lowerQuery_1) ||
                    note.tags.some(function (tag) { return tag.toLowerCase().includes(lowerQuery_1); });
            });
        }
        if (filter === 'starred') {
            filtered = filtered.filter(function (note) { return note.isStarred; });
        }
        return __spreadArray([], filtered, true).sort(function (a, b) { return b.updatedAt - a.updatedAt; });
    }, [notes, searchQuery, filter]);
    var handleDelete = function (id) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deleteNote(id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleToggleStar = function (id) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, toggleStar(id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var styles = getStyles(colors, isDark);
    return (<react_native_1.View style={styles.container}>
      {/* Header */}
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.headerTitle}>Voice Notes</react_native_1.Text>
        <react_native_1.Text style={styles.headerSubtitle}>
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </react_native_1.Text>
      </react_native_1.View>

      {/* Search Bar */}
      <react_native_1.View style={styles.searchContainer}>
        <react_native_1.TextInput style={styles.searchInput} placeholder="Search notes..." placeholderTextColor={colors.textSecondary} value={searchQuery} onChangeText={setSearchQuery}/>
      </react_native_1.View>

      {/* Filter Tabs */}
      <react_native_1.View style={styles.filterTabs}>
        <react_native_1.TouchableOpacity style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]} onPress={function () { return setFilter('all'); }}>
          <react_native_1.Text style={[styles.filterTabText, filter === 'all' && styles.activeFilterTabText]}>
            All
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
        <react_native_1.TouchableOpacity style={[styles.filterTab, filter === 'starred' && styles.activeFilterTab]} onPress={function () { return setFilter('starred'); }}>
          <react_native_1.Text style={[styles.filterTabText, filter === 'starred' && styles.activeFilterTabText]}>
            ⭐ Starred
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      {/* Notes List */}
      {loading ? (<react_native_1.View style={styles.centerContainer}>
          <react_native_1.ActivityIndicator size="large" color={colors.primary}/>
        </react_native_1.View>) : filteredNotes.length === 0 ? (<react_native_1.View style={styles.centerContainer}>
          <react_native_1.Text style={styles.emptyIcon}>📝</react_native_1.Text>
          <react_native_1.Text style={styles.emptyTitle}>No Notes Yet</react_native_1.Text>
          <react_native_1.Text style={styles.emptyText}>
            Start recording voice notes from the chat screen!
          </react_native_1.Text>
        </react_native_1.View>) : (<react_native_1.FlatList data={filteredNotes} keyExtractor={function (item) { return item.id; }} renderItem={function (_a) {
                var item = _a.item;
                return (<NoteCard_1.default note={item} onDelete={handleDelete} onToggleStar={handleToggleStar}/>);
            }} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={true}/>)}
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: theme_1.Spacing.lg,
        paddingTop: theme_1.Spacing.xl,
        paddingBottom: theme_1.Spacing.md,
    },
    headerTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: theme_1.Spacing.xs,
    },
    headerSubtitle: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
    },
    searchContainer: {
        paddingHorizontal: theme_1.Spacing.lg,
        marginBottom: theme_1.Spacing.md,
    },
    searchInput: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        paddingHorizontal: theme_1.Spacing.lg,
        paddingVertical: theme_1.Spacing.md,
        fontSize: theme_1.FontSizes.md,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    filterTabs: {
        flexDirection: 'row',
        paddingHorizontal: theme_1.Spacing.lg,
        marginBottom: theme_1.Spacing.md,
        gap: theme_1.Spacing.sm,
    },
    filterTab: {
        flex: 1,
        paddingVertical: theme_1.Spacing.sm,
        paddingHorizontal: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.md,
        backgroundColor: colors.cardBackground,
        alignItems: 'center',
    },
    activeFilterTab: {
        backgroundColor: colors.primary,
    },
    filterTabText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.text,
    },
    activeFilterTabText: {
        color: colors.white,
    },
    listContent: {
        paddingHorizontal: theme_1.Spacing.lg,
        paddingBottom: theme_1.Spacing.xl,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme_1.Spacing.xxl,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: theme_1.Spacing.lg,
    },
    emptyTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.semibold,
        color: isDark ? colors.text : colors.charcoal,
        marginBottom: theme_1.Spacing.sm,
    },
    emptyText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: theme_1.Spacing.xl,
    },
}); };
