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
exports.default = Auth;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var theme_1 = require("@/constants/theme");
var userStore_1 = require("@/store/userStore");
var ThemeContext_1 = require("@/components/ThemeContext");
var vector_icons_1 = require("@expo/vector-icons");
var AnimatedLoginForm_1 = require("@/components/AnimatedLoginForm");
function Auth() {
    var _this = this;
    var router = (0, expo_router_1.useRouter)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, react_1.useState)(true), isSignup = _a[0], setIsSignup = _a[1];
    var _b = (0, react_1.useState)('form'), signupStep = _b[0], setSignupStep = _b[1];
    var _c = (0, react_1.useState)(null), selectedAge = _c[0], setSelectedAge = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var setAgeGroup = (0, userStore_1.useUserStore)(function (state) { return state.setAgeGroup; });
    var completeOnboarding = (0, userStore_1.useUserStore)(function (state) { return state.completeOnboarding; });
    var ageStepOpacity = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    react_1.default.useEffect(function () {
        if (isSignup && signupStep === 'age') {
            ageStepOpacity.setValue(0);
            react_native_1.Animated.timing(ageStepOpacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }).start();
        }
    }, [ageStepOpacity, isSignup, signupStep]);
    var handleAgeContinue = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedAge)
                        return [2 /*return*/];
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, setAgeGroup(selectedAge)];
                case 2:
                    _a.sent();
                    completeOnboarding();
                    router.replace(selectedAge === '12plus' ? '/home-12plus' : '/home');
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to save age group:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Play Store Test Account - Skip age selection and go directly to home
    var checkForTestAccountAndBypass = function () { return __awaiter(_this, void 0, void 0, function () {
        var userData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, async_storage_1.default.getItem('@learnsmart_user_name')];
                case 1:
                    userData = _a.sent();
                    if (!(userData === 'Test User')) return [3 /*break*/, 3];
                    return [4 /*yield*/, setAgeGroup('12plus')];
                case 2:
                    _a.sent(); // Default to 12+ for test account
                    completeOnboarding();
                    router.replace('/home-12plus');
                    return [2 /*return*/, true];
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error checking for test account:', error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, false];
            }
        });
    }); };
    // Check for test account when component mounts
    react_1.default.useEffect(function () {
        if (isSignup && signupStep === 'age') {
            checkForTestAccountAndBypass();
        }
    }, [signupStep, isSignup, checkForTestAccountAndBypass]);
    var styles = getStyles(colors);
    if (isSignup && signupStep === 'age') {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.Animated.View style={[styles.content, { opacity: ageStepOpacity }]}>
          <react_native_1.Text style={styles.title}>What's your age group?</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>Help us personalize your learning experience</react_native_1.Text>

          <react_native_1.View style={styles.ageSelectionContainer}>
            <react_native_1.TouchableOpacity style={[styles.ageCard, selectedAge === 'under12' && styles.ageCardSelected]} onPress={function () { return setSelectedAge('under12'); }} activeOpacity={0.8}>
              <react_native_1.View style={[styles.ageIconCircle, selectedAge === 'under12' && styles.ageIconCircleSelected]}>
                <vector_icons_1.Feather name="book-open" size={32} color={selectedAge === 'under12' ? colors.white : colors.primary}/>
              </react_native_1.View>
              <react_native_1.Text style={[styles.ageTitle, selectedAge === 'under12' && styles.ageTitleSelected]}>Under 12</react_native_1.Text>
              <react_native_1.Text style={styles.ageDescription}>Fun and colorful learning experience</react_native_1.Text>
              {selectedAge === 'under12' && (<react_native_1.View style={styles.checkmarkContainer}>
                  <vector_icons_1.Feather name="check-circle" size={24} color={colors.primary}/>
                </react_native_1.View>)}
            </react_native_1.TouchableOpacity>

            <react_native_1.TouchableOpacity style={[styles.ageCard, selectedAge === '12plus' && styles.ageCardSelected]} onPress={function () { return setSelectedAge('12plus'); }} activeOpacity={0.8}>
              <react_native_1.View style={[styles.ageIconCircle, selectedAge === '12plus' && styles.ageIconCircleSelected]}>
                <vector_icons_1.Feather name="award" size={32} color={selectedAge === '12plus' ? colors.white : colors.primary}/>
              </react_native_1.View>
              <react_native_1.Text style={[styles.ageTitle, selectedAge === '12plus' && styles.ageTitleSelected]}>12+</react_native_1.Text>
              <react_native_1.Text style={styles.ageDescription}>Professional and focused dashboard</react_native_1.Text>
              {selectedAge === '12plus' && (<react_native_1.View style={styles.checkmarkContainer}>
                  <vector_icons_1.Feather name="check-circle" size={24} color={colors.primary}/>
                </react_native_1.View>)}
            </react_native_1.TouchableOpacity>
          </react_native_1.View>

          <react_native_1.TouchableOpacity style={[styles.primaryButton, !selectedAge && styles.primaryButtonDisabled]} onPress={handleAgeContinue} disabled={!selectedAge || isLoading} activeOpacity={0.8}>
            {isLoading ? (<react_native_1.ActivityIndicator color={colors.white}/>) : (<react_native_1.Text style={styles.primaryButtonText}>Continue</react_native_1.Text>)}
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={styles.backButton} onPress={function () { return setSignupStep('form'); }} activeOpacity={0.7}>
            <react_native_1.Text style={styles.backButtonText}>← Back</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.Animated.View>
      </react_native_1.View>);
    }
    return <AnimatedLoginForm_1.default />;
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme_1.Spacing.xl,
        paddingTop: theme_1.Spacing.xxl * 2,
        justifyContent: 'center',
    },
    title: {
        fontSize: theme_1.FontSizes.xxxl,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.text,
        textAlign: 'center',
        marginBottom: theme_1.Spacing.sm,
    },
    subtitle: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme_1.Spacing.xxl,
    },
    ageSelectionContainer: {
        gap: theme_1.Spacing.lg,
        marginVertical: theme_1.Spacing.xxl,
    },
    ageCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.lightGray,
        position: 'relative',
    },
    ageCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.cardBackground,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    ageIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme_1.Spacing.md,
    },
    ageIconCircleSelected: {
        backgroundColor: colors.primary,
    },
    ageTitle: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.text,
        marginBottom: theme_1.Spacing.xs,
    },
    ageTitleSelected: {
        color: colors.primary,
    },
    ageDescription: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    checkmarkContainer: {
        position: 'absolute',
        top: theme_1.Spacing.md,
        right: theme_1.Spacing.md,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        paddingVertical: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme_1.Spacing.lg,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.white,
    },
    primaryButtonDisabled: {
        opacity: 0.5,
    },
    secondaryButton: {
        backgroundColor: colors.cardBackground,
        paddingVertical: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme_1.Spacing.md,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    secondaryButtonText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.primary,
    },
    backButton: {
        backgroundColor: colors.cardBackground,
        paddingVertical: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme_1.Spacing.md,
    },
    backButtonText: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.textSecondary,
    },
}); };
