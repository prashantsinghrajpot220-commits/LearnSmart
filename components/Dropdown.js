"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dropdown;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var ThemeContext_1 = require("./ThemeContext");
var screenWidth = react_native_1.Dimensions.get('window').width;
function Dropdown(_a) {
    var label = _a.label, value = _a.value, options = _a.options, onSelect = _a.onSelect, _b = _a.placeholder, placeholder = _b === void 0 ? 'Select an option' : _b;
    var _c = (0, react_1.useState)(false), isOpen = _c[0], setIsOpen = _c[1];
    var colors = (0, ThemeContext_1.useTheme)().colors;
    var handleSelect = function (option) {
        onSelect(option);
        setIsOpen(false);
    };
    var styles = getStyles(colors);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Text style={styles.label}>{label}</react_native_1.Text>
      <react_native_1.TouchableOpacity style={styles.dropdown} onPress={function () { return setIsOpen(true); }} activeOpacity={0.7}>
        <react_native_1.Text style={[styles.text, !value && styles.placeholder]}>
          {value || placeholder}
        </react_native_1.Text>
        <react_native_1.Text style={styles.arrow}>▼</react_native_1.Text>
      </react_native_1.TouchableOpacity>

      <react_native_1.Modal visible={isOpen} transparent animationType="fade" onRequestClose={function () { return setIsOpen(false); }}>
        <react_native_1.TouchableWithoutFeedback onPress={function () { return setIsOpen(false); }}>
          <react_native_1.View style={styles.modalOverlay}>
            <react_native_1.View style={[styles.modalContent, { width: react_native_1.Platform.OS === 'web' ? 400 : screenWidth - 64 }]}>
              <react_native_1.FlatList data={options} keyExtractor={function (item) { return item; }} renderItem={function (_a) {
            var item = _a.item;
            return (<react_native_1.TouchableOpacity style={[
                    styles.option,
                    value === item && styles.selectedOption,
                ]} onPress={function () { return handleSelect(item); }} activeOpacity={0.7}>
                    <react_native_1.Text style={[
                    styles.optionText,
                    value === item && styles.selectedOptionText,
                ]}>
                      {item}
                    </react_native_1.Text>
                  </react_native_1.TouchableOpacity>);
        }} showsVerticalScrollIndicator={false}/>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.TouchableWithoutFeedback>
      </react_native_1.Modal>
    </react_native_1.View>);
}
var getStyles = function (colors) { return react_native_1.StyleSheet.create({
    container: {
        marginBottom: theme_1.Spacing.lg,
        width: '100%',
    },
    label: {
        fontSize: theme_1.FontSizes.md,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.text,
        marginBottom: theme_1.Spacing.sm,
    },
    dropdown: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        paddingHorizontal: theme_1.Spacing.md,
        paddingVertical: theme_1.Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.lightGray,
        minHeight: 52,
    },
    text: {
        fontSize: theme_1.FontSizes.md,
        color: colors.text,
        flex: 1,
    },
    placeholder: {
        color: colors.textSecondary,
    },
    arrow: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.xl,
    },
    modalContent: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        maxHeight: 400,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    option: {
        paddingHorizontal: theme_1.Spacing.lg,
        paddingVertical: theme_1.Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    selectedOption: {
        backgroundColor: colors.primary,
    },
    optionText: {
        fontSize: theme_1.FontSizes.md,
        color: colors.text,
    },
    selectedOptionText: {
        color: colors.white,
        fontWeight: theme_1.FontWeights.semibold,
    },
}); };
