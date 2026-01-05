"use strict";
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
exports.default = PerformanceChart;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("./ThemeContext");
var theme_1 = require("@/constants/theme");
var AnalyticsService_1 = require("@/services/AnalyticsService");
var screenWidth = react_native_1.Dimensions.get('window').width;
var chartWidth = screenWidth - theme_1.Spacing.lg * 2 - theme_1.Spacing.lg * 2;
var barWidth = (chartWidth / 8) - 8;
function PerformanceChart() {
    var _a = (0, ThemeContext_1.useTheme)(), colors = _a.colors, isDark = _a.isDark;
    var styles = getStyles(colors, isDark);
    var chartData = AnalyticsService_1.analyticsService.getPerformanceChartData();
    // If no data, show placeholder
    if (chartData.accuracyData.length === 0) {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.View style={styles.emptyChart}>
          <react_native_1.Text style={styles.emptyText}>No performance data yet</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>);
    }
    var maxAccuracy = Math.max.apply(Math, __spreadArray(__spreadArray([], chartData.accuracyData, false), [100], false));
    return (<react_native_1.View style={styles.container}>
      {/* Y-axis labels */}
      <react_native_1.View style={styles.yAxis}>
        <react_native_1.Text style={styles.yAxisLabel}>100%</react_native_1.Text>
        <react_native_1.Text style={styles.yAxisLabel}>75%</react_native_1.Text>
        <react_native_1.Text style={styles.yAxisLabel}>50%</react_native_1.Text>
        <react_native_1.Text style={styles.yAxisLabel}>25%</react_native_1.Text>
        <react_native_1.Text style={styles.yAxisLabel}>0%</react_native_1.Text>
      </react_native_1.View>

      {/* Chart area */}
      <react_native_1.View style={styles.chartArea}>
        {/* Grid lines */}
        {['100', '75', '50', '25', '0'].map(function (percent) { return (<react_native_1.View key={percent} style={[
                styles.gridLine,
                { bottom: "".concat(parseInt(percent), "%") },
            ]}/>); })}

        {/* Bars */}
        <react_native_1.View style={styles.barsContainer}>
          {chartData.accuracyData.map(function (accuracy, index) {
            var height = (accuracy / maxAccuracy) * 100;
            var barColor = accuracy >= 70
                ? colors.success
                : accuracy >= 50
                    ? colors.warning
                    : colors.error;
            return (<react_native_1.View key={index} style={styles.barContainer}>
                <react_native_1.View style={styles.barWrapper}>
                  <react_native_1.View style={[
                    styles.bar,
                    {
                        height: "".concat(height, "%"),
                        backgroundColor: barColor,
                    },
                ]}/>
                  <react_native_1.Text style={styles.barLabel}>{accuracy}%</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Text style={styles.xAxisLabel}>{chartData.labels[index]}</react_native_1.Text>
              </react_native_1.View>);
        })}
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
}
var getStyles = function (colors, isDark) { return react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.cardBackground,
        borderRadius: theme_1.BorderRadius.lg,
        padding: theme_1.Spacing.md,
        height: 200,
    },
    yAxis: {
        width: 40,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: theme_1.Spacing.xs,
    },
    yAxisLabel: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.textSecondary,
        textAlign: 'right',
        transform: [{ translateY: -6 }],
    },
    chartArea: {
        flex: 1,
        position: 'relative',
        paddingLeft: theme_1.Spacing.sm,
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: colors.lightGray,
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '100%',
        alignItems: 'flex-end',
    },
    barContainer: {
        alignItems: 'center',
        width: barWidth,
    },
    barWrapper: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    barLabel: {
        fontSize: theme_1.FontSizes.xs,
        fontWeight: theme_1.FontWeights.medium,
        color: colors.text,
        marginTop: theme_1.Spacing.xs,
    },
    xAxisLabel: {
        fontSize: theme_1.FontSizes.xs,
        color: colors.textSecondary,
        marginTop: theme_1.Spacing.xs,
    },
    emptyChart: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: theme_1.FontSizes.sm,
        color: colors.textSecondary,
    },
}); };
