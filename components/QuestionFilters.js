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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionFilters = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var colors_1 = require("@/constants/colors");
var DIFFICULTY_OPTIONS = [
    { value: 'easy', label: 'Easy', color: colors_1.Colors.light.success },
    { value: 'medium', label: 'Medium', color: colors_1.Colors.light.warning },
    { value: 'hard', label: 'Hard', color: colors_1.Colors.light.error },
];
var STATUS_OPTIONS = [
    { value: 'unanswered', label: 'Unanswered', icon: 'chatbubble-outline' },
    { value: 'answered', label: 'Answered', icon: 'checkmark-circle-outline' },
    { value: 'solved', label: 'Solved', icon: 'checkmark-done-outline' },
];
var QuestionFilters = function (_a) {
    var _b = _a.difficulties, initialDifficulties = _b === void 0 ? [] : _b, _c = _a.status, initialStatus = _c === void 0 ? [] : _c, _d = _a.subject, initialSubject = _d === void 0 ? '' : _d, _e = _a.topic, initialTopic = _e === void 0 ? '' : _e, _f = _a.subjects, subjects = _f === void 0 ? [] : _f, _g = _a.topics, topics = _g === void 0 ? [] : _g, onFiltersChange = _a.onFiltersChange, onClear = _a.onClear;
    var _h = (0, react_1.useState)({
        difficulties: initialDifficulties,
        status: initialStatus,
        subject: initialSubject,
        topic: initialTopic,
    }), filters = _h[0], setFilters = _h[1];
    var _j = (0, react_1.useState)({
        difficulty: true,
        status: true,
        subject: false,
        topic: false,
    }), expandedSections = _j[0], setExpandedSections = _j[1];
    var hasActiveFilters = filters.difficulties.length > 0 ||
        filters.status.length > 0 ||
        filters.subject.length > 0 ||
        filters.topic.length > 0;
    var toggleDifficulty = function (difficulty) {
        var newDifficulties = filters.difficulties.includes(difficulty)
            ? filters.difficulties.filter(function (d) { return d !== difficulty; })
            : __spreadArray(__spreadArray([], filters.difficulties, true), [difficulty], false);
        var newFilters = __assign(__assign({}, filters), { difficulties: newDifficulties });
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };
    var toggleStatus = function (status) {
        var newStatus = filters.status.includes(status)
            ? filters.status.filter(function (s) { return s !== status; })
            : __spreadArray(__spreadArray([], filters.status, true), [status], false);
        var newFilters = __assign(__assign({}, filters), { status: newStatus });
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };
    var toggleSection = function (section) {
        setExpandedSections(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[section] = !prev[section], _a)));
        });
    };
    var handleSubjectChange = function (subject) {
        var newFilters = __assign(__assign({}, filters), { subject: subject, topic: '' });
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };
    var handleTopicChange = function (topic) {
        var newFilters = __assign(__assign({}, filters), { topic: topic });
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };
    var handleClear = function () {
        var clearedFilters = {
            difficulties: [],
            status: [],
            subject: '',
            topic: '',
        };
        setFilters(clearedFilters);
        onClear();
    };
    return (<react_native_1.View style={styles.container}>
      {/* Filter Header */}
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.title}>Filters</react_native_1.Text>
        {hasActiveFilters && (<react_native_1.TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <react_native_1.Text style={styles.clearText}>Clear All</react_native_1.Text>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>

      {/* Active Filter Tags */}
      {hasActiveFilters && (<react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeTagsContainer}>
          {filters.difficulties.map(function (d) { return (<react_native_1.TouchableOpacity key={d} style={[styles.filterTag, { borderColor: getDifficultyColor(d) }]} onPress={function () { return toggleDifficulty(d); }}>
              <react_native_1.Text style={[styles.filterTagText, { color: getDifficultyColor(d) }]}>
                {d}
              </react_native_1.Text>
              <vector_icons_1.Ionicons name="close" size={12} color={getDifficultyColor(d)}/>
            </react_native_1.TouchableOpacity>); })}
          {filters.status.map(function (s) { return (<react_native_1.TouchableOpacity key={s} style={[styles.filterTag, { borderColor: colors_1.Colors.light.primary }]} onPress={function () { return toggleStatus(s); }}>
              <react_native_1.Text style={[styles.filterTagText, { color: colors_1.Colors.light.primary }]}>
                {s}
              </react_native_1.Text>
              <vector_icons_1.Ionicons name="close" size={12} color={colors_1.Colors.light.primary}/>
            </react_native_1.TouchableOpacity>); })}
          {filters.subject && (<react_native_1.TouchableOpacity style={[styles.filterTag, { borderColor: colors_1.Colors.light.primary }]} onPress={function () { return handleSubjectChange(''); }}>
              <react_native_1.Text style={[styles.filterTagText, { color: colors_1.Colors.light.primary }]}>
                {filters.subject}
              </react_native_1.Text>
              <vector_icons_1.Ionicons name="close" size={12} color={colors_1.Colors.light.primary}/>
            </react_native_1.TouchableOpacity>)}
          {filters.topic && (<react_native_1.TouchableOpacity style={[styles.filterTag, { borderColor: colors_1.Colors.light.primary }]} onPress={function () { return handleTopicChange(''); }}>
              <react_native_1.Text style={[styles.filterTagText, { color: colors_1.Colors.light.primary }]}>
                {filters.topic}
              </react_native_1.Text>
              <vector_icons_1.Ionicons name="close" size={12} color={colors_1.Colors.light.primary}/>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.ScrollView>)}

      {/* Difficulty Section */}
      <FilterSection title="Difficulty" isExpanded={expandedSections.difficulty} onToggle={function () { return toggleSection('difficulty'); }}>
        <react_native_1.View style={styles.chipContainer}>
          {DIFFICULTY_OPTIONS.map(function (option) { return (<react_native_1.TouchableOpacity key={option.value} style={[
                styles.chip,
                filters.difficulties.includes(option.value) && {
                    backgroundColor: option.color + '20',
                    borderColor: option.color,
                },
            ]} onPress={function () { return toggleDifficulty(option.value); }}>
              <react_native_1.Text style={[
                styles.chipText,
                filters.difficulties.includes(option.value) && { color: option.color },
            ]}>
                {option.label}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>); })}
        </react_native_1.View>
      </FilterSection>

      {/* Status Section */}
      <FilterSection title="Status" isExpanded={expandedSections.status} onToggle={function () { return toggleSection('status'); }}>
        <react_native_1.View style={styles.chipContainer}>
          {STATUS_OPTIONS.map(function (option) { return (<react_native_1.TouchableOpacity key={option.value} style={[
                styles.chip,
                filters.status.includes(option.value) && {
                    backgroundColor: colors_1.Colors.light.primary + '20',
                    borderColor: colors_1.Colors.light.primary,
                },
            ]} onPress={function () { return toggleStatus(option.value); }}>
              <vector_icons_1.Ionicons name={option.icon} size={16} color={filters.status.includes(option.value) ? colors_1.Colors.light.primary : colors_1.Colors.light.textSecondary}/>
              <react_native_1.Text style={[
                styles.chipText,
                filters.status.includes(option.value) && { color: colors_1.Colors.light.primary },
            ]}>
                {option.label}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>); })}
        </react_native_1.View>
      </FilterSection>

      {/* Subject Section */}
      <FilterSection title="Subject" isExpanded={expandedSections.subject} onToggle={function () { return toggleSection('subject'); }}>
        {subjects.length > 0 ? (<react_native_1.View style={styles.chipContainer}>
            {subjects.map(function (subject) { return (<react_native_1.TouchableOpacity key={subject} style={[
                    styles.chip,
                    filters.subject === subject && {
                        backgroundColor: colors_1.Colors.light.primary + '20',
                        borderColor: colors_1.Colors.light.primary,
                    },
                ]} onPress={function () { return handleSubjectChange(filters.subject === subject ? '' : subject); }}>
                <react_native_1.Text style={[
                    styles.chipText,
                    filters.subject === subject && { color: colors_1.Colors.light.primary },
                ]}>
                  {subject}
                </react_native_1.Text>
              </react_native_1.TouchableOpacity>); })}
          </react_native_1.View>) : (<react_native_1.Text style={styles.noOptions}>No subjects available</react_native_1.Text>)}
      </FilterSection>

      {/* Topic Section (only shown when subject is selected) */}
      {filters.subject && (<FilterSection title="Topic" isExpanded={expandedSections.topic} onToggle={function () { return toggleSection('topic'); }}>
          {topics.length > 0 ? (<react_native_1.View style={styles.chipContainer}>
              {topics.map(function (topic) { return (<react_native_1.TouchableOpacity key={topic} style={[
                        styles.chip,
                        filters.topic === topic && {
                            backgroundColor: colors_1.Colors.light.primary + '20',
                            borderColor: colors_1.Colors.light.primary,
                        },
                    ]} onPress={function () { return handleTopicChange(filters.topic === topic ? '' : topic); }}>
                  <react_native_1.Text style={[
                        styles.chipText,
                        filters.topic === topic && { color: colors_1.Colors.light.primary },
                    ]}>
                    {topic}
                  </react_native_1.Text>
                </react_native_1.TouchableOpacity>); })}
            </react_native_1.View>) : (<react_native_1.Text style={styles.noOptions}>No topics available for this subject</react_native_1.Text>)}
        </FilterSection>)}
    </react_native_1.View>);
};
exports.QuestionFilters = QuestionFilters;
var FilterSection = function (_a) {
    var title = _a.title, isExpanded = _a.isExpanded, onToggle = _a.onToggle, children = _a.children;
    return (<react_native_1.View style={styles.section}>
    <react_native_1.TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
      <react_native_1.Text style={styles.sectionTitle}>{title}</react_native_1.Text>
      <vector_icons_1.Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors_1.Colors.light.textSecondary}/>
    </react_native_1.TouchableOpacity>
    {isExpanded && <react_native_1.View style={styles.sectionContent}>{children}</react_native_1.View>}
  </react_native_1.View>);
};
var getDifficultyColor = function (difficulty) {
    switch (difficulty) {
        case 'easy': return colors_1.Colors.light.success;
        case 'medium': return colors_1.Colors.light.warning;
        case 'hard': return colors_1.Colors.light.error;
        default: return colors_1.Colors.light.textSecondary;
    }
};
var styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: colors_1.Colors.light.cardBackground,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors_1.Colors.light.border,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors_1.Colors.light.border,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors_1.Colors.light.text,
    },
    clearButton: {
        padding: 4,
    },
    clearText: {
        fontSize: 14,
        color: colors_1.Colors.light.error,
        fontWeight: '500',
    },
    activeTagsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors_1.Colors.light.border,
    },
    filterTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors_1.Colors.light.background,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
        gap: 4,
    },
    filterTagText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    section: {
        borderBottomWidth: 1,
        borderBottomColor: colors_1.Colors.light.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors_1.Colors.light.textSecondary,
    },
    sectionContent: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors_1.Colors.light.background,
        borderWidth: 1,
        borderColor: colors_1.Colors.light.border,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 6,
    },
    chipText: {
        fontSize: 14,
        color: colors_1.Colors.light.textSecondary,
        fontWeight: '500',
    },
    noOptions: {
        fontSize: 14,
        color: colors_1.Colors.light.textSecondary,
        fontStyle: 'italic',
    },
});
exports.default = exports.QuestionFilters;
