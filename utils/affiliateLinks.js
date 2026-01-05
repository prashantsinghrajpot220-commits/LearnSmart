"use strict";
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
exports.generateAffiliateLink = generateAffiliateLink;
exports.validateAmazonUrl = validateAmazonUrl;
exports.convertToAffiliateUrl = convertToAffiliateUrl;
exports.openAffiliateLink = openAffiliateLink;
exports.trackAffiliateClick = trackAffiliateClick;
exports.getAffiliateDisclosure = getAffiliateDisclosure;
var react_native_1 = require("react-native");
var affiliateConfig_1 = require("@/config/affiliateConfig");
/**
 * Generate an Amazon affiliate link
 *
 * @param options - Link generation options
 * @returns Generated affiliate link with metadata
 */
function generateAffiliateLink(options) {
    var asin = options.asin, isbn = options.isbn, keywords = options.keywords, title = options.title, author = options.author, _a = options.useFallback, useFallback = _a === void 0 ? true : _a;
    var baseUrl = (0, affiliateConfig_1.getAmazonBaseUrl)();
    var affiliateTag = affiliateConfig_1.AFFILIATE_TAG;
    // Try to use ASIN first, then ISBN, then fallback to search
    if (asin) {
        // Direct product link using ASIN
        var url = "".concat(baseUrl, "/dp/").concat(asin, "?tag=").concat(affiliateTag);
        return {
            url: url,
            isAffiliateLink: true,
            isFallback: false,
            isValid: validateAmazonUrl(url)
        };
    }
    if (isbn) {
        // Convert ISBN to ASIN format (Amazon uses ASIN, but ISBN can work in search)
        // For books, we can use the ISBN directly in the product URL
        var url = "".concat(baseUrl, "/dp/").concat(isbn, "?tag=").concat(affiliateTag);
        return {
            url: url,
            isAffiliateLink: true,
            isFallback: false,
            isValid: validateAmazonUrl(url)
        };
    }
    if (useFallback && (keywords || title || author)) {
        // Fallback to search link
        var searchQuery = buildSearchQuery({ keywords: keywords, title: title, author: author });
        var url = "".concat(baseUrl, "/s?k=").concat(encodeURIComponent(searchQuery), "&tag=").concat(affiliateTag);
        return {
            url: url,
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
function buildSearchQuery(_a) {
    var keywords = _a.keywords, title = _a.title, author = _a.author;
    var parts = [];
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
function validateAmazonUrl(url) {
    try {
        // Basic URL validation
        if (!url || typeof url !== 'string')
            return false;
        // Check if URL starts with a valid Amazon domain
        var amazonDomains = [
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
        var urlObj = new URL(url);
        var hostname_1 = urlObj.hostname;
        // Check if hostname matches any Amazon domain
        var isAmazonDomain = amazonDomains.some(function (domain) {
            return hostname_1 === domain || hostname_1.endsWith(".".concat(domain));
        });
        if (!isAmazonDomain)
            return false;
        // Check if affiliate tag is present (for affiliate links)
        if (url.includes('tag=')) {
            var tagMatch = url.match(/tag=([^&]+)/);
            if (!tagMatch || !tagMatch[1])
                return false;
        }
        return true;
    }
    catch (error) {
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
function convertToAffiliateUrl(existingUrl) {
    try {
        var urlObj = new URL(existingUrl);
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
        urlObj.searchParams.set('tag', affiliateConfig_1.AFFILIATE_TAG);
        var affiliateUrl = urlObj.toString();
        return {
            url: affiliateUrl,
            isAffiliateLink: true,
            isFallback: false,
            isValid: validateAmazonUrl(affiliateUrl)
        };
    }
    catch (error) {
        console.error('Failed to convert URL to affiliate URL:', error);
        // If conversion fails, try to generate a fallback
        var fallbackLink = createFallbackFromExistingUrl(existingUrl);
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
function createFallbackFromExistingUrl(url) {
    try {
        // Try to extract ASIN from URL
        var asinMatch = url.match(/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
        if (asinMatch && asinMatch[1]) {
            return generateAffiliateLink({ asin: asinMatch[1] });
        }
        // Try to extract search keywords from URL
        var urlObj = new URL(url);
        var searchParams = urlObj.searchParams;
        if (searchParams.has('k') || searchParams.has('keywords')) {
            var keywords = searchParams.get('k') || searchParams.get('keywords') || '';
            return generateAffiliateLink({ keywords: keywords });
        }
        return null;
    }
    catch (error) {
        console.error('Failed to create fallback from existing URL:', error);
        return null;
    }
}
/**
 * Open affiliate link with tracking and error handling
 */
function openAffiliateLink(url_1) {
    return __awaiter(this, arguments, void 0, function (url, options) {
        var bookTitle, bookId, pathwayName, supported, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bookTitle = options.bookTitle, bookId = options.bookId, pathwayName = options.pathwayName;
                    // Track the click (basic implementation)
                    trackAffiliateClick({
                        url: url,
                        bookTitle: bookTitle,
                        bookId: bookId,
                        pathwayName: pathwayName,
                        timestamp: new Date().toISOString()
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    // Check if we're using test affiliate tag
                    if ((0, affiliateConfig_1.isUsingTestAffiliateTag)()) {
                        console.log('Opening Amazon link with TEST affiliate tag:', url);
                        react_native_1.Alert.alert('Test Mode', 'This link uses a test affiliate tag. No real commissions will be earned.');
                    }
                    return [4 /*yield*/, react_native_1.Linking.canOpenURL(url)];
                case 2:
                    supported = _a.sent();
                    if (!supported) {
                        console.error('Cannot open URL:', url);
                        react_native_1.Alert.alert('Error', 'Cannot open this link. Please try again later.');
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, react_native_1.Linking.openURL(url)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, true];
                case 4:
                    error_1 = _a.sent();
                    console.error('Failed to open affiliate link:', error_1);
                    react_native_1.Alert.alert('Error', 'Failed to open the link. Please try again.');
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Basic affiliate click tracking (for analytics)
 *
 * This is a simple implementation that logs to console.
 * In production, you would send this data to your analytics service.
 */
function trackAffiliateClick(data) {
    console.log('Affiliate Click Tracked:', __assign(__assign({}, data), { affiliateTag: affiliateConfig_1.AFFILIATE_TAG, isTestMode: (0, affiliateConfig_1.isUsingTestAffiliateTag)() }));
    // In a real implementation, you would send this to your analytics backend
    // Example: analyticsService.track('affiliate_click', data);
}
/**
 * Get affiliate disclosure text
 */
function getAffiliateDisclosure() {
    return 'As an Amazon Associate, we earn from qualifying purchases. This helps support our educational platform.';
}
