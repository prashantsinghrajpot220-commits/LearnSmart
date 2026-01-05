"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StreamSelectionModal;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
var userStore_1 = require("@/store/userStore");
var ThemeContext_1 = require("./ThemeContext");
var screenWidth = react_native_1.Dimensions.get('window').width;
var STREAM_OPTIONS = [
    {
        id: 'Science',
        title: 'Science',
        subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
        description: 'For students aspiring to be engineers, doctors, or scientists',
        color: '#4A90A4',
    },
    {
        id: 'Commerce',
        title: 'Commerce',
        subjects: ['Economics', 'Accounts', 'Business Studies', 'Mathematics', 'English'],
        description: 'For students interested in business, finance, or entrepreneurship',
        color: '#7A9268',
    },
    {
        id: 'Arts',
        title: 'Arts',
        subjects: ['History', 'Geography', 'Political Science', 'English', 'Hindi'],
        description: 'For students passionate about humanities, creativity, or social sciences',
        color: '#A4846C',
    },
];
function StreamSelectionModal(_a) {
    var visible = _a.visible, onClose = _a.onClose;
    var _b = (0, userStore_1.useUserStore)(), selectedStream = _b.selectedStream, setSelectedStream = _b.setSelectedStream;
    var _c = react_1.default.useState(selectedStream), selectedId = _c[0], setSelectedId = _c[1];
    var _d = (0, ThemeContext_1.useTheme)(), colors = _d.colors, isDark = _d.isDark;
    react_1.default.useEffect(function () {
        if (visible && selectedStream) {
            setSelectedId(selectedStream);
        }
    }, [visible, selectedStream]);
    var handleSelect = function (streamId) {
        setSelectedId(streamId);
    };
    var handleConfirm = function () {
        if (selectedId) {
            setSelectedStream(selectedId);
            onClose();
        }
    };
    var styles = getStyles(colors, isDark);
    return (<react_native_1.Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <react_native_1.View style={styles.modalOverlay}>
        <react_native_1.View style={[
            styles.modalContent,
            { width: react_native_1.Platform.select({ web: 420, default: screenWidth - 48 }) },
        ]}>
          <react_native_1.View style={styles.header}>
            <react_native_1.Text style={styles.title}>Select Your Stream</react_native_1.Text>
            <react_native_1.Text style={styles.subtitle}>
              Choose the stream that best fits your interests and career goals
            </react_native_1.Text>
          </react_native_1.View>

          <react_native_1.View style={styles.optionsContainer}>
            {STREAM_OPTIONS.map(function (stream) { return (<react_native_1.TouchableOpacity key={stream.id} style={[
                styles.optionCard,
                selectedId === stream.id && styles.selectedOption,
            ]} onPress={function () { return handleSelect(stream.id); }} activeOpacity={0.7}>
                <react_native_1.View style={[
                styles.colorIndicator,
                { backgroundColor: stream.color },
            ]}/>
                <react_native_1.View style={styles.optionContent}>
                  <react_native_1.Text style={styles.optionTitle}>{stream.title}</react_native_1.Text>
                  <react_native_1.Text style={styles.optionDescription}>{stream.description}</react_native_1.Text>
                  <react_native_1.View style={styles.subjectsContainer}>
                    {stream.subjects.slice(0, 3).map(function (subject) { return (<react_native_1.View key={subject} style={styles.subjectChip}>
                        <react_native_1.Text style={styles.subjectChipText}>{subject}</react_native_1.Text>
                      </react_native_1.View>); })}
                    {stream.subjects.length > 3 && (<react_native_1.View style={styles.subjectChip}>
                        <react_native_1.Text style={styles.subjectChipText}>+{stream.subjects.length - 3}</react_native_1.Text>
                      </react_native_1.View>)}
                  </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={[styles.radioButton, selectedId === stream.id && styles.radioButtonSelected]}>
                  {selectedId === stream.id && <react_native_1.View style={styles.radioButtonInner}/>}
                </react_native_1.View>
              </react_native_1.TouchableOpacity>); })}
          </react_native_1.View>

          <react_native_1.View style={styles.footer}>
            <react_native_1.TouchableOpacity style={[styles.confirmButton, !selectedId && styles.confirmButtonDisabled]} onPress={handleConfirm} disabled={!selectedId} activeOpacity={0.8}>
              <react_native_1.Text style={styles.confirmButtonText}>Continue</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Modal>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme_1.Spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        maxHeight: '80%',
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        padding: theme_1.Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    title: {
        fontSize: theme_1.FontSizes.xl,
        fontWeight: theme_1.FontWeights.bold,
        color: colors.text,
        marginBottom: theme_1.Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: theme_1.FontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    optionsContainer: {
        padding: theme_1.Spacing.lg,
    },
    optionCard: {
        backgroundColor: colors.background,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.md,
        marginBottom: theme_1.Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedOption: {
        borderColor: colors.primary,
        backgroundColor: isDark ? '#2C3E2C' : '#F8FAF7',
    },
    colorIndicator: {
        width: 4,
        height: '100%',
        minHeight: 60,
        borderRadius: 2,
        marginRight: theme_1.Spacing.md,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.text,
        marginBottom: 2,
    },
    optionDescription: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
        marginBottom: theme_1.Spacing.sm,
        lineHeight: 16,
    },
    subjectsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    subjectChip: {
        backgroundColor: colors.cardBackground,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: theme_1.BorderRadius.sm,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    subjectChipText: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme_1.Spacing.sm,
    },
    radioButtonSelected: {
        borderColor: colors.primary,
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
    footer: {
        padding: theme_1.Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    confirmButton: {
        backgroundColor: colors.primary,
        paddingVertical: theme_1.Spacing.md,
        borderRadius: theme_1.BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: colors.lightGray,
    },
    confirmButtonText: {
        fontSize: theme_1.FontSizes.lg,
        fontWeight: theme_1.FontWeights.semibold,
        color: colors.white,
    },
}); };
