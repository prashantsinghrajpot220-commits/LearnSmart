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
exports.default = AvatarCard;
var react_1 = require("react");
var react_native_1 = require("react-native");
var userStore_1 = require("@/store/userStore");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
var vector_icons_1 = require("@expo/vector-icons");
function AvatarCard(_a) {
    var _this = this;
    var avatar = _a.avatar, isUnlocked = _a.isUnlocked, isPurchased = _a.isPurchased, onPurchase = _a.onPurchase, onSelect = _a.onSelect, _b = _a.isSelected, isSelected = _b === void 0 ? false : _b, style = _a.style;
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _c = (0, userStore_1.useUserStore)(), gamificationData = _c.gamificationData, purchaseAvatar = _c.purchaseAvatar, setSelectedAvatar = _c.setSelectedAvatar;
    var handlePurchase = function () { return __awaiter(_this, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (gamificationData.smartCoins < avatar.cost) {
                        react_native_1.Alert.alert('Insufficient SmartCoins', "You need ".concat(avatar.cost - gamificationData.smartCoins, " more SmartCoins to purchase this avatar."), [{ text: 'OK' }]);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, purchaseAvatar(avatar.id, avatar.cost)];
                case 1:
                    success = _a.sent();
                    if (success) {
                        react_native_1.Alert.alert('Avatar Unlocked! 🎉', "".concat(avatar.name, " has been added to your collection!"), [{ text: 'Great!' }]);
                        onPurchase === null || onPurchase === void 0 ? void 0 : onPurchase(avatar);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSelect = function () {
        if (isPurchased && onSelect) {
            setSelectedAvatar(avatar.id);
            onSelect(avatar);
        }
    };
    var styles = getStyles(colors, isSelected, isUnlocked, isPurchased);
    return (<react_native_1.View style={[styles.container, style]}>
      {/* Avatar Display */}
      <react_native_1.View style={styles.avatarContainer}>
        <react_native_1.Text style={styles.avatarEmoji}>{avatar.emoji}</react_native_1.Text>
        {isSelected && (<react_native_1.View style={styles.selectedBadge}>
            <vector_icons_1.MaterialCommunityIcons name="check" size={16} color="white"/>
          </react_native_1.View>)}
        {isPurchased && (<react_native_1.View style={styles.purchasedBadge}>
            <vector_icons_1.MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50"/>
          </react_native_1.View>)}
      </react_native_1.View>

      {/* Avatar Info */}
      <react_native_1.View style={styles.infoContainer}>
        <react_native_1.Text style={[styles.name, { color: colors.text }]}>
          {avatar.name}
        </react_native_1.Text>
        <react_native_1.Text style={[styles.description, { color: colors.textSecondary }]}>
          {avatar.description}
        </react_native_1.Text>
        
        {/* Cost or Status */}
        <react_native_1.View style={styles.actionContainer}>
          {isPurchased ? (<react_native_1.TouchableOpacity style={[styles.selectButton, { backgroundColor: isSelected ? colors.primary : colors.primary + '40' }]} onPress={handleSelect}>
              <react_native_1.Text style={[styles.selectButtonText, { color: isSelected ? 'white' : colors.text }]}>
                {isSelected ? 'Selected' : 'Select'}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>) : isUnlocked ? (<react_native_1.TouchableOpacity style={[styles.purchaseButton, { backgroundColor: gamificationData.smartCoins >= avatar.cost ? '#FFD700' : '#CCCCCC' }]} onPress={handlePurchase} disabled={gamificationData.smartCoins < avatar.cost}>
              <vector_icons_1.MaterialCommunityIcons name="currency-usd" size={16} color="#FFA500"/>
              <react_native_1.Text style={[styles.purchaseButtonText, { color: gamificationData.smartCoins >= avatar.cost ? '#333' : '#666' }]}>
                {avatar.cost}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>) : (<react_native_1.View style={styles.lockedContainer}>
              <vector_icons_1.MaterialCommunityIcons name="lock" size={16} color={colors.textSecondary}/>
              <react_native_1.Text style={[styles.lockedText, { color: colors.textSecondary }]}>
                Locked
              </react_native_1.Text>
            </react_native_1.View>)}
        </react_native_1.View>

        {/* Unlock Condition */}
        {avatar.unlockCondition && !isUnlocked && (<react_native_1.Text style={[styles.unlockCondition, { color: colors.textSecondary }]}>
            {avatar.unlockCondition}
          </react_native_1.Text>)}
      </react_native_1.View>
    </react_native_1.View>);
}
var getStyles = function (colors, isSelected, isUnlocked, isPurchased) { return react_native_1.StyleSheet.create({
    container: __assign({ backgroundColor: isSelected ? '#B2AC8820' : colors.cardBackground, borderRadius: theme_1.BorderRadius.lg, padding: theme_1.Spacing.md, marginBottom: theme_1.Spacing.md, borderWidth: isSelected ? 2 : 1, borderColor: isSelected ? '#B2AC88' : colors.lightGray }, react_native_1.Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
        },
        android: { elevation: 2 },
    })),
    avatarContainer: {
        alignItems: 'center',
        marginBottom: theme_1.Spacing.md,
        position: 'relative',
    },
    avatarEmoji: {
        fontSize: 48,
    },
    selectedBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    purchasedBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        alignItems: 'center',
    },
    name: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: 4,
        textAlign: 'center',
    },
    description: {
        fontSize: theme_1.FontSizes.sm,
        textAlign: 'center',
        marginBottom: theme_1.Spacing.md,
    },
    actionContainer: {
        alignItems: 'center',
    },
    selectButton: {
        paddingHorizontal: theme_1.Spacing.lg,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.md,
        minWidth: 80,
        alignItems: 'center',
    },
    selectButtonText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.bold,
    },
    purchaseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.lg,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.md,
        minWidth: 80,
    },
    purchaseButtonText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.bold,
        marginLeft: 4,
    },
    lockedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.sm,
        backgroundColor: colors.lightGray + '50',
        borderRadius: theme_1.BorderRadius.md,
    },
    lockedText: {
        fontSize: theme_1.FontSizes.sm,
        marginLeft: 4,
    },
    unlockCondition: {
        fontSize: theme_1.FontSizes.xs,
        textAlign: 'center',
        marginTop: theme_1.Spacing.sm,
        fontStyle: 'italic',
    },
}); };
