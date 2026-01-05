"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestIds = exports.BannerAdSize = exports.BannerAd = void 0;
var BannerAd = function () { return null; };
exports.BannerAd = BannerAd;
exports.BannerAdSize = {
    ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
    BANNER: 'BANNER',
    FULL_BANNER: 'FULL_BANNER',
    LARGE_BANNER: 'LARGE_BANNER',
    LEARNED_RECTANGLE: 'LEARNED_RECTANGLE',
    MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
    SMART_BANNER: 'SMART_BANNER',
    WIDE_SKYSCRAPER: 'WIDE_SKYSCRAPER',
    ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
};
exports.TestIds = {
    BANNER: 'test-id',
    INTERSTITIAL: 'test-id',
    REWARDED: 'test-id',
};
var mobileAds = function () { return ({
    initialize: function () { return Promise.resolve({}); },
    setRequestConfiguration: function () { return Promise.resolve({}); },
}); };
exports.default = mobileAds;
