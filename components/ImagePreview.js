"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImagePreview;
var react_1 = require("react");
var react_native_1 = require("react-native");
var theme_1 = require("@/constants/theme");
function ImagePreview(_a) {
    var uri = _a.uri, onRemove = _a.onRemove;
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Image source={{ uri: uri }} style={styles.image}/>
      <react_native_1.TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <react_native_1.Text style={styles.removeButtonText}>✕</react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        marginRight: theme_1.Spacing.sm,
        borderRadius: theme_1.BorderRadius.md,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
