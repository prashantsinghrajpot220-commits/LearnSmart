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
exports.extractTextFromFile = exports.pickDocument = exports.pickImage = void 0;
var ImagePicker = require("expo-image-picker");
var DocumentPicker = require("expo-document-picker");
var uploadLimits_1 = require("@/utils/uploadLimits");
var pickImage = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (useCamera) {
        var hasLimit, result, status_1, status_2, asset;
        if (useCamera === void 0) { useCamera = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, uploadLimits_1.canUploadImage)()];
                case 1:
                    hasLimit = _a.sent();
                    if (!hasLimit) {
                        throw new Error('Daily image limit reached. Try again tomorrow at 2 AM.');
                    }
                    if (!useCamera) return [3 /*break*/, 4];
                    return [4 /*yield*/, ImagePicker.requestCameraPermissionsAsync()];
                case 2:
                    status_1 = (_a.sent()).status;
                    if (status_1 !== 'granted') {
                        throw new Error('Camera permission is required to take photos.');
                    }
                    return [4 /*yield*/, ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 0.8,
                        })];
                case 3:
                    result = _a.sent();
                    return [3 /*break*/, 7];
                case 4: return [4 /*yield*/, ImagePicker.requestMediaLibraryPermissionsAsync()];
                case 5:
                    status_2 = (_a.sent()).status;
                    if (status_2 !== 'granted') {
                        throw new Error('Media library permission is required to pick images.');
                    }
                    return [4 /*yield*/, ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 0.8,
                        })];
                case 6:
                    result = _a.sent();
                    _a.label = 7;
                case 7:
                    if (!(!result.canceled && result.assets && result.assets.length > 0)) return [3 /*break*/, 9];
                    asset = result.assets[0];
                    // Validate size (max 5MB)
                    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
                        throw new Error('Image size should be less than 5MB.');
                    }
                    return [4 /*yield*/, (0, uploadLimits_1.incrementImageUploadCount)()];
                case 8:
                    _a.sent();
                    return [2 /*return*/, {
                            uri: asset.uri,
                            name: asset.fileName || "image_".concat(Date.now(), ".jpg"),
                            type: 'image',
                            mimeType: asset.mimeType || 'image/jpeg',
                            size: asset.fileSize,
                        }];
                case 9: return [2 /*return*/, null];
            }
        });
    });
};
exports.pickImage = pickImage;
var pickDocument = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, asset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, DocumentPicker.getDocumentAsync({
                    type: [
                        'application/pdf',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'text/plain',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    ],
                    copyToCacheDirectory: true,
                })];
            case 1:
                result = _a.sent();
                if (!result.canceled && result.assets && result.assets.length > 0) {
                    asset = result.assets[0];
                    // Validate size (max 10MB)
                    if (asset.size && asset.size > 10 * 1024 * 1024) {
                        throw new Error('File size should be less than 10MB.');
                    }
                    return [2 /*return*/, {
                            uri: asset.uri,
                            name: asset.name,
                            type: 'file',
                            mimeType: asset.mimeType,
                            size: asset.size,
                        }];
                }
                return [2 /*return*/, null];
        }
    });
}); };
exports.pickDocument = pickDocument;
// In a real app, this would be handled on the server or with heavy libraries
// For this environment, we will mock the extraction or use basic fetch for text files
var extractTextFromFile = function (attachment) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (attachment.type !== 'file')
                    return [2 /*return*/, ''];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!(attachment.mimeType === 'text/plain')) return [3 /*break*/, 4];
                return [4 /*yield*/, fetch(attachment.uri)];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.text()];
            case 3: return [2 /*return*/, _a.sent()];
            case 4: 
            // For PDF, DOCX, PPTX, we would normally use pdf-parse, mammoth, etc.
            // Since we are in a React Native environment, many of these Node libraries might not work directly.
            // In a production app, we would send these to a backend.
            // For this task, I will provide a placeholder that indicates we are analyzing.
            return [2 /*return*/, "[Extracted text from ".concat(attachment.name, "]")];
            case 5:
                error_1 = _a.sent();
                // Error extracting text - return empty string
                return [2 /*return*/, ''];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.extractTextFromFile = extractTextFromFile;
