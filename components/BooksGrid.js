"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BooksGrid;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var userStore_1 = require("@/store/userStore");
var ContentValidator_1 = require("@/services/ContentValidator");
var vector_icons_1 = require("@expo/vector-icons");
var affiliateLinks_1 = require("@/utils/affiliateLinks");
var affiliateConfig_1 = require("@/config/affiliateConfig");
function BooksGrid(_a) {
    var _b;
    var pathwayName = _a.pathwayName, books = _a.books;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var ageGroup = (_b = (0, userStore_1.useUserStore)(function (s) { return s.ageGroup; })) !== null && _b !== void 0 ? _b : 'under12';
    var displayBooks = (0, react_1.useMemo)(function () {
        return ContentValidator_1.ContentValidator.validateBooksSync(books !== null && books !== void 0 ? books : [], {
            contentId: "books:".concat(pathwayName),
            ageGroup: ageGroup,
            source: 'BooksGrid',
        });
    }, [books, pathwayName, ageGroup]);
    var handleBuyPress = function (book) {
        var affiliateLink;
        // Try to generate affiliate link using ASIN first (most reliable)
        if (book.asin) {
            affiliateLink = (0, affiliateLinks_1.generateAffiliateLink)({
                asin: book.asin,
                keywords: book.title,
                useFallback: true
            });
        }
        // Fallback to ISBN if ASIN not available
        else if (book.isbn) {
            affiliateLink = (0, affiliateLinks_1.generateAffiliateLink)({
                isbn: book.isbn,
                keywords: book.title,
                useFallback: true
            });
        }
        // Final fallback: convert existing Amazon URL
        else {
            affiliateLink = (0, affiliateLinks_1.convertToAffiliateUrl)(book.amazonUrl);
        }
        if (!affiliateLink.isValid) {
            console.error('Invalid affiliate link generated for book:', book.title);
            react_native_1.Alert.alert('Error', 'Invalid product link. Please try again later.');
            return;
        }
        // Open the affiliate link with tracking
        (0, affiliateLinks_1.openAffiliateLink)(affiliateLink.url, {
            bookTitle: book.title,
            bookId: book.id,
            pathwayName: pathwayName
        }).catch(function (err) {
            console.error('Failed to open affiliate link:', err);
        });
    };
    var styles = getStyles(colors);
    if (displayBooks.length === 0) {
        return (<react_native_1.View style={styles.emptyContainer}>
        <vector_icons_1.Feather name="book" size={48} color={colors.textSecondary}/>
        <react_native_1.Text style={styles.emptyText}>No books available for this pathway</react_native_1.Text>
      </react_native_1.View>);
    }
    return (<react_native_1.ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <react_native_1.View style={styles.content}>
        {displayBooks.map(function (book) { return (<react_native_1.View key={book.id} style={styles.bookCard}>
            <react_native_1.View style={styles.bookHeader}>
              <react_native_1.View style={styles.thumbnailContainer}>
                <react_native_1.Text style={styles.thumbnail}>{book.thumbnail}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.titleContainer}>
                <react_native_1.Text style={styles.bookTitle} numberOfLines={2}>
                  {book.title}
                </react_native_1.Text>
                <react_native_1.Text style={styles.authorName}>{book.author}</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>

            <react_native_1.Text style={styles.description} numberOfLines={3}>
              {book.description}
            </react_native_1.Text>

            <react_native_1.TouchableOpacity style={styles.buyButton} onPress={function () { return handleBuyPress(book); }} activeOpacity={0.8}>
              <vector_icons_1.Feather name="shopping-cart" size={16} color="#333333"/>
              <react_native_1.Text style={styles.buyButtonText}>Buy on Amazon</react_native_1.Text>
            </react_native_1.TouchableOpacity>
            {(0, affiliateConfig_1.isUsingTestAffiliateTag)() && (<react_native_1.Text style={styles.testModeText}>Test affiliate links - no real commissions</react_native_1.Text>)}
          </react_native_1.View>); })}
      </react_native_1.View>
      <react_native_1.View style={styles.disclaimerContainer}>
        <react_native_1.Text style={styles.disclaimerText}>{(0, affiliateLinks_1.getAffiliateDisclosure)()}</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.ScrollView>);
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -theme_1.Spacing.sm,
    },
    bookCard: {
        backgroundColor: colors.cardBackground,
        flexBasis: react_native_1.Platform.select({ web: '48%', default: '46%' }),
        margin: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.md,
        borderWidth: 1,
        borderColor: colors.lightGray,
        minHeight: 220,
        justifyContent: 'space-between',
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    bookHeader: {
        flexDirection: 'row',
        marginBottom: theme_1.Spacing.sm,
    },
    thumbnailContainer: {
        width: 50,
        height: 70,
        borderRadius: theme_1.BorderRadius.sm,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.Spacing.sm,
    },
    thumbnail: {
        fontSize: 32,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    bookTitle: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
        lineHeight: 18,
        marginBottom: 4,
    },
    authorName: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
        lineHeight: 16,
    },
    description: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
        lineHeight: 16,
        marginBottom: theme_1.Spacing.md,
        flex: 1,
    },
    buyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFD700',
        paddingVertical: theme_1.Spacing.sm,
        paddingHorizontal: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.md,
        borderWidth: 1,
        borderColor: '#E6C200',
    },
    buyButtonText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.semibold,
        color: '#333333',
        marginLeft: theme_1.Spacing.xs,
    },
    testModeText: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: theme_1.Spacing.xs,
        fontStyle: 'italic',
    },
    disclaimerContainer: {
        padding: theme_1.Spacing.md,
        paddingBottom: theme_1.Spacing.xl,
        alignItems: 'center',
    },
    disclaimerText: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme_1.Spacing.xxxl,
    },
    emptyText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        marginTop: theme_1.Spacing.md,
    },
}); };
