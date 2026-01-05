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
exports.QAPhotoUpload = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var FileUploadService_1 = require("@/services/FileUploadService");
var colors_1 = require("@/constants/colors");
var QAPhotoUpload = function (_a) {
    var onAttachment = _a.onAttachment, attachment = _a.attachment, onRemove = _a.onRemove;
    var handlePickImage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, FileUploadService_1.pickImage)(false)];
                case 1:
                    result = _a.sent();
                    if (result)
                        onAttachment(result);
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    react_native_1.Alert.alert('Error', e_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePickDocument = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, FileUploadService_1.pickDocument)()];
                case 1:
                    result = _a.sent();
                    if (result)
                        onAttachment(result);
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    react_native_1.Alert.alert('Error', e_2.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<react_native_1.View style={styles.container}>
      {attachment ? (<react_native_1.View style={styles.attachmentPreview}>
          {attachment.type === 'image' ? (<react_native_1.Image source={{ uri: attachment.uri }} style={styles.previewImage}/>) : (<react_native_1.View style={styles.fileIcon}>
              <vector_icons_1.Ionicons name="document-text" size={40} color={colors_1.Colors.light.primary}/>
              <react_native_1.Text style={styles.fileName} numberOfLines={1}>{attachment.name}</react_native_1.Text>
            </react_native_1.View>)}
          <react_native_1.TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
            <vector_icons_1.Ionicons name="close-circle" size={24} color={colors_1.Colors.light.error}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>) : (<react_native_1.View style={styles.buttonsRow}>
          <react_native_1.TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
            <vector_icons_1.Ionicons name="image-outline" size={24} color={colors_1.Colors.light.primary}/>
            <react_native_1.Text style={styles.uploadText}>Add Image</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.uploadBtn} onPress={handlePickDocument}>
            <vector_icons_1.Ionicons name="document-outline" size={24} color={colors_1.Colors.light.primary}/>
            <react_native_1.Text style={styles.uploadText}>Add File</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>)}
    </react_native_1.View>);
};
exports.QAPhotoUpload = QAPhotoUpload;
var styles = react_native_1.StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    uploadBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: colors_1.Colors.light.primary,
        borderStyle: 'dashed',
        borderRadius: 8,
        gap: 8,
    },
    uploadText: {
        color: colors_1.Colors.light.primary,
        fontWeight: '600',
    },
    attachmentPreview: {
        position: 'relative',
        height: 150,
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    fileIcon: {
        alignItems: 'center',
    },
    fileName: {
        marginTop: 4,
        paddingHorizontal: 20,
        fontSize: 12,
    },
    removeBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'white',
        borderRadius: 12,
    },
});
