"use strict";
/**
 * Error Logger Utility
 *
 * This utility provides centralized error logging for the LearnSmart app.
 * All errors are logged to the console and can be extended to send to
 * error tracking services (e.g., Sentry, Bugsnag) in production.
 *
 * Play Store Requirement: Global error boundary with error logging
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.categorizeError = exports.ErrorType = exports.isRecoverableError = exports.getUserFriendlyErrorMessage = exports.clearErrorLogs = exports.getErrorLogs = exports.logInfo = exports.logWarning = exports.logBoundaryError = exports.logError = void 0;
var async_storage_1 = require("@react-native-async-storage/async-storage");
/**
 * Logs an error to the console with timestamp and context
 *
 * @param error - The error object or message
 * @param context - Additional context information
 */
var logError = function (error, context) {
    var timestamp = new Date().toISOString();
    var errorMessage = typeof error === 'string' ? error : error.message;
    var errorStack = typeof error === 'string' ? undefined : error.stack;
    var errorLog = __assign({ timestamp: timestamp, message: errorMessage, stack: errorStack }, context);
    // Log to console with clear formatting
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error("\u274C ERROR [".concat(timestamp, "]"));
    console.error("Message: ".concat(errorMessage));
    if (errorStack) {
        console.error('\nStack Trace:');
        console.error(errorStack);
    }
    if (context) {
        console.error('\nContext:');
        console.error(JSON.stringify(context, null, 2));
    }
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    // Store error log locally for debugging (last 50 errors)
    storeErrorLog(errorLog);
};
exports.logError = logError;
/**
 * Logs a React ErrorBoundary error
 *
 * @param error - The error caught by ErrorBoundary
 * @param errorInfo - Component stack information
 * @param userId - Optional user ID for tracking
 */
var logBoundaryError = function (error, errorInfo, userId) {
    (0, exports.logError)(error, {
        componentStack: errorInfo.componentStack,
        source: 'ErrorBoundary',
        userId: userId,
    });
};
exports.logBoundaryError = logBoundaryError;
/**
 * Logs a warning (non-critical issues)
 *
 * @param message - Warning message
 * @param context - Additional context
 */
var logWarning = function (message, context) {
    var timestamp = new Date().toISOString();
    console.warn("\u26A0\uFE0F  WARNING [".concat(timestamp, "]: ").concat(message));
    if (context) {
        console.warn('Context:', context);
    }
};
exports.logWarning = logWarning;
/**
 * Logs informational messages (for debugging)
 *
 * @param message - Info message
 * @param context - Additional context
 */
var logInfo = function (message, context) {
    var timestamp = new Date().toISOString();
    console.log("\u2139\uFE0F  INFO [".concat(timestamp, "]: ").concat(message));
    if (context) {
        console.log('Context:', context);
    }
};
exports.logInfo = logInfo;
/**
 * Stores error log locally using AsyncStorage
 *
 * @param errorLog - Error log to store
 */
