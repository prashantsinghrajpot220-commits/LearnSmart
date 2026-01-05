"use strict";
/**
 * Amazon Affiliate Configuration
 *
 * This configuration handles Amazon Associates affiliate links for book recommendations.
 *
 * To use real affiliate links, update the environment variables or replace the values below.
 * In development, we use a test affiliate tag to avoid policy violations.
 *
 * Note: EXPO_PUBLIC_ prefixed variables are automatically loaded by Expo.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AFFILIATE_PARAMS = exports.AWS_CONFIG = exports.isUsingTestAffiliateTag = exports.getAmazonBaseUrl = exports.AMAZON_REGION = exports.AFFILIATE_TAG = exports.DEFAULT_AMAZON_REGION = void 0;
// Default test affiliate tag for development
var TEST_AFFILIATE_TAG = 'learnsmarttest-20';
// Amazon base URLs by region
var AMAZON_BASE_URLS = {
    US: 'https://www.amazon.com',
    UK: 'https://www.amazon.co.uk',
    CA: 'https://www.amazon.ca',
    DE: 'https://www.amazon.de',
    FR: 'https://www.amazon.fr',
    ES: 'https://www.amazon.es',
    IT: 'https://www.amazon.it',
    JP: 'https://www.amazon.co.jp',
    IN: 'https://www.amazon.in',
    AU: 'https://www.amazon.com.au',
};
// Default to US Amazon for global audience
exports.DEFAULT_AMAZON_REGION = 'US';
// Get the affiliate tag from environment variables or use test tag
exports.AFFILIATE_TAG = process.env.EXPO_PUBLIC_AMAZON_AFFILIATE_TAG || TEST_AFFILIATE_TAG;
// Get the Amazon region from environment variables or use default
exports.AMAZON_REGION = process.env.EXPO_PUBLIC_AMAZON_REGION || exports.DEFAULT_AMAZON_REGION;
// Get the base Amazon URL for the configured region
var getAmazonBaseUrl = function () {
    return AMAZON_BASE_URLS[exports.AMAZON_REGION] || AMAZON_BASE_URLS.US;
};
exports.getAmazonBaseUrl = getAmazonBaseUrl;
// Check if we're using test affiliate tag
var isUsingTestAffiliateTag = function () {
    return exports.AFFILIATE_TAG === TEST_AFFILIATE_TAG;
};
exports.isUsingTestAffiliateTag = isUsingTestAffiliateTag;
// Amazon Product Advertising API configuration (for future use)
exports.AWS_CONFIG = {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
    region: 'us-east-1',
    associateTag: exports.AFFILIATE_TAG,
};
// Affiliate link parameters
exports.AFFILIATE_PARAMS = {
    tag: exports.AFFILIATE_TAG,
    language: 'en_US',
    // Additional tracking parameters can be added here
};
