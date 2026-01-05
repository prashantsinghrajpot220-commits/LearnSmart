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
exports.default = RankBadge;
var react_1 = require("react");
var react_native_1 = require("react-native");
var xpStore_1 = require("@/store/xpStore");
var userStore_1 = require("@/store/userStore");
var theme_1 = require("@/constants/theme");
function RankBadge(_a) {
    var _b = _a.size, size = _b === void 0 ? 'medium' : _b, _c = _a.showProgress, showProgress = _c === void 0 ? false : _c, _d = _a.clickable, clickable = _d === void 0 ? false : _d, onPress = _a.onPress, style = _a.style;
    var _e = (0, xpStore_1.useCurrentRank)(), rank = _e.rank, progress = _e.progress, xpToNext = _e.xpToNext;
    var gamificationData = (0, userStore_1.useUserStore)().gamificationData;
    var getSize = function () {
        switch (size) {
            case 'small':
                return {
                    container: { padding: 6, borderRadius: 12 },
                    icon: 16,
                    name: theme_1.FontSizes.xs,
                    progress: theme_1.FontSizes.xs,
                };
            case 'large':
                return {
                    container: { padding: 16, borderRadius: 20 },
                    icon: 32,
                    name: theme_1.FontSizes.lg,
                    progress: theme_1.FontSizes.sm,
                };
            default:
                return {
                    container: { padding: 10, borderRadius: 16 },
                    icon: 24,
                    name: theme_1.FontSizes.md,
                    progress: theme_1.FontSizes.xs,
                };
        }
    };
    var sizeConfig = getSize();
    var styles = getStyles(rank.color, sizeConfig);
    var BadgeComponent = (<react_native_1.View style={[styles.container, sizeConfig.container, style]}>
      <react_native_1.Text style={[styles.icon, { fontSize: sizeConfig.icon }]}>{rank.icon}</react_native_1.Text>
      <react_native_1.View style={styles.textContainer}>
        <react_native_1.Text style={[styles.rankName, { fontSize: sizeConfig.name }]}>{rank.name}</react_native_1.Text>
        {showProgress && xpToNext > 0 && (<react_native_1.Text style={[styles.progress, { fontSize: sizeConfig.progress }]}>
            {xpToNext} XP to {rank.name === 'Guru' ? 'Max' : 'Next'}
          </react_native_1.Text>)}
      </react_native_1.View>
    </react_native_1.View>);
    if (clickable && onPress) {
        return (<react_native_1.TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {BadgeComponent}
      </react_native_1.TouchableOpacity>);
    }
    return BadgeComponent;
}
var getStyles = function (color, sizeConfig) { return react_native_1.StyleSheet.create({
    container: __assign({ flexDirection: 'row', alignItems: 'center', backgroundColor: color + '20', borderWidth: 2, borderColor: color }, sizeConfig.container),
    icon: {
        marginRight: 8,
    },
    textContainer: {
        flex: 1,
    },
    rankName: {
        fontWeight: theme_1.FontWeights.bold,
        color: color,
        marginBottom: 2,
    },
    progress: {
        color: '#666666',
        fontWeight: theme_1.FontWeights.medium,
    },
}); };
