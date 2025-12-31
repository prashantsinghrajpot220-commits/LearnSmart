/**
 * Error Logger Utility
 *
 * This utility provides centralized error logging for the LearnSmart app.
 * All errors are logged to the console and can be extended to send to
 * error tracking services (e.g., Sentry, Bugsnag) in production.
 *
 * Play Store Requirement: Global error boundary with error logging
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  componentStack?: string;
  userAgent?: string;
  userId?: string;
}

/**
 * Logs an error to the console with timestamp and context
 * 
 * @param error - The error object or message
 * @param context - Additional context information
 */
export const logError = (error: Error | string, context?: Record<string, unknown>): void => {
  const timestamp = new Date().toISOString();
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  const errorLog: ErrorLog = {
    timestamp,
    message: errorMessage,
    stack: errorStack,
    ...context,
  };

  // Log to console with clear formatting
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error(`❌ ERROR [${timestamp}]`);
  console.error(`Message: ${errorMessage}`);
  
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

/**
 * Logs a React ErrorBoundary error
 * 
 * @param error - The error caught by ErrorBoundary
 * @param errorInfo - Component stack information
 * @param userId - Optional user ID for tracking
 */
export const logBoundaryError = (
  error: Error,
  errorInfo: React.ErrorInfo,
  userId?: string
): void => {
  logError(error, {
    componentStack: errorInfo.componentStack,
    source: 'ErrorBoundary',
    userId,
  });
};

/**
 * Logs a warning (non-critical issues)
 * 
 * @param message - Warning message
 * @param context - Additional context
 */
export const logWarning = (message: string, context?: Record<string, unknown>): void => {
  const timestamp = new Date().toISOString();
  console.warn(`⚠️  WARNING [${timestamp}]: ${message}`);
  
  if (context) {
    console.warn('Context:', context);
  }
};

/**
 * Logs informational messages (for debugging)
 * 
 * @param message - Info message
 * @param context - Additional context
 */
export const logInfo = (message: string, context?: Record<string, unknown>): void => {
  const timestamp = new Date().toISOString();
  console.log(`ℹ️  INFO [${timestamp}]: ${message}`);
  
  if (context) {
    console.log('Context:', context);
  }
};

/**
 * Stores error log locally using AsyncStorage
 *
 * @param errorLog - Error log to store
 */
const storeErrorLog = async (errorLog: ErrorLog): Promise<void> => {
  try {
    const ERROR_LOGS_KEY = '@learnsmart_error_logs';

    // Get existing logs
    const existingLogsJson = await AsyncStorage.getItem(ERROR_LOGS_KEY);
    const existingLogs: ErrorLog[] = existingLogsJson ? JSON.parse(existingLogsJson) : [];

    // Add new error log
    existingLogs.unshift(errorLog);

    // Keep only last 50 errors
    const trimmedLogs = existingLogs.slice(0, 50);

    // Store back
    await AsyncStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(trimmedLogs));
  } catch (err) {
    // If AsyncStorage fails, just log to console
    console.error('Failed to store error log:', err);
  }
};

/**
 * Retrieves stored error logs
 *
 * @returns Promise resolving to array of error logs
 */
export const getErrorLogs = async (): Promise<ErrorLog[]> => {
  try {
    const ERROR_LOGS_KEY = '@learnsmart_error_logs';

    const logsJson = await AsyncStorage.getItem(ERROR_LOGS_KEY);
    return logsJson ? JSON.parse(logsJson) : [];
  } catch (err) {
    console.error('Failed to retrieve error logs:', err);
    return [];
  }
};

/**
 * Clears all stored error logs
 */
export const clearErrorLogs = async (): Promise<void> => {
  try {
    const ERROR_LOGS_KEY = '@learnsmart_error_logs';

    await AsyncStorage.removeItem(ERROR_LOGS_KEY);
    console.log('✅ Error logs cleared');
  } catch (err) {
    console.error('Failed to clear error logs:', err);
  }
};

/**
 * Formats error for user-friendly display
 * 
 * @param error - Error to format
 * @returns User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: Error | string): string => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  // Map technical errors to user-friendly messages
  const errorMap: Record<string, string> = {
    'Network request failed': 'Unable to connect. Please check your internet connection.',
    'Network Error': 'Unable to connect. Please check your internet connection.',
    'timeout': 'Request timed out. Please try again.',
    'Failed to fetch': 'Unable to load data. Please try again.',
    'SyntaxError': 'Something went wrong with the app data.',
    'TypeError': 'An unexpected error occurred.',
    'ReferenceError': 'An unexpected error occurred.',
  };

  // Check if error matches any known patterns
  for (const [pattern, friendlyMessage] of Object.entries(errorMap)) {
    if (errorMessage.includes(pattern)) {
      return friendlyMessage;
    }
  }

  // Default user-friendly message
  return 'Something went wrong. Please try again.';
};

/**
 * Validates if an error is recoverable
 * 
 * @param error - Error to check
 * @returns True if error is recoverable
 */
export const isRecoverableError = (error: Error | string): boolean => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  // Recoverable errors
  const recoverablePatterns = [
    'network',
    'timeout',
    'failed to fetch',
    'connection',
  ];

  return recoverablePatterns.some(pattern =>
    errorMessage.toLowerCase().includes(pattern)
  );
};

/**
 * Error types for categorization
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTH = 'AUTH',
  COMPONENT = 'COMPONENT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Categorizes error into type
 * 
 * @param error - Error to categorize
 * @returns Error type
 */
export const categorizeError = (error: Error | string): ErrorType => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const lowerMessage = errorMessage.toLowerCase();

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

/**
 * Default export with all error logging functions
 */
export default {
  logError,
  logBoundaryError,
  logWarning,
  logInfo,
  getErrorLogs,
  clearErrorLogs,
  getUserFriendlyErrorMessage,
  isRecoverableError,
  categorizeError,
  ErrorType,
};
