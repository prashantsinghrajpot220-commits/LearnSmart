"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLanguage = void 0;
var detectLanguage = function (text) {
    var hindiRegex = /[\u0900-\u097F]/;
    if (hindiRegex.test(text)) {
        return 'hi';
    }
    // Hinglish detection is tricky, but often involves common Hindi words in Roman script
    var hinglishKeywords = [
        'kya', 'hai', 'kaise', 'hota', 'hai', 'mujhe', 'samajh', 'nahi', 'aa', 'raha',
        'krte', 'ho', 'mein', 'samjhao', 'btao', 'kab', 'kon', 'kahan'
    ];
    var words = text.toLowerCase().split(/\s+/);
    var hinglishCount = words.filter(function (word) { return hinglishKeywords.includes(word); }).length;
    if (hinglishCount > 0) {
        return 'hinglish';
    }
    return 'en';
};
exports.detectLanguage = detectLanguage;
