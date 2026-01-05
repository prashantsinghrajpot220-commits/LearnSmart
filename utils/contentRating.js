"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxRating = maxRating;
exports.getMaxAllowedRatingForAgeGroup = getMaxAllowedRatingForAgeGroup;
exports.isRatingAllowedForAgeGroup = isRatingAllowedForAgeGroup;
exports.deriveRatingFromFlags = deriveRatingFromFlags;
var content_1 = require("@/types/content");
var RATING_ORDER = (_a = {},
    _a[content_1.ContentRating.G] = 0,
    _a[content_1.ContentRating.PG] = 1,
    _a[content_1.ContentRating.PG13] = 2,
    _a[content_1.ContentRating.R] = 3,
    _a[content_1.ContentRating.NC17] = 4,
    _a);
function maxRating(a, b) {
    return RATING_ORDER[a] >= RATING_ORDER[b] ? a : b;
}
function getMaxAllowedRatingForAgeGroup(ageGroup) {
    return ageGroup === 'under12' ? content_1.ContentRating.PG : content_1.ContentRating.PG13;
}
function isRatingAllowedForAgeGroup(ageGroup, rating) {
    return RATING_ORDER[rating] <= RATING_ORDER[getMaxAllowedRatingForAgeGroup(ageGroup)];
}
function deriveRatingFromFlags(flags) {
    if (flags.some(function (f) { return f.category === 'sexual_minors'; }))
        return content_1.ContentRating.NC17;
    if (flags.some(function (f) {
        return (f.category === 'sexual' && f.severity === 'high') ||
            (f.category === 'self_harm' && f.severity === 'high') ||
            (f.category === 'hate' && f.severity === 'high');
    })) {
        return content_1.ContentRating.R;
    }
    if (flags.some(function (f) {
        return f.category === 'violence' ||
            f.category === 'drugs' ||
            f.category === 'weapons' ||
            f.category === 'harassment' ||
            f.category === 'profanity';
    })) {
        return content_1.ContentRating.PG13;
    }
    if (flags.some(function (f) { return f.category === 'spam'; }))
        return content_1.ContentRating.PG;
    return content_1.ContentRating.G;
}
