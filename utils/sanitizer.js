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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeText = sanitizeText;
exports.sanitizeTextForDisplay = sanitizeTextForDisplay;
exports.extractUrlsFromText = extractUrlsFromText;
exports.getHostnameFromUrl = getHostnameFromUrl;
exports.isSafeUrl = isSafeUrl;
exports.sanitizeUrl = sanitizeUrl;
exports.containsMaliciousMarkup = containsMaliciousMarkup;
var DEFAULT_MAX_LENGTH = 5000;
function stripAsciiControlChars(input) {
    var out = '';
    for (var i = 0; i < input.length; i += 1) {
        var code = input.charCodeAt(i);
        // ASCII control chars (except \t \n \r which we keep for readability)
        var isControl = (code >= 0 && code <= 8) ||
            code === 11 ||
            code === 12 ||
            (code >= 14 && code <= 31) ||
            code === 127;
        if (isControl)
            continue;
        out += input[i];
    }
    return out;
}
function hasAsciiControlChars(input) {
    for (var i = 0; i < input.length; i += 1) {
        var code = input.charCodeAt(i);
        var isControl = (code >= 0 && code <= 31) || code === 127;
        if (isControl)
            return true;
    }
    return false;
}
function sanitizeText(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.maxLength, maxLength = _a === void 0 ? DEFAULT_MAX_LENGTH : _a, _b = options.preserveNewlines, preserveNewlines = _b === void 0 ? true : _b;
    if (typeof input !== 'string')
        return '';
    var output = input;
    output = output.split('\u0000').join('');
    output = output.replace(/[\u200B-\u200D\uFEFF]/g, '');
    output = output.replace(/<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/gi, '[removed]');
    output = output.replace(/<\s*iframe[\s\S]*?>[\s\S]*?<\s*\/\s*iframe\s*>/gi, '[removed]');
    output = stripAsciiControlChars(output);
    if (!preserveNewlines) {
        output = output.replace(/\s+/g, ' ');
    }
    output = output.trim();
    if (output.length > maxLength) {
        output = output.slice(0, maxLength);
    }
    return output;
}
function sanitizeTextForDisplay(input, options) {
    if (options === void 0) { options = {}; }
    return sanitizeText(input, __assign({ preserveNewlines: true }, options));
}
function extractUrlsFromText(text) {
    if (!text)
        return [];
    var urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi;
    var matches = text.match(urlRegex);
    return matches ? Array.from(new Set(matches)) : [];
}
function getHostnameFromUrl(url) {
    try {
        var normalized = url.trim();
        var match = normalized.match(/^https?:\/\/(.*?)(?:\/[\s\S]*)?$/i);
        if (!match)
            return null;
        var hostPort = match[1];
        var host = hostPort.split(':')[0];
        return host.toLowerCase();
    }
    catch (_a) {
        return null;
    }
}
function isSafeUrl(url, options) {
    if (options === void 0) { options = {}; }
    if (!url || typeof url !== 'string')
        return false;
    var normalized = url.trim();
    if (normalized.length > 2048)
        return false;
    var lower = normalized.toLowerCase();
    if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) {
        return false;
    }
    if (!/^https?:\/\//i.test(normalized))
        return false;
    if (/\s/.test(normalized))
        return false;
    if (hasAsciiControlChars(normalized))
        return false;
    var hostname = getHostnameFromUrl(normalized);
    if (!hostname)
        return false;
    var allowlistDomains = options.allowlistDomains;
    if (allowlistDomains && allowlistDomains.length > 0) {
        return allowlistDomains.some(function (d) { return hostname === d || hostname.endsWith(".".concat(d)); });
    }
    return true;
}
function sanitizeUrl(url, options) {
    if (options === void 0) { options = {}; }
    var normalized = url === null || url === void 0 ? void 0 : url.trim();
    if (!normalized)
        return null;
    return isSafeUrl(normalized, options) ? normalized : null;
}
function containsMaliciousMarkup(text) {
    var lower = (text || '').toLowerCase();
    return (lower.includes('<script') ||
        lower.includes('javascript:') ||
        lower.includes('<iframe') ||
        lower.includes('onerror=') ||
        lower.includes('onload='));
}
