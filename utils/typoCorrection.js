"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correctTypos = void 0;
var STUDY_DICTIONARY = {
    'intgral': 'integral',
    'diffrentiation': 'differentiation',
    'photosynthsis': 'photosynthesis',
    'gravitaton': 'gravitation',
    'algeba': 'algebra',
    'chemisty': 'chemistry',
    'biolgy': 'biology',
    'physcs': 'physics',
    'geometery': 'geometry',
    'trignometry': 'trigonometry',
    // Hinglish common typos
    'samjh': 'samajh',
    'smjh': 'samajh',
    'krte': 'karte',
    'kya h': 'kya hai',
    'smjhao': 'samjhao',
};
var correctTypos = function (text) {
    var correctedText = text;
    Object.keys(STUDY_DICTIONARY).forEach(function (typo) {
        var regex = new RegExp("\\b".concat(typo, "\\b"), 'gi');
        correctedText = correctedText.replace(regex, STUDY_DICTIONARY[typo]);
    });
    return correctedText;
};
exports.correctTypos = correctTypos;
