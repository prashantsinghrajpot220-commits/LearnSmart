"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdContainer;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var googleAds_1 = require("@/utils/googleAds");
var adConfig_1 = require("@/config/adConfig");
var SCREEN_WIDTH = react_native_1.Dimensions.get('window').width;
function AdContainer(_a) {
    var _b = _a.dismissible, dismissible = _b === void 0 ? false : _b, _c = _a.unitId, unitId = _c === void 0 ? adConfig_1.AD_UNIT_IDS.BANNER_LESSON : _c;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _d = (0, react_1.useState)(false), isDismissed = _d[0], setIsDismissed = _d[1];
    var _e = (0, react_1.useState)(false), loadError = _e[0], setLoadError = _e[1];
    if (isDismissed)
        return null;
    var styles = getStyles(colors);
    // Fallback for Web or when ad fails to load
    var renderPlaceholder = function (message, subtext) {
        if (message === void 0) { message = 'Advertisement placeholder'; }
        if (subtext === void 0) { subtext = 'Sponsored Space'; }
        return (<react_native_1.View style={styles.adBox}>
      {dismissible && (<react_native_1.TouchableOpacity style={styles.dismissButton} onPress={function () { return setIsDismissed(true); }} activeOpacity={0.7}>
          <vector_icons_1.Feather name="x" size={16} color="#888888"/>
        </react_native_1.TouchableOpacity>)}
      <react_native_1.View style={styles.adContent}>
        <vector_icons_1.Feather name="tag" size={24} color="#999999"/>
        <react_native_1.Text style={styles.adText}>{subtext}</react_native_1.Text>
        <react_native_1.Text style={styles.adSubtext}>{message}</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.View>);
    };
    if (react_native_1.Platform.OS === 'web') {
        return (<react_native_1.View style={styles.container}>
        {renderPlaceholder('Ads not available on web', 'Web Preview')}
      </react_native_1.View>);
    }
    if (loadError) {
        return (<react_native_1.View style={styles.container}>
        {renderPlaceholder('Failed to load advertisement', 'Ad Error')}
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.adWrapper}>
        {dismissible && (<react_native_1.TouchableOpacity style={styles.dismissButton} onPress={function () { return setIsDismissed(true); }} activeOpacity={0.7}>
            <vector_icons_1.Feather name="x" size={16} color="#888888"/>
          </react_native_1.TouchableOpacity>)}
        <googleAds_1.BannerAd unitId={unitId} size={googleAds_1.BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{
            requestNonPersonalizedAdsOnly: true,
        }} onAdFailedToLoad={function (error) {
            console.warn('AdMob error:', error);
            setLoadError(true);
        }}/>
      </react_native_1.View>
    </react_native_1.View>);
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        marginTop: theme_1.Spacing.md,
        marginBottom: theme_1.Spacing.md,
        alignItems: 'center',
        width: '100%',
    },
    adWrapper: {
        width: SCREEN_WIDTH - (theme_1.Spacing.lg * 2),
        minHeight: 60,
        backgroundColor: '#F0F0F0',
        borderRadius: theme_1.BorderRadius.sm,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    adBox: {
        backgroundColor: '#E8E8E8',
        height: 100,
        width: SCREEN_WIDTH - (theme_1.Spacing.lg * 2),
        borderRadius: theme_1.BorderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },
    dismissButton: {
        position: 'absolute',
        top: theme_1.Spacing.xs,
        right: theme_1.Spacing.xs,
        padding: theme_1.Spacing.xs,
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderRadius: 12,
        zIndex: 10,
    },
    adContent: {
        alignItems: 'center',
    },
    adText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: '#666666',
        marginTop: theme_1.Spacing.sm,
    },
    adSubtext: {
        fontSize: theme_1.FontSizes.xs,
        color: '#999999',
        marginTop: 2,
    },
}); };
