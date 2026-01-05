"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var errorLogger_1 = require("@/utils/errorLogger");
var userStore_1 = require("@/store/userStore");
function ErrorContent(_a) {
    var error = _a.error, errorInfo = _a.errorInfo, onRetry = _a.onRetry;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var router = (0, expo_router_1.useRouter)();
    var userName = (0, userStore_1.useUserStore)(function (state) { return state.userName; });
    var userId = (0, userStore_1.useUserStore)(function (state) { return state.userId; });
    var styles = getStyles(colors);
    // Log error for debugging
    if (error && errorInfo) {
        (0, errorLogger_1.logBoundaryError)(error, errorInfo, userId);
    }
    // Get user-friendly error message
    var friendlyMessage = error ? (0, errorLogger_1.getUserFriendlyErrorMessage)(error) :
        'We encountered an unexpected error. Do not worry, it is not your fault!';
    var handleGoHome = function () {
        // Navigate to home screen
        router.replace('/home');
    };
    var handleRetry = function () {
        // Try to recover from error
        onRetry();
    };
    var isRecoverable = error ? (0, errorLogger_1.isRecoverableError)(error) : true;
    return (<react_native_1.ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <react_native_1.View style={styles.iconContainer}>
        <react_native_1.View style={styles.iconBackground}>
          <vector_icons_1.Feather name="alert-circle" size={48} color={colors.primary}/>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.Text style={styles.title}>Oops! Something went wrong</react_native_1.Text>

      <react_native_1.Text style={styles.message}>
        {friendlyMessage}
      </react_native_1.Text>

      {error && process.env.NODE_ENV === 'development' && (<react_native_1.View style={styles.errorContainer}>
          <react_native_1.Text style={styles.errorTitle}>Error Details:</react_native_1.Text>
          <react_native_1.Text style={styles.errorText}>{error.message}</react_native_1.Text>
        </react_native_1.View>)}

      <react_native_1.View style={styles.tipsContainer}>
        <react_native_1.Text style={styles.tipsTitle}>What you can do:</react_native_1.Text>
        <react_native_1.View style={styles.tipItem}>
          <vector_icons_1.Feather name="refresh-cw" size={16} color={colors.primary}/>
          <react_native_1.Text style={styles.tipText}>Tap "Try Again" to recover</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.tipItem}>
          <vector_icons_1.Feather name="home" size={16} color={colors.primary}/>
          <react_native_1.Text style={styles.tipText}>Go to Home screen</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.tipItem}>
          <vector_icons_1.Feather name="smartphone" size={16} color={colors.primary}/>
          <react_native_1.Text style={styles.tipText}>Restart the app</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      {/* Primary action - Try Again if recoverable */}
      {isRecoverable && (<react_native_1.TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
          <vector_icons_1.Feather name="refresh-cw" size={20} color="#FFFFFF"/>
          <react_native_1.Text style={styles.retryButtonText}>Try Again</react_native_1.Text>
        </react_native_1.TouchableOpacity>)}

      {/* Secondary action - Go to Home */}
      <react_native_1.TouchableOpacity style={styles.homeButton} onPress={handleGoHome} activeOpacity={0.8}>
        <vector_icons_1.Feather name="home" size={20} color={colors.primary}/>
        <react_native_1.Text style={styles.homeButtonText}>Go to Home</react_native_1.Text>
      </react_native_1.TouchableOpacity>

      <react_native_1.Text style={styles.footerText}>
        If this problem persists, please contact learnsmartofficial24@gmail.com
      </react_native_1.Text>
    </react_native_1.ScrollView>);
}
var ErrorBoundaryWrapper = /** @class */ (function (_super) {
    __extends(ErrorBoundaryWrapper, _super);
    function ErrorBoundaryWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
        _this.handleRetry = function () {
            _this.setState({ hasError: false, error: null, errorInfo: null });
        };
        return _this;
    }
    ErrorBoundaryWrapper.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error, errorInfo: null };
    };
    ErrorBoundaryWrapper.prototype.componentDidCatch = function (error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error);
        console.error('Component stack:', errorInfo.componentStack);
        this.setState({ errorInfo: errorInfo });
    };
    ErrorBoundaryWrapper.prototype.render = function () {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return <ErrorContent error={this.state.error} errorInfo={this.state.errorInfo} onRetry={this.handleRetry}/>;
        }
        return this.props.children;
    };
    return ErrorBoundaryWrapper;
}(react_1.Component));
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: theme_1.Spacing.xl },
        iconContainer: { marginBottom: theme_1.Spacing.xl },
        iconBackground: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.cardBackground,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: colors.primary,
        },
        title: { fontSize: theme_1.FontSizes.xxl, fontWeight: theme_1.FontWeights.bold, color: colors.text, textAlign: 'center', marginBottom: theme_1.Spacing.md },
        message: { fontSize: theme_1.FontSizes.md, color: colors.textSecondary, textAlign: 'center', marginBottom: theme_1.Spacing.xl, lineHeight: theme_1.FontSizes.md * 1.5 },
        errorContainer: {
            width: '100%',
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.md,
            marginBottom: theme_1.Spacing.lg,
            borderLeftWidth: 4,
            borderLeftColor: colors.error,
        },
        errorTitle: { fontSize: theme_1.FontSizes.sm, fontWeight: theme_1.FontWeights.semibold, color: colors.error, marginBottom: theme_1.Spacing.xs },
        errorText: { fontSize: theme_1.FontSizes.sm, color: colors.textSecondary },
        tipsContainer: { width: '100%', backgroundColor: colors.cardBackground, borderRadius: theme_1.BorderRadius.lg, padding: theme_1.Spacing.lg, marginBottom: theme_1.Spacing.xl },
        tipsTitle: { fontSize: theme_1.FontSizes.sm, fontWeight: theme_1.FontWeights.semibold, color: colors.text, marginBottom: theme_1.Spacing.md },
        tipItem: { flexDirection: 'row', alignItems: 'center', marginBottom: theme_1.Spacing.sm },
        tipText: { fontSize: theme_1.FontSizes.sm, color: colors.textSecondary, marginLeft: theme_1.Spacing.sm, flex: 1 },
        retryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: theme_1.Spacing.md, paddingHorizontal: theme_1.Spacing.xl, borderRadius: theme_1.BorderRadius.lg, marginBottom: theme_1.Spacing.md, minWidth: 160, minHeight: 56 },
        retryButtonText: { fontSize: theme_1.FontSizes.md, fontWeight: theme_1.FontWeights.semibold, color: '#FFFFFF', marginLeft: theme_1.Spacing.sm },
        homeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardBackground, paddingVertical: theme_1.Spacing.md, paddingHorizontal: theme_1.Spacing.xl, borderRadius: theme_1.BorderRadius.lg, marginBottom: theme_1.Spacing.lg, minWidth: 160, minHeight: 56, borderWidth: 2, borderColor: colors.primary },
        homeButtonText: { fontSize: theme_1.FontSizes.md, fontWeight: theme_1.FontWeights.semibold, color: colors.primary, marginLeft: theme_1.Spacing.sm },
        footerText: { fontSize: theme_1.FontSizes.xs, color: colors.textSecondary, textAlign: 'center', opacity: 0.7 },
    });
};
exports.default = ErrorBoundaryWrapper;
