"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WelcomeSlider;
var react_1 = require("react");
var react_native_1 = require("react-native");
var lottie_react_native_1 = require("lottie-react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var slides = [
    {
        id: '1',
        title: 'Learn Faster',
        animation: require('@/assets/animations/rocket.json'),
    },
    {
        id: '2',
        title: 'Your AI Study Buddy',
        animation: require('@/assets/animations/robot.json'),
    },
    {
        id: '3',
        title: 'Ace Your Exams',
        animation: require('@/assets/animations/trophy.json'),
    },
];
var screenWidth = react_native_1.Dimensions.get('window').width;
function WelcomeSlider() {
    var _a = (0, react_1.useState)(0), currentIndex = _a[0], setCurrentIndex = _a[1];
    var flatListRef = (0, react_1.useRef)(null);
    var router = (0, expo_router_1.useRouter)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var onViewableItemsChanged = (0, react_1.useCallback)(function (_a) {
        var viewableItems = _a.viewableItems;
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }, []);
    var viewabilityConfig = (0, react_1.useMemo)(function () { return ({
        itemVisiblePercentThreshold: 50,
    }); }, []);
    var goToNext = function () {
        var _a;
        if (currentIndex < slides.length - 1) {
            (_a = flatListRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };
    var goToPrevious = function () {
        var _a;
        if (currentIndex > 0) {
            (_a = flatListRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
            });
        }
    };
    var handleGetStarted = function () {
        router.push('/auth');
    };
    var styles = getStyles(colors);
    var renderSlide = function (_a) {
        var item = _a.item;
        return (<react_native_1.View style={[styles.slide, { width: screenWidth }]}>
        <react_native_1.View style={styles.animationContainer}>
          <lottie_react_native_1.default source={item.animation} autoPlay loop style={styles.animation}/>
        </react_native_1.View>
        <react_native_1.Text style={styles.title}>{item.title}</react_native_1.Text>
      </react_native_1.View>);
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.FlatList ref={flatListRef} data={slides} renderItem={renderSlide} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig} keyExtractor={function (item) { return item.id; }} bounces={false}/>

      <react_native_1.View style={styles.footer}>
        <react_native_1.View style={styles.dotsContainer}>
          {slides.map(function (_, index) { return (<react_native_1.View key={index} style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
            ]}/>); })}
        </react_native_1.View>

        {currentIndex === slides.length - 1 ? (<react_native_1.TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted} activeOpacity={0.8}>
            <react_native_1.Text style={styles.getStartedText}>Get Started</react_native_1.Text>
          </react_native_1.TouchableOpacity>) : (<react_native_1.View style={styles.navigationButtons}>
            <react_native_1.TouchableOpacity onPress={goToPrevious} disabled={currentIndex === 0} style={[
                styles.navButton,
                currentIndex === 0 && styles.navButtonDisabled,
            ]} activeOpacity={0.7}>
              <react_native_1.Text style={[
                styles.navButtonText,
                currentIndex === 0 && styles.navButtonTextDisabled,
            ]}>
                Back
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>
            <react_native_1.TouchableOpacity onPress={goToNext} style={styles.navButton} activeOpacity={0.7}>
              <react_native_1.Text style={styles.navButtonText}>Next</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>)}
      </react_native_1.View>
    </react_native_1.View>);
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.xl,
    },
    animationContainer: {
        width: react_native_1.Platform.select({ web: 400, default: screenWidth * 0.7 }),
        height: react_native_1.Platform.select({ web: 400, default: screenWidth * 0.7 }),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.xxl,
    },
    animation: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: theme_1.FontSizes.xxl,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.text,
        textAlign: 'center',
        marginTop: theme_1.Spacing.lg,
    },
    footer: {
        paddingHorizontal: theme_1.Spacing.xl,
        paddingBottom: react_native_1.Platform.select({ web: theme_1.Spacing.xxl, default: theme_1.Spacing.xxl + 20 }),
        paddingTop: theme_1.Spacing.lg,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme_1.Spacing.xl,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.lightGray,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: colors.primary,
    },
    getStartedButton: {
        backgroundColor: colors.primary,
        paddingVertical: theme_1.Spacing.md,
        paddingHorizontal: theme_1.Spacing.xl,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    getStartedText: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.white,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme_1.Spacing.md,
    },
    navButton: {
        flex: 1,
        backgroundColor: colors.cardBackground,
        paddingVertical: theme_1.Spacing.md,
        paddingHorizontal: theme_1.Spacing.lg,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    navButtonDisabled: {
        borderColor: colors.lightGray,
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.primary,
    },
    navButtonTextDisabled: {
        color: colors.textSecondary,
    },
}); };
