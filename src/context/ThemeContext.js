"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = exports.ThemeProvider = void 0;
var react_1 = require("react");
var theme_1 = require("../constants/theme");
var ThemeContext = (0, react_1.createContext)(undefined);
var THEME_STORAGE_KEY = '@learnsmart_theme';
var ThemeProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)('light'), theme = _b[0], setThemeState = _b[1];
    (0, react_1.useEffect)(function () {
        var loadTheme = function () {
            try {
                var savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'mature') {
                    setThemeState(savedTheme);
                }
                else {
                    // Default to light on web
                    setThemeState('light');
                }
            }
            catch (error) {
                console.error('Failed to load theme', error);
                setThemeState('light');
            }
        };
        loadTheme();
    }, []);
    var setTheme = (0, react_1.useCallback)(function (mode) {
        setThemeState(mode);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, mode);
        }
        catch (error) {
            console.error('Failed to save theme', error);
        }
    }, []);
    var toggleTheme = (0, react_1.useCallback)(function () {
        var nextTheme = {
            light: 'dark',
            dark: 'mature',
            mature: 'light',
        };
        setTheme(nextTheme[theme]);
    }, [theme, setTheme]);
    var value = {
        theme: theme,
        colors: theme_1.Colors[theme],
        setTheme: setTheme,
        toggleTheme: toggleTheme,
        isDark: theme === 'dark',
        isMature: theme === 'mature',
    };
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
exports.ThemeProvider = ThemeProvider;
var useTheme = function () {
    var context = (0, react_1.useContext)(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
exports.useTheme = useTheme;
