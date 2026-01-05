"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AvatarStoreScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/ThemeContext");
var userStore_1 = require("@/store/userStore");
var xpStore_1 = require("@/store/xpStore");
var avatarStore_1 = require("@/data/avatarStore");
var AvatarCard_1 = require("@/components/AvatarCard");
var CoinDisplay_1 = require("@/components/CoinDisplay");
var theme_1 = require("@/constants/theme");
var vector_icons_1 = require("@expo/vector-icons");
function AvatarStoreScreen() {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, userStore_1.useUserStore)(), gamificationData = _a.gamificationData, selectedAvatar = _a.selectedAvatar;
    var currentXP = (0, xpStore_1.useXPStore)().currentXP;
    var _b = (0, react_1.useState)('all'), selectedCategory = _b[0], setSelectedCategory = _b[1];
    var categories = [
        { id: 'all', name: 'All', icon: 'apps' },
        { id: 'robot', name: 'Robots', icon: 'robot' },
        { id: 'animal', name: 'Animals', icon: 'paw' },
        { id: 'character', name: 'Characters', icon: 'account' },
        { id: 'fantasy', name: 'Fantasy', icon: 'magic-wand' },
    ];
    var getFilteredAvatars = function () {
        if (selectedCategory === 'all') {
            return avatarStore_1.AVATAR_STORE;
        }
        return (0, avatarStore_1.getAvatarsByCategory)(selectedCategory);
    };
    var getAvatarStatus = function (avatar) {
        var isUnlocked = (0, avatarStore_1.isAvatarUnlocked)(avatar.id, xpStore_1.useXPStore.getState().getRank().name, { totalLessonsRead: 0, totalQuizzesCompleted: 0 }) || gamificationData.unlockedAvatars.includes(avatar.id);
        var isPurchased = gamificationData.purchasedAvatars.includes(avatar.id);
        return { isUnlocked: isUnlocked, isPurchased: isPurchased };
    };
    var handleAvatarSelect = function (avatar) {
        react_native_1.Alert.alert('Avatar Selected!', "".concat(avatar.name, " is now your active avatar."), [{ text: 'Great!' }]);
    };
    var renderAvatarItem = function (_a) {
        var item = _a.item;
        var _b = getAvatarStatus(item), isUnlocked = _b.isUnlocked, isPurchased = _b.isPurchased;
        var isSelected = selectedAvatar === item.id;
        return (<AvatarCard_1.default avatar={item} isUnlocked={isUnlocked} isPurchased={isPurchased} isSelected={isSelected} onPurchase={handleAvatarSelect} onSelect={handleAvatarSelect}/>);
    };
    var renderCategoryButton = function (category) {
        var isSelected = selectedCategory === category.id;
        return (<react_native_1.TouchableOpacity key={category.id} style={[
                styles.categoryButton,
                {
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                    borderColor: colors.primary
                }
            ]} onPress={function () { return setSelectedCategory(category.id); }}>
        <vector_icons_1.MaterialCommunityIcons name={category.icon} size={20} color={isSelected ? 'white' : colors.text}/>
        <react_native_1.Text style={[
                styles.categoryButtonText,
                { color: isSelected ? 'white' : colors.text }
            ]}>
          {category.name}
        </react_native_1.Text>
      </react_native_1.TouchableOpacity>);
    };
    var styles = getStyles(colors);
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={[styles.title, { color: colors.text }]}>
          Avatar Store
        </react_native_1.Text>
        <react_native_1.Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize your learning companion
        </react_native_1.Text>
        
        {/* Coin Balance */}
        <react_native_1.View style={styles.balanceContainer}>
          <CoinDisplay_1.default size="medium" animated={true}/>
        </react_native_1.View>
      </react_native_1.View>

      {/* Categories */}
      <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer} contentContainerStyle={styles.categoryContent}>
        {categories.map(renderCategoryButton)}
      </react_native_1.ScrollView>

      {/* Avatar Grid */}
      <react_native_1.FlatList data={getFilteredAvatars()} renderItem={renderAvatarItem} keyExtractor={function (item) { return item.id; }} style={styles.avatarList} contentContainerStyle={styles.avatarListContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<react_native_1.View style={styles.emptyState}>
            <vector_icons_1.MaterialCommunityIcons name="emoticon-sad-outline" size={64} color={colors.textSecondary}/>
            <react_native_1.Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No avatars found in this category
            </react_native_1.Text>
          </react_native_1.View>}/>

      {/* Bottom Info */}
      <react_native_1.View style={[styles.infoContainer, { backgroundColor: colors.cardBackground }]}>
        <vector_icons_1.MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary}/>
        <react_native_1.Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Earn SmartCoins by completing lessons and quizzes to unlock new avatars!
        </react_native_1.Text>
      </react_native_1.View>
    </react_native_1.SafeAreaView>);
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: theme_1.Spacing.lg,
        alignItems: 'center',
    },
    title: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: theme_1.FontSizes.sm,
        marginBottom: theme_1.Spacing.md,
    },
    balanceContainer: {
        marginTop: theme_1.Spacing.sm,
    },
    categoryContainer: {
        maxHeight: 60,
    },
    categoryContent: {
        paddingHorizontal: theme_1.Spacing.lg,
        paddingVertical: theme_1.Spacing.sm,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.lg,
        borderWidth: 1,
        marginRight: theme_1.Spacing.sm,
    },
    categoryButtonText: {
        fontSize: theme_1.FontSizes.sm,
        fontWeight: theme_1.FontWeights.bold,
        marginLeft: 6,
    },
    avatarList: {
        flex: 1,
    },
    avatarListContent: {
        padding: theme_1.Spacing.lg,
        paddingTop: 0,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: theme_1.Spacing.xl,
    },
    emptyStateText: {
        fontSize: theme_1.FontSizes.md,
        marginTop: theme_1.Spacing.md,
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme_1.Spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    infoText: {
        flex: 1,
        fontSize: theme_1.FontSizes.sm,
        marginLeft: theme_1.Spacing.sm,
    },
}); };
