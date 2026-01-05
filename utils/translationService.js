"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateStaticText = exports.getLanguageInstruction = void 0;
var getLanguageInstruction = function (lang) {
    switch (lang) {
        case 'hi':
            return 'Please respond in Hindi (Devanagari script).';
        case 'hinglish':
            return 'Please respond in Hinglish (a mix of Hindi and English in Roman script). Use a friendly, conversational tone.';
        default:
            return 'Please respond in English.';
    }
};
exports.getLanguageInstruction = getLanguageInstruction;
var translateStaticText = function (text, _lang) {
    // For UI elements that might need translation
    // This is a placeholder for a more comprehensive translation system
    return text;
};
exports.translateStaticText = translateStaticText;
