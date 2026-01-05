"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarSelector = exports.AvatarDisplay = exports.AVATARS = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var ThemeContext_1 = require("./ThemeContext");
var userStore_1 = require("@/store/userStore");
var theme_1 = require("@/constants/theme");
exports.AVATARS = [
    { id: 'Robot', icon: 'robot', color: '#FF9F6D' },
    { id: 'Owl', icon: 'owl', color: '#9CAF88' },
    { id: 'Book', icon: 'book-open-variant', color: '#5D8AA8' },
    { id: 'Brain', icon: 'brain', color: '#9B7EBD' },
    { id: 'Star', icon: 'star', color: '#FFD700' },
];
var AvatarDisplay = function (_a) {
    var id = _a.id, _b = _a.size, size = _b === void 0 ? 50 : _b, style = _a.style;
    var avatar = exports.AVATARS.find(function (a) { return a.id === id; }) || exports.AVATARS[0];
    return (<react_native_1.View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: avatar.color + '20' }, style]}>
      <vector_icons_1.MaterialCommunityIcons name={avatar.icon} size={size * 0.6} color={avatar.color}/>
    </react_native_1.View>);
};
exports.AvatarDisplay = AvatarDisplay;
var AvatarSelector = function () {
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var _a = (0, userStore_1.useUserStore)(), selectedAvatar = _a.selectedAvatar, setSelectedAvatar = _a.setSelectedAvatar;
    var renderItem = function (_a) {
        var item = _a.item;
        var isSelected = selectedAvatar === item.id;
        return (<react_native_1.TouchableOpacity style={[
                styles.selectorItem,
                { borderColor: isSelected ? colors.primary : 'transparent' }
            ]} onPress={function () { return setSelectedAvatar(item.id); }}>
        <exports.AvatarDisplay id={item.id} size={60}/>
        <react_native_1.Text style={[styles.avatarName, { color: colors.text, fontWeight: isSelected ? '700' : '400' }]}>{item.id}</react_native_1.Text>
      </react_native_1.TouchableOpacity>);
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.FlatList data={exports.AVATARS} renderItem={renderItem} keyExtractor={function (item) { return item.id; }} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContent}/>
    </react_native_1.View>);
};
exports.AvatarSelector = AvatarSelector;
var styles = react_native_1.StyleSheet.create({
    container: {
        marginVertical: theme_1.Spacing.md,
    },
    listContent: {
        paddingHorizontal: theme_1.Spacing.md,
    },
    selectorItem: {
        alignItems: 'center',
        marginHorizontal: theme_1.Spacing.sm,
        padding: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.lg,
        borderWidth: 2,
    },
    avatarCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme_1.Spacing.xs,
    },
    avatarName: {
        fontSize: theme_1.FontSizes.xs,
        marginTop: theme_1.Spacing.xs,
    },
});
