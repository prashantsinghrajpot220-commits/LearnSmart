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

// Default test affiliate tag for development
const TEST_AFFILIATE_TAG = 'learnsmarttest-20';

// Amazon base URLs by region
const AMAZON_BASE_URLS = {
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
export const DEFAULT_AMAZON_REGION = 'US';

// Get the affiliate tag from environment variables or use test tag
export const AFFILIATE_TAG = process.env.EXPO_PUBLIC_AMAZON_AFFILIATE_TAG || TEST_AFFILIATE_TAG;

// Get the Amazon region from environment variables or use default
export const AMAZON_REGION = process.env.EXPO_PUBLIC_AMAZON_REGION || DEFAULT_AMAZON_REGION;

// Get the base Amazon URL for the configured region
export const getAmazonBaseUrl = () => {
  return AMAZON_BASE_URLS[AMAZON_REGION as keyof typeof AMAZON_BASE_URLS] || AMAZON_BASE_URLS.US;
};

// Check if we're using test affiliate tag
export const isUsingTestAffiliateTag = () => {
  return AFFILIATE_TAG === TEST_AFFILIATE_TAG;
};

// Amazon Product Advertising API configuration (for future use)
export const AWS_CONFIG = {
  accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  region: 'us-east-1',
  associateTag: AFFILIATE_TAG,
};

// Affiliate link parameters
export const AFFILIATE_PARAMS = {
  tag: AFFILIATE_TAG,
  language: 'en_US',
  // Additional tracking parameters can be added here
};