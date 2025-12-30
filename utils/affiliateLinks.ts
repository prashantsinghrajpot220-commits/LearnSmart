import { Linking, Alert } from 'react-native';
import { 
  AFFILIATE_TAG, 
  getAmazonBaseUrl, 
  isUsingTestAffiliateTag 
} from '@/config/affiliateConfig';

/**
 * Affiliate Link Generation Utility
 * 
 * This utility handles the generation, validation, and tracking of Amazon affiliate links.
 * It supports both direct product links (using ASIN/ISBN) and search-based fallback links.
 */

interface AffiliateLinkOptions {
  asin?: string;
  isbn?: string;
  keywords?: string;
  title?: string;
  author?: string;
  useFallback?: boolean;
}

interface GeneratedAffiliateLink {
  url: string;
  isAffiliateLink: boolean;
  isFallback: boolean;
  isValid: boolean;
}

/**
 * Generate an Amazon affiliate link
 * 
 * @param options - Link generation options
 * @returns Generated affiliate link with metadata
 */
export function generateAffiliateLink(options: AffiliateLinkOptions): GeneratedAffiliateLink {
  const { asin, isbn, keywords, title, author, useFallback = true } = options;
  
  const baseUrl = getAmazonBaseUrl();
  const affiliateTag = AFFILIATE_TAG;
  
  // Try to use ASIN first, then ISBN, then fallback to search
  if (asin) {
    // Direct product link using ASIN
    const url = `${baseUrl}/dp/${asin}?tag=${affiliateTag}`;
    return {
      url,
      isAffiliateLink: true,
      isFallback: false,
      isValid: validateAmazonUrl(url)
    };
  }
  
  if (isbn) {
    // Convert ISBN to ASIN format (Amazon uses ASIN, but ISBN can work in search)
    // For books, we can use the ISBN directly in the product URL
    const url = `${baseUrl}/dp/${isbn}?tag=${affiliateTag}`;
    return {
      url,
      isAffiliateLink: true,
      isFallback: false,
      isValid: validateAmazonUrl(url)
    };
  }
  
  if (useFallback && (keywords || title || author)) {
    // Fallback to search link
    const searchQuery = buildSearchQuery({ keywords, title, author });
    const url = `${baseUrl}/s?k=${encodeURIComponent(searchQuery)}&tag=${affiliateTag}`;
    return {
      url,
      isAffiliateLink: true,
      isFallback: true,
      isValid: validateAmazonUrl(url)
    };
  }
  
  // If no valid options provided
  return {
    url: baseUrl,
    isAffiliateLink: false,
    isFallback: false,
    isValid: false
  };
}

/**
 * Build search query from available information
 */
function buildSearchQuery({ keywords, title, author }: { keywords?: string; title?: string; author?: string }): string {
  const parts = [];
  
  if (keywords) {
    parts.push(keywords);
  }
  
  if (title) {
    parts.push(title);
  }
  
  if (author) {
    parts.push(author);
  }
  
  return parts.join(' ');
}

/**
 * Validate an Amazon URL
 */
export function validateAmazonUrl(url: string): boolean {
  try {
    // Basic URL validation
    if (!url || typeof url !== 'string') return false;
    
    // Check if URL starts with a valid Amazon domain
    const amazonDomains = [
      'amazon.com',
      'amazon.co.uk', 
      'amazon.ca',
      'amazon.de',
      'amazon.fr',
      'amazon.es',
      'amazon.it',
      'amazon.co.jp',
      'amazon.in',
      'amazon.com.au'
    ];
    
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Check if hostname matches any Amazon domain
    const isAmazonDomain = amazonDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
    if (!isAmazonDomain) return false;
    
    // Check if affiliate tag is present (for affiliate links)
    if (url.includes('tag=')) {
      const tagMatch = url.match(/tag=([^&]+)/);
      if (!tagMatch || !tagMatch[1]) return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid Amazon URL:', error);
    return false;
  }
}

/**
 * Convert existing Amazon URL to affiliate URL
 * 
 * This function takes an existing Amazon product URL and converts it to an affiliate URL
 * by adding the affiliate tag parameter.
 */
export function convertToAffiliateUrl(existingUrl: string): GeneratedAffiliateLink {
  try {
    const urlObj = new URL(existingUrl);
    
    // Check if it's already an affiliate URL
    if (urlObj.searchParams.has('tag')) {
      return {
        url: existingUrl,
        isAffiliateLink: true,
        isFallback: false,
        isValid: validateAmazonUrl(existingUrl)
      };
    }
    
    // Add affiliate tag
    urlObj.searchParams.set('tag', AFFILIATE_TAG);
    
    const affiliateUrl = urlObj.toString();
    
    return {
      url: affiliateUrl,
      isAffiliateLink: true,
      isFallback: false,
      isValid: validateAmazonUrl(affiliateUrl)
    };
  } catch (error) {
    console.error('Failed to convert URL to affiliate URL:', error);
    
    // If conversion fails, try to generate a fallback
    const fallbackLink = createFallbackFromExistingUrl(existingUrl);
    if (fallbackLink) {
      return fallbackLink;
    }
    
    return {
      url: existingUrl,
      isAffiliateLink: false,
      isFallback: false,
      isValid: false
    };
  }
}

/**
 * Try to extract product information from existing URL for fallback
 */
function createFallbackFromExistingUrl(url: string): GeneratedAffiliateLink | null {
  try {
    // Try to extract ASIN from URL
    const asinMatch = url.match(/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
    
    if (asinMatch && asinMatch[1]) {
      return generateAffiliateLink({ asin: asinMatch[1] });
    }
    
    // Try to extract search keywords from URL
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;
    
    if (searchParams.has('k') || searchParams.has('keywords')) {
      const keywords = searchParams.get('k') || searchParams.get('keywords') || '';
      return generateAffiliateLink({ keywords });
    }
    
    return null;
  } catch (error) {
    console.error('Failed to create fallback from existing URL:', error);
    return null;
  }
}

/**
 * Open affiliate link with tracking and error handling
 */
export async function openAffiliateLink(url: string, options: {
  bookTitle?: string;
  bookId?: string;
  pathwayName?: string;
} = {}): Promise<boolean> {
  const { bookTitle, bookId, pathwayName } = options;
  
  // Track the click (basic implementation)
  trackAffiliateClick({ 
    url, 
    bookTitle, 
    bookId, 
    pathwayName,
    timestamp: new Date().toISOString()
  });
  
  try {
    // Check if we're using test affiliate tag
    if (isUsingTestAffiliateTag()) {
      console.log('Opening Amazon link with TEST affiliate tag:', url);
      Alert.alert(
        'Test Mode',
        'This link uses a test affiliate tag. No real commissions will be earned.'
      );
    }
    
    const supported = await Linking.canOpenURL(url);
    
    if (!supported) {
      console.error('Cannot open URL:', url);
      Alert.alert('Error', 'Cannot open this link. Please try again later.');
      return false;
    }
    
    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error('Failed to open affiliate link:', error);
    Alert.alert('Error', 'Failed to open the link. Please try again.');
    return false;
  }
}

/**
 * Basic affiliate click tracking (for analytics)
 * 
 * This is a simple implementation that logs to console.
 * In production, you would send this data to your analytics service.
 */
export function trackAffiliateClick(data: {
  url: string;
  bookTitle?: string;
  bookId?: string;
  pathwayName?: string;
  timestamp: string;
}): void {
  console.log('Affiliate Click Tracked:', {
    ...data,
    affiliateTag: AFFILIATE_TAG,
    isTestMode: isUsingTestAffiliateTag()
  });
  
  // In a real implementation, you would send this to your analytics backend
  // Example: analyticsService.track('affiliate_click', data);
}

/**
 * Get affiliate disclosure text
 */
export function getAffiliateDisclosure(): string {
  return 'As an Amazon Associate, we earn from qualifying purchases. This helps support our educational platform.';
}