"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Chapters;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var curriculum_1 = require("@/constants/curriculum");
var ThemeContext_1 = require("@/components/ThemeContext");
var ChatContext_1 = require("@/context/ChatContext");
var BreadcrumbNav_1 = require("@/components/BreadcrumbNav");
var BooksGrid_1 = require("@/components/BooksGrid");
var booksData_1 = require("@/data/booksData");
function Chapters() {
    var router = (0, expo_router_1.useRouter)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, expo_router_1.useLocalSearchParams)(), subject = _a.subject, className = _a.class, isPathway = _a.isPathway;
    var setCurrentContext = (0, ChatContext_1.useSmartyContext)().setCurrentContext;
    var _b = (0, react_1.useState)([]), chapters = _b[0], setChapters = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)('chapters'), activeTab = _d[0], setActiveTab = _d[1];
    var books = (0, booksData_1.getBooksByPathwayName)(subject);
    var loadChapters = (0, react_1.useCallback)(function () {
        setLoading(true);
        var chapterList = [];
        if (className === 'Class 12+') {
            if (isPathway === 'true') {
                chapterList = (0, curriculum_1.getPathwayChapters)(subject, '');
            }
            else {
                chapterList = (0, curriculum_1.getPathwaysForCategory)(className, subject);
            }
        }
        else {
            chapterList = (0, curriculum_1.getChaptersForSubject)(className, subject);
        }
        setChapters(chapterList);
        setLoading(false);
    }, [className, isPathway, subject]);
    (0, react_1.useEffect)(function () {
        if (subject && className) {
            var timer_1 = setTimeout(function () {
                loadChapters();
                // Set chat context for chapters screen
                setCurrentContext(subject, undefined, undefined);
            }, 0);
            return function () { return clearTimeout(timer_1); };
        }
    }, [subject, className, loadChapters, setCurrentContext]);
    var handleChapterPress = function (chapter) {
        if (chapter.includes('Coming Soon') || chapter.includes('Select')) {
            return;
        }
        router.push({
            pathname: '/lesson',
            params: { chapter: chapter, subject: subject, class: className },
        });
    };
    var styles = getStyles(colors);
    if (loading) {
        return (<react_native_1.ScrollView style={styles.container} contentContainerStyle={styles.loadingContent}>
        <react_native_1.ActivityIndicator size="large" color={colors.primary}/>
      </react_native_1.ScrollView>);
    }
    var isClass12Plus = className === 'Class 12+';
    return (<react_native_1.View style={styles.container}>
      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <react_native_1.View style={styles.content}>
          <BreadcrumbNav_1.BreadcrumbNav paths={[
            { label: 'Home', path: '/home' },
            { label: subject || 'Chapters', path: '' }
        ]}/>
          <react_native_1.TouchableOpacity style={styles.backButton} onPress={function () { return router.back(); }} activeOpacity={0.7}>
            <react_native_1.Text style={styles.backButtonText}>← Back</react_native_1.Text>
          </react_native_1.TouchableOpacity>

          <react_native_1.Text style={isClass12Plus ? styles.titleDark : styles.title}>{subject}</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>{className || ''}</react_native_1.Text>

          {isClass12Plus && (<react_native_1.View style={styles.pathwayBadge}>
              <react_native_1.Text style={styles.pathwayBadgeText}>Pathway</react_native_1.Text>
            </react_native_1.View>)}

          {/* Tab Navigation for 12+ Pathways */}
          {isClass12Plus && (<react_native_1.View style={styles.tabContainer}>
              <react_native_1.TouchableOpacity style={[styles.tab, activeTab === 'chapters' && styles.tabActive]} onPress={function () { return setActiveTab('chapters'); }} activeOpacity={0.7}>
                <react_native_1.Text style={[styles.tabText, activeTab === 'chapters' && styles.tabTextActive]}>
                  Chapters
                </react_native_1.Text>
              </react_native_1.TouchableOpacity>
              <react_native_1.TouchableOpacity style={[styles.tab, activeTab === 'books' && styles.tabActive]} onPress={function () { return setActiveTab('books'); }} activeOpacity={0.7}>
                <react_native_1.Text style={[styles.tabText, activeTab === 'books' && styles.tabTextActive]}>
                  Books/Resources
                </react_native_1.Text>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>)}

          {activeTab === 'chapters' ? (<>
              <react_native_1.Text style={styles.sectionTitle}>
                {isClass12Plus ? 'Topics & Chapters' : 'Chapters'}
              </react_native_1.Text>

              <react_native_1.View style={styles.chapterList}>
                {chapters.map(function (chapter, index) { return (<react_native_1.TouchableOpacity key={index} style={[
                    styles.chapterCard,
                    isClass12Plus && styles.chapterCardDark,
                    (chapter.includes('Coming Soon') || chapter.includes('Select')) && styles.disabledCard,
                ]} onPress={function () { return handleChapterPress(chapter); }} activeOpacity={chapter.includes('Coming Soon') || chapter.includes('Select') ? 1 : 0.7} disabled={chapter.includes('Coming Soon') || chapter.includes('Select')}>
                    <react_native_1.View style={[
                    styles.chapterNumber,
                    isClass12Plus && styles.chapterNumberDark,
                ]}>
                      <react_native_1.Text style={styles.chapterNumberText}>{index + 1}</react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.Text style={[
                    styles.chapterName,
                    isClass12Plus && styles.chapterNameDark,
                ]}>
                      {chapter}
                    </react_native_1.Text>
                    <react_native_1.Text style={[
                    styles.chapterArrow,
                    isClass12Plus && styles.chapterArrowDark,
                ]}>
                      →
                    </react_native_1.Text>
                  </react_native_1.TouchableOpacity>); })}
              </react_native_1.View>

              {chapters.length > 0 && (chapters[0].includes('Coming Soon') || chapters[0].includes('Select')) && (<react_native_1.View style={styles.placeholderCard}>
                  <react_native_1.Text style={styles.placeholderTitle}>🚧 Coming Soon</react_native_1.Text>
                  <react_native_1.Text style={styles.placeholderText}>
                    Full curriculum content will be added soon
                  </react_native_1.Text>
                </react_native_1.View>)}
            </>) : (<BooksGrid_1.default pathwayName={subject} books={books}/>)}
        </react_native_1.View>
      </react_native_1.ScrollView>
    </react_native_1.View>);
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    loadingContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: theme_1.Spacing.xl,
        paddingTop: react_native_1.Platform.select({ ios: 110, default: 70 }),
        paddingBottom: theme_1.Spacing.xxl + 80,
    },
    backButton: {
        marginBottom: theme_1.Spacing.md,
    },
    backButtonText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.primary,
    },
    title: {
        fontSize: theme_1.FontSizes.xxxl,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.text,
        marginBottom: theme_1.Spacing.sm,
    },
    titleDark: {
        fontSize: theme_1.FontSizes.xxxl,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.charcoal,
        marginBottom: theme_1.Spacing.sm,
    },
    subtitle: {
        fontSize: theme_1.FontSizes.lg,
        color: colors.textSecondary,
        marginBottom: theme_1.Spacing.md,
    },
    pathwayBadge: {
        backgroundColor: colors.primaryDark,
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.xs,
        borderRadius: theme_1.BorderRadius.sm,
        alignSelf: 'flex-start',
        marginBottom: theme_1.Spacing.lg,
    },
    pathwayBadgeText: {
        fontSize: theme_1.FontSizes.xs,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.white,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: theme_1.Spacing.lg,
        backgroundColor: colors.lightGray,
        borderRadius: theme_1.BorderRadius.md,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: theme_1.Spacing.sm,
        alignItems: 'center',
        borderRadius: theme_1.BorderRadius.sm,
    },
    tabActive: {
        backgroundColor: colors.cardBackground,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.text,
        fontWeight: theme_1.FontWeights.semibold,
    },
    sectionTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
        marginBottom: theme_1.Spacing.lg,
    },
    chapterList: {
        marginBottom: theme_1.Spacing.xl,
    },
    chapterCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.lg,
        marginBottom: theme_1.Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    chapterCardDark: {
        borderWidth: 1,
        borderColor: colors.primaryDark,
    },
    disabledCard: {
        opacity: 0.6,
    },
    chapterNumber: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.Spacing.md,
    },
    chapterNumberDark: {
        backgroundColor: colors.primaryDark,
    },
    chapterNumberText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.white,
    },
    chapterName: {
        flex: 1,
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.text,
    },
    chapterNameDark: {
        color: colors.charcoal,
        fontWeight: theme_1.FontWeights.semibold,
    },
    chapterArrow: {
        fontSize: theme_1.FontSizes.lg,
        color: colors.textSecondary,
    },
    chapterArrowDark: {
        color: colors.primaryDark,
    },
    placeholderCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.xl,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    placeholderTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
        marginBottom: theme_1.Spacing.sm,
    },
    placeholderText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        lineHeight: 22,
    },
}); };
