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
exports.networkService = exports.NetworkEvents = void 0;
exports.initializeNetworkListener = initializeNetworkListener;
exports.cleanupNetworkListener = cleanupNetworkListener;
exports.useNetworkStatus = useNetworkStatus;
exports.checkNetworkConnectivity = checkNetworkConnectivity;
exports.checkInternetReachability = checkInternetReachability;
exports.subscribeToNetworkEvents = subscribeToNetworkEvents;
exports.startPeriodicConnectivityCheck = startPeriodicConnectivityCheck;
exports.stopPeriodicConnectivityCheck = stopPeriodicConnectivityCheck;
var netinfo_1 = require("@react-native-community/netinfo");
var zustand_1 = require("zustand");
var NetworkStore = (0, zustand_1.create)(function (set, get) { return ({
    isConnected: true,
    isInternetReachable: true,
    connectionType: null,
    setNetworkStatus: function (status) {
        var _a, _b;
        set({
            isConnected: (_a = status.isConnected) !== null && _a !== void 0 ? _a : false,
            isInternetReachable: (_b = status.isInternetReachable) !== null && _b !== void 0 ? _b : false,
            connectionType: status.type,
        });
    },
    initializeNetworkListener: function () {
        // First, get initial state
        netinfo_1.default.fetch().then(function (status) {
            get().setNetworkStatus(status);
        });
        // Then, subscribe to changes
        var unsubscribe = netinfo_1.default.addEventListener(function (status) {
            get().setNetworkStatus(status);
        });
        return unsubscribe;
    },
    cleanupNetworkListener: function () {
        set({
            isConnected: true,
            isInternetReachable: true,
            connectionType: null,
        });
    },
}); });
var networkSubscription = null;
function initializeNetworkListener() {
    networkSubscription = NetworkStore.getState().initializeNetworkListener();
    return networkSubscription;
}
function cleanupNetworkListener() {
    if (networkSubscription) {
        networkSubscription();
        networkSubscription = null;
    }
    NetworkStore.getState().cleanupNetworkListener();
}
function useNetworkStatus() {
    return {
        isConnected: NetworkStore(function (state) { return state.isConnected; }),
        isInternetReachable: NetworkStore(function (state) { return state.isInternetReachable; }),
        connectionType: NetworkStore(function (state) { return state.connectionType; }),
    };
}
function checkNetworkConnectivity() {
    return __awaiter(this, void 0, void 0, function () {
        var state;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, netinfo_1.default.fetch()];
                case 1:
                    state = _b.sent();
                    return [2 /*return*/, (_a = state.isConnected) !== null && _a !== void 0 ? _a : false];
            }
        });
    });
}
function checkInternetReachability() {
    return __awaiter(this, void 0, void 0, function () {
        var state;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, netinfo_1.default.fetch()];
                case 1:
                    state = _b.sent();
                    return [2 /*return*/, (_a = state.isInternetReachable) !== null && _a !== void 0 ? _a : false];
            }
        });
    });
}
exports.NetworkEvents = {
    NETWORK_CHANGE: 'networkChange',
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
};
var networkCallbacks = new Set();
function subscribeToNetworkEvents(callback) {
    networkCallbacks.add(callback);
    return function () {
        networkCallbacks.delete(callback);
    };
}
function notifyNetworkChange(event, details) {
    networkCallbacks.forEach(function (callback) {
        try {
            callback(event, details);
        }
        catch (error) {
            // Error handled silently
        }
    });
}
// Initialize with periodic checking
var connectivityCheckInterval = null;
function startPeriodicConnectivityCheck(intervalMs) {
    var _this = this;
    if (intervalMs === void 0) { intervalMs = 30000; }
    if (connectivityCheckInterval) {
        clearInterval(connectivityCheckInterval);
    }
    connectivityCheckInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
        var isConnected, state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkNetworkConnectivity()];
                case 1:
                    isConnected = _a.sent();
                    return [4 /*yield*/, netinfo_1.default.fetch()];
                case 2:
                    state = _a.sent();
                    if (isConnected) {
                        notifyNetworkChange(exports.NetworkEvents.CONNECTED, state);
                    }
                    else {
                        notifyNetworkChange(exports.NetworkEvents.DISCONNECTED, state);
                    }
                    return [2 /*return*/];
            }
        });
    }); }, intervalMs);
}
function stopPeriodicConnectivityCheck() {
    if (connectivityCheckInterval) {
        clearInterval(connectivityCheckInterval);
        connectivityCheckInterval = null;
    }
}
exports.networkService = {
    initialize: initializeNetworkListener,
    cleanup: cleanupNetworkListener,
    checkConnectivity: checkNetworkConnectivity,
    checkInternetReachability: checkInternetReachability,
    subscribe: subscribeToNetworkEvents,
    startPeriodicCheck: startPeriodicConnectivityCheck,
    stopPeriodicCheck: stopPeriodicConnectivityCheck,
};
