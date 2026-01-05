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
exports.default = AnimatedLoginForm;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var theme_1 = require("@/constants/theme");
var userStore_1 = require("@/store/userStore");
var ThemeContext_1 = require("@/components/ThemeContext");
var CartoonCharacter_1 = require("@/components/CartoonCharacter");
var PasswordInput_1 = require("@/components/PasswordInput");
function AnimatedLoginForm() {
    var _this = this;
    var router = (0, expo_router_1.useRouter)();
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, react_1.useState)(true), isSignup = _a[0], setIsSignup = _a[1];
    var _b = (0, react_1.useState)(''), name = _b[0], setName = _b[1];
    var _c = (0, react_1.useState)(''), email = _c[0], setEmail = _c[1];
    var _d = (0, react_1.useState)(''), password = _d[0], setPassword = _d[1];
    var _e = (0, react_1.useState)(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)({}), errors = _f[0], setErrors = _f[1];
    var _g = (0, react_1.useState)('idle'), characterState = _g[0], setCharacterState = _g[1];
    var _h = (0, react_1.useState)(false), passwordVisible = _h[0], setPasswordVisible = _h[1];
    var _j = (0, react_1.useState)(false), isLoggingIn = _j[0], setIsLoggingIn = _j[1];
    var setUserName = (0, userStore_1.useUserStore)(function (state) { return state.setUserName; });
    var buttonScale = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(1); }, []);
    var buttonOpacity = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(1); }, []);
    var cardOffset = (0, react_1.useMemo)(function () { return new react_native_1.Animated.Value(0); }, []);
    var passwordInputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var keyboardWillShow = react_native_1.Keyboard.addListener('keyboardDidShow', function (event) {
            react_native_1.Animated.timing(cardOffset, {
                toValue: -event.endCoordinates.height * 0.15,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
        var keyboardWillHide = react_native_1.Keyboard.addListener('keyboardDidHide', function () {
            react_native_1.Animated.timing(cardOffset, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
        return function () {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, [cardOffset]);
    (0, react_1.useEffect)(function () {
        if (password.length > 0 && !passwordVisible) {
            setCharacterState('curious');
        }
        else if (passwordVisible) {
            setCharacterState('surprised');
        }
        else {
            setCharacterState('idle');
        }
    }, [password, passwordVisible]);
    (0, react_1.useEffect)(function () {
        if (isLoggingIn) {
            setCharacterState('happy');
        }
    }, [isLoggingIn]);
    var handlePasswordFocus = function () {
        setCharacterState('curious');
    };
    var handlePasswordBlur = function () {
        if (password.length > 0 && !passwordVisible) {
            setCharacterState('idle');
        }
        else if (passwordVisible) {
            setCharacterState('surprised');
        }
        else {
            setCharacterState('idle');
        }
    };
    var handlePasswordToggle = function (visible) {
        setPasswordVisible(visible);
        if (visible) {
            setCharacterState('surprised');
            setTimeout(function () {
                if (password.length > 0) {
                    setCharacterState('happy');
                }
            }, 500);
        }
        else {
            setCharacterState('relaxed');
            setTimeout(function () {
                if (password.length > 0) {
                    setCharacterState('curious');
                }
                else {
                    setCharacterState('idle');
                }
            }, 800);
        }
    };
    var handleLoginFocus = function () {
        if (password.length > 0) {
            setCharacterState('happy');
        }
    };
    var validate = function () {
        var newErrors = {};
        // Play Store Test Account - Bypass validation
        var TEST_EMAIL = 'test@example.com';
        var TEST_PASSWORD = 'test1234';
        // Check if using test account credentials
        var isTestAccount = email.trim() === TEST_EMAIL && password.trim() === TEST_PASSWORD;
        if (isTestAccount) {
            // Test account - bypass validation
            setErrors({});
            return true;
        }
        // Normal validation for regular users
        if (isSignup && !name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }
        else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var TEST_EMAIL, TEST_PASSWORD, isTestAccount, delay_1, userNameToSet, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!validate()) {
                        setCharacterState('idle');
                        return [2 /*return*/];
                    }
                    setIsLoggingIn(true);
                    setCharacterState('happy');
                    react_native_1.Animated.parallel([
                        react_native_1.Animated.timing(buttonOpacity, {
                            toValue: 0.7,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        react_native_1.Animated.spring(buttonScale, {
                            toValue: 0.95,
                            useNativeDriver: true,
                            bounciness: 8,
                        }),
                    ]).start();
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    TEST_EMAIL = 'test@example.com';
                    TEST_PASSWORD = 'test1234';
                    isTestAccount = email.trim() === TEST_EMAIL && password.trim() === TEST_PASSWORD;
                    delay_1 = isTestAccount ? 800 : 1500;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                case 2:
                    _a.sent();
                    userNameToSet = isTestAccount && !name.trim() ? 'Test User' : name;
                    setUserName(userNameToSet);
                    // Navigate to home (or auth for signup to continue flow)
                    if (isSignup) {
                        // For signup, go to auth for age selection (bypassed for test account)
                        router.replace('/auth');
                    }
                    else {
                        // For login, go directly to home
                        router.replace('/home');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Auth error:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    setIsLoggingIn(false);
                    react_native_1.Animated.parallel([
                        react_native_1.Animated.timing(buttonOpacity, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        react_native_1.Animated.spring(buttonScale, {
                            toValue: 1,
                            useNativeDriver: true,
                            bounciness: 6,
                        }),
                    ]).start();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var styles = getStyles(colors);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.characterContainer}>
        <CartoonCharacter_1.default state={characterState} size={160}/>
      </react_native_1.View>

      <react_native_1.Animated.View style={[styles.card, { transform: [{ translateY: cardOffset }] }]}>
        <react_native_1.Text style={styles.title}>{isSignup ? 'Create Account' : 'Welcome Back'}</react_native_1.Text>
        <react_native_1.Text style={styles.subtitle}>
          {isSignup ? 'Start your learning journey today' : 'Sign in to continue learning'}
        </react_native_1.Text>

        <react_native_1.View style={styles.form}>
          {isSignup && (<react_native_1.View style={styles.inputContainer}>
              <react_native_1.Text style={styles.label}>Name</react_native_1.Text>
              <react_native_1.TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="Enter your name" placeholderTextColor={colors.textSecondary} value={name} onChangeText={setName} autoCapitalize="words"/>
              {errors.name && <react_native_1.Text style={styles.errorText}>{errors.name}</react_native_1.Text>}
            </react_native_1.View>)}

          <react_native_1.View style={styles.inputContainer}>
            <react_native_1.Text style={styles.label}>Email</react_native_1.Text>
            <react_native_1.TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="Enter your email" placeholderTextColor={colors.textSecondary} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail}/>
            {errors.email && <react_native_1.Text style={styles.errorText}>{errors.email}</react_native_1.Text>}
          </react_native_1.View>

          <PasswordInput_1.PasswordInput value={password} onChangeText={setPassword} error={errors.password} onFocus={handlePasswordFocus} onBlur={handlePasswordBlur} onTogglePassword={handlePasswordToggle} ref={passwordInputRef}/>

          <react_native_1.Animated.View style={[
            styles.primaryButton,
            {
                transform: [{ scale: buttonScale }],
                opacity: buttonOpacity,
            },
        ]}>
            <react_native_1.TouchableOpacity style={styles.buttonTouchable} onPress={handleSubmit} onPressIn={function () {
            react_native_1.Animated.spring(buttonScale, {
                toValue: 0.92,
                useNativeDriver: true,
                bounciness: 8,
            }).start();
            handleLoginFocus();
        }} onPressOut={function () {
            react_native_1.Animated.spring(buttonScale, {
                toValue: 1,
                useNativeDriver: true,
                bounciness: 8,
            }).start();
        }} disabled={isLoading} activeOpacity={1}>
              {isLoading ? (<react_native_1.ActivityIndicator color={colors.white}/>) : (<react_native_1.Text style={styles.primaryButtonText}>
                  {isSignup ? 'Next' : 'Sign In'}
                </react_native_1.Text>)}
            </react_native_1.TouchableOpacity>
          </react_native_1.Animated.View>

          <react_native_1.TouchableOpacity style={styles.secondaryButton} onPress={function () {
            setIsSignup(!isSignup);
            setErrors({});
            setCharacterState('idle');
        }} activeOpacity={0.7}>
            <react_native_1.Text style={styles.secondaryButtonText}>
              {isSignup ? 'Already have an account? Sign In' : 'Create new account'}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        <react_native_1.Text style={styles.footerText}>LearnSmart - Phase 6A</react_native_1.Text>
      </react_native_1.Animated.View>
    </react_native_1.View>);
}
var getStyles = function (colors) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
        },
        characterContainer: {
            marginBottom: theme_1.Spacing.lg,
        },
        card: {
            width: '100%',
            maxWidth: react_native_1.Platform.select({ web: 420, default: undefined }),
            paddingHorizontal: theme_1.Spacing.xl,
            paddingTop: react_native_1.Platform.select({ web: theme_1.Spacing.xl, default: theme_1.Spacing.lg }),
            paddingBottom: theme_1.Spacing.xxl,
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
            marginBottom: theme_1.Spacing.xl,
        },
        form: {
            width: '100%',
        },
        inputContainer: {
            marginBottom: theme_1.Spacing.lg,
        },
        label: {
            fontSize: theme_1.FontSizes.md,
            fontWeight: theme_1.FontWeights.medium,
            color: colors.text,
            marginBottom: theme_1.Spacing.sm,
        },
        input: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            paddingHorizontal: theme_1.Spacing.md,
            paddingVertical: theme_1.Spacing.md,
            fontSize: theme_1.FontSizes.md,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.lightGray,
        },
        inputError: {
            borderColor: colors.error,
        },
        errorText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.error,
            marginTop: theme_1.Spacing.xs,
        },
        primaryButton: {
            backgroundColor: colors.primary,
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
            overflow: 'hidden',
        },
        buttonTouchable: {
            width: '100%',
            paddingVertical: theme_1.Spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
        },
        primaryButtonText: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.semibold,
            color: colors.white,
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
        footerText: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: theme_1.Spacing.xl,
        },
    });
};