var storeErrorLog = function (errorLog) { return __awaiter(void 0, void 0, void 0, function () {
    var ERROR_LOGS_KEY, existingLogsJson, existingLogs, trimmedLogs, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                ERROR_LOGS_KEY = '@learnsmart_error_logs';
                return [4 /*yield*/, async_storage_1.default.getItem(ERROR_LOGS_KEY)];
            case 1:
                existingLogsJson = _a.sent();
                existingLogs = existingLogsJson ? JSON.parse(existingLogsJson) : [];
                // Add new error log
                existingLogs.unshift(errorLog);
                trimmedLogs = existingLogs.slice(0, 50);
                // Store back
                return [4 /*yield*/, async_storage_1.default.setItem(ERROR_LOGS_KEY, JSON.stringify(trimmedLogs))];
            case 2:
                // Store back
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                // If AsyncStorage fails, just log to console
                console.error('Failed to store error log:', err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Retrieves stored error logs
 *
 * @returns Promise resolving to array of error logs
 */
var getErrorLogs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ERROR_LOGS_KEY, logsJson, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ERROR_LOGS_KEY = '@learnsmart_error_logs';
                return [4 /*yield*/, async_storage_1.default.getItem(ERROR_LOGS_KEY)];
            case 1:
                logsJson = _a.sent();
                return [2 /*return*/, logsJson ? JSON.parse(logsJson) : []];
            case 2:
                err_2 = _a.sent();
                console.error('Failed to retrieve error logs:', err_2);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getErrorLogs = getErrorLogs;
/**
 * Clears all stored error logs
 */
var clearErrorLogs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ERROR_LOGS_KEY, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ERROR_LOGS_KEY = '@learnsmart_error_logs';
                return [4 /*yield*/, async_storage_1.default.removeItem(ERROR_LOGS_KEY)];
            case 1:
                _a.sent();
                console.log('✅ Error logs cleared');
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error('Failed to clear error logs:', err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.clearErrorLogs = clearErrorLogs;
/**
 * Formats error for user-friendly display
 *
 * @param error - Error to format
 * @returns User-friendly error message
 */
var getUserFriendlyErrorMessage = function (error) {
    var errorMessage = typeof error === 'string' ? error : error.message;
    // Map technical errors to user-friendly messages
    var errorMap = {
        'Network request failed': 'Unable to connect. Please check your internet connection.',
        'Network Error': 'Unable to connect. Please check your internet connection.',
        'timeout': 'Request timed out. Please try again.',
        'Failed to fetch': 'Unable to load data. Please try again.',
        'SyntaxError': 'Something went wrong with the app data.',
        'TypeError': 'An unexpected error occurred.',
        'ReferenceError': 'An unexpected error occurred.',
    };
    // Check if error matches any known patterns
    for (var _i = 0, _a = Object.entries(errorMap); _i < _a.length; _i++) {
        var _b = _a[_i], pattern = _b[0], friendlyMessage = _b[1];
        if (errorMessage.includes(pattern)) {
            return friendlyMessage;
        }
    }
    // Default user-friendly message
    return 'Something went wrong. Please try again.';
};
exports.getUserFriendlyErrorMessage = getUserFriendlyErrorMessage;
/**
 * Validates if an error is recoverable
 *
 * @param error - Error to check
 * @returns True if error is recoverable
 */
var isRecoverableError = function (error) {
    var errorMessage = typeof error === 'string' ? error : error.message;
    // Recoverable errors
    var recoverablePatterns = [
        'network',
        'timeout',
        'failed to fetch',
        'connection',
    ];
    return recoverablePatterns.some(function (pattern) {
        return errorMessage.toLowerCase().includes(pattern);
    });
};
exports.isRecoverableError = isRecoverableError;
/**
 * Error types for categorization
 */
var ErrorType;
(function (ErrorType) {
    ErrorType["NETWORK"] = "NETWORK";
    ErrorType["VALIDATION"] = "VALIDATION";
    ErrorType["AUTH"] = "AUTH";
    ErrorType["COMPONENT"] = "COMPONENT";
    ErrorType["UNKNOWN"] = "UNKNOWN";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
/**
 * Categorizes error into type
 *
 * @param error - Error to categorize
 * @returns Error type
 */
var categorizeError = function (error) {
    var errorMessage = typeof error === 'string' ? error : error.message;
    var lowerMessage = errorMessage.toLowerCase();
    if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('fetch')) {
        return ErrorType.NETWORK;
    }
    if (lowerMessage.includes('validation') || lowerMessage.includes('invalid') || lowerMessage.includes('required')) {
        return ErrorType.VALIDATION;
    }
    if (lowerMessage.includes('auth') || lowerMessage.includes('unauthorized') || lowerMessage.includes('login')) {
        return ErrorType.AUTH;
    }
    if (lowerMessage.includes('component') || lowerMessage.includes('render') || lowerMessage.includes('react')) {
        return ErrorType.COMPONENT;
    }
    return ErrorType.UNKNOWN;
};
exports.categorizeError = categorizeError;
/**
 * Default export with all error logging functions
 */
exports.default = {
    logError: exports.logError,
    logBoundaryError: exports.logBoundaryError,
    logWarning: exports.logWarning,
    logInfo: exports.logInfo,
    getErrorLogs: exports.getErrorLogs,
    clearErrorLogs: exports.clearErrorLogs,
    getUserFriendlyErrorMessage: exports.getUserFriendlyErrorMessage,
    isRecoverableError: exports.isRecoverableError,
    categorizeError: exports.categorizeError,
    ErrorType: ErrorType,
};
