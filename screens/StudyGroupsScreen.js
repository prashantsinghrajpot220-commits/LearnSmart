"use strict";
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
exports.default = StudyGroupsScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var ThemeContext_1 = require("@/components/ThemeContext");
var theme_1 = require("@/constants/theme");
var GroupCard_1 = require("@/components/GroupCard");
var StudyGroupService_1 = require("@/services/StudyGroupService");
function StudyGroupsScreen() {
    var _this = this;
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var router = (0, expo_router_1.useRouter)();
    var _b = (0, react_1.useState)([]), groups = _b[0], setGroups = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(false), createVisible = _d[0], setCreateVisible = _d[1];
    var _e = (0, react_1.useState)(''), groupName = _e[0], setGroupName = _e[1];
    var _f = (0, react_1.useState)(''), groupDescription = _f[0], setGroupDescription = _f[1];
    var _g = (0, react_1.useState)('👥'), groupIcon = _g[0], setGroupIcon = _g[1];
    var _h = (0, react_1.useState)(true), isPrivate = _h[0], setIsPrivate = _h[1];
    var _j = (0, react_1.useState)(''), joinCode = _j[0], setJoinCode = _j[1];
    var refresh = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var myGroups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 2, 3]);
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.getMyGroups()];
                case 1:
                    myGroups = _a.sent();
                    setGroups(myGroups);
                    return [3 /*break*/, 3];
                case 2:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 3: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        refresh();
        var unsub = StudyGroupService_1.studyGroupService.subscribeToGroups(function () {
            refresh();
        });
        return unsub;
    }, [refresh]);
    var styles = (0, react_1.useMemo)(function () { return getStyles(colors, isDark); }, [colors, isDark]);
    var handleOpenGroup = function (groupId) {
        router.push("/group/".concat(groupId));
    };
    var handleCreateGroup = function () { return __awaiter(_this, void 0, void 0, function () {
        var group, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!groupName.trim()) {
                        react_native_1.Alert.alert('Missing name', 'Please enter a group name.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.createGroup({
                            name: groupName,
                            description: groupDescription || 'A study group for learning together.',
                            icon: groupIcon || '👥',
                            isPrivate: isPrivate,
                        })];
                case 1:
                    group = _a.sent();
                    setCreateVisible(false);
                    setGroupName('');
                    setGroupDescription('');
                    setGroupIcon('👥');
                    setIsPrivate(true);
                    router.push("/group/".concat(group.id));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    react_native_1.Alert.alert('Could not create group', error_1 instanceof Error ? error_1.message : 'Please try again.');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleJoinGroup = function () { return __awaiter(_this, void 0, void 0, function () {
        var group, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!joinCode.trim()) {
                        react_native_1.Alert.alert('Missing code', 'Paste an invite code or group ID to join.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, StudyGroupService_1.studyGroupService.joinGroupByCode(joinCode)];
                case 1:
                    group = _a.sent();
                    setJoinCode('');
                    router.push("/group/".concat(group.id));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    react_native_1.Alert.alert('Could not join group', error_2 instanceof Error ? error_2.message : 'Please try again.');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<react_native_1.SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <react_native_1.ScrollView contentContainerStyle={styles.content}>
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.title}>Study Groups</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>Create a private group, chat, share notes and compete in quizzes.</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.actionsRow}>
          <react_native_1.TouchableOpacity style={styles.primaryButton} onPress={function () { return setCreateVisible(true); }} activeOpacity={0.85}>
            <react_native_1.Text style={styles.primaryButtonText}>+ Create Group</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        <react_native_1.View style={styles.joinCard}>
          <react_native_1.Text style={styles.sectionTitle}>Join a group</react_native_1.Text>
          <react_native_1.Text style={styles.sectionSubtitle}>Enter an invite code or the group ID.</react_native_1.Text>
          <react_native_1.View style={styles.joinRow}>
            <react_native_1.TextInput value={joinCode} onChangeText={setJoinCode} placeholder="Invite code" placeholderTextColor={colors.textSecondary} style={styles.input} autoCapitalize="none"/>
            <react_native_1.TouchableOpacity style={styles.joinButton} onPress={handleJoinGroup} activeOpacity={0.85}>
              <react_native_1.Text style={styles.joinButtonText}>Join</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View style={styles.sectionHeader}>
          <react_native_1.Text style={styles.sectionTitle}>Your groups</react_native_1.Text>
        </react_native_1.View>

        {loading ? (<react_native_1.Text style={styles.loadingText}>Loading…</react_native_1.Text>) : groups.length === 0 ? (<react_native_1.View style={styles.emptyState}>
            <react_native_1.Text style={styles.emptyTitle}>No groups yet</react_native_1.Text>
            <react_native_1.Text style={styles.emptySubtitle}>Create one and invite friends to start learning together.</react_native_1.Text>
          </react_native_1.View>) : (groups.map(function (group) { return (<GroupCard_1.default key={group.id} group={group} onPress={function () { return handleOpenGroup(group.id); }}/>); }))}

        <react_native_1.View style={styles.bottomSpacer}/>
      </react_native_1.ScrollView>

      <react_native_1.Modal visible={createVisible} transparent animationType="fade" onRequestClose={function () { return setCreateVisible(false); }}>
        <react_native_1.View style={styles.modalOverlay}>
          <react_native_1.View style={styles.modalCard}>
            <react_native_1.Text style={styles.modalTitle}>Create a Study Group</react_native_1.Text>

            <react_native_1.Text style={styles.label}>Name</react_native_1.Text>
            <react_native_1.TextInput value={groupName} onChangeText={setGroupName} placeholder="e.g., Math Champs" placeholderTextColor={colors.textSecondary} style={styles.modalInput}/>

            <react_native_1.Text style={styles.label}>Description</react_native_1.Text>
            <react_native_1.TextInput value={groupDescription} onChangeText={setGroupDescription} placeholder="What will you study together?" placeholderTextColor={colors.textSecondary} style={[styles.modalInput, styles.multiline]} multiline/>

            <react_native_1.Text style={styles.label}>Icon (emoji or image URL)</react_native_1.Text>
            <react_native_1.TextInput value={groupIcon} onChangeText={setGroupIcon} placeholder="👥" placeholderTextColor={colors.textSecondary} style={styles.modalInput} autoCapitalize="none"/>

            <react_native_1.View style={styles.switchRow}>
              <react_native_1.View style={styles.switchMeta}>
                <react_native_1.Text style={styles.label}>Private group</react_native_1.Text>
                <react_native_1.Text style={styles.switchHint}>Requires an invite code to join.</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Switch value={isPrivate} onValueChange={setIsPrivate}/>
            </react_native_1.View>

            <react_native_1.View style={styles.modalButtons}>
              <react_native_1.TouchableOpacity style={styles.secondaryButton} onPress={function () { return setCreateVisible(false); }}>
                <react_native_1.Text style={styles.secondaryButtonText}>Cancel</react_native_1.Text>
              </react_native_1.TouchableOpacity>
              <react_native_1.TouchableOpacity style={styles.primaryButton} onPress={handleCreateGroup}>
                <react_native_1.Text style={styles.primaryButtonText}>Create</react_native_1.Text>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>
    </react_native_1.SafeAreaView>);
}
var getStyles = function (colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
        },
        content: {
            paddingTop: 90,
            paddingHorizontal: theme_1.Spacing.lg,
            paddingBottom: 120,
        },
        header: {
            marginBottom: theme_1.Spacing.lg,
        },
        title: {
            fontSize: theme_1.FontSizes.xxl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: 6,
        },
        subtitle: {
            fontSize: theme_1.FontSizes.md,
            color: colors.textSecondary,
            lineHeight: theme_1.FontSizes.md * 1.4,
        },
        actionsRow: {
            flexDirection: 'row',
            marginBottom: theme_1.Spacing.lg,
        },
        primaryButton: {
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: theme_1.BorderRadius.lg,
            paddingVertical: theme_1.Spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 52,
        },
        primaryButtonText: {
            color: '#FFFFFF',
            fontWeight: theme_1.FontWeights.bold,
            fontSize: theme_1.FontSizes.md,
        },
        joinCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: theme_1.Spacing.lg,
        },
        sectionHeader: {
            marginBottom: theme_1.Spacing.md,
        },
        sectionTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
        },
        sectionSubtitle: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            marginTop: 4,
        },
        joinRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: theme_1.Spacing.md,
        },
        input: {
            flex: 1,
            height: 48,
            borderRadius: theme_1.BorderRadius.md,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: theme_1.Spacing.md,
            color: colors.text,
            backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
        },
        joinButton: {
            marginLeft: theme_1.Spacing.md,
            backgroundColor: colors.primary,
            borderRadius: theme_1.BorderRadius.md,
            paddingHorizontal: theme_1.Spacing.lg,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
        },
        joinButtonText: {
            color: '#FFFFFF',
            fontWeight: theme_1.FontWeights.bold,
        },
        loadingText: {
            color: colors.textSecondary,
            paddingVertical: theme_1.Spacing.md,
        },
        emptyState: {
            backgroundColor: colors.cardBackground,
            borderRadius: theme_1.BorderRadius.lg,
            padding: theme_1.Spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
        },
        emptyTitle: {
            fontSize: theme_1.FontSizes.lg,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: 6,
        },
        emptySubtitle: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: theme_1.FontSizes.sm * 1.4,
        },
        bottomSpacer: {
            height: theme_1.Spacing.xl,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: theme_1.Spacing.lg,
        },
        modalCard: {
            backgroundColor: colors.background,
            borderRadius: theme_1.BorderRadius.xl,
            padding: theme_1.Spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
        },
        modalTitle: {
            fontSize: theme_1.FontSizes.xl,
            fontWeight: theme_1.FontWeights.bold,
            color: colors.text,
            marginBottom: theme_1.Spacing.md,
        },
        label: {
            fontSize: theme_1.FontSizes.sm,
            color: colors.textSecondary,
            fontWeight: theme_1.FontWeights.semibold,
            marginBottom: 6,
            marginTop: theme_1.Spacing.sm,
        },
        modalInput: {
            height: 48,
            borderRadius: theme_1.BorderRadius.md,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: theme_1.Spacing.md,
            color: colors.text,
            backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
        },
        multiline: {
            height: 90,
            paddingTop: theme_1.Spacing.md,
        },
        switchRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: theme_1.Spacing.md,
        },
        switchMeta: {
            flex: 1,
            paddingRight: theme_1.Spacing.md,
        },
        switchHint: {
            fontSize: theme_1.FontSizes.xs,
            color: colors.textSecondary,
            marginTop: 4,
        },
        modalButtons: {
            flexDirection: 'row',
            marginTop: theme_1.Spacing.lg,
        },
        secondaryButton: {
            flex: 1,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F1E8',
            borderRadius: theme_1.BorderRadius.lg,
            paddingVertical: theme_1.Spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 52,
            marginRight: theme_1.Spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
        },
        secondaryButtonText: {
            color: colors.text,
            fontWeight: theme_1.FontWeights.bold,
            fontSize: theme_1.FontSizes.md,
        },
    });
};
