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
exports.focusTracker = void 0;
var react_native_1 = require("react-native");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var TREES_STORAGE_KEY = '@learnsmart_virtual_forest';
var ACTIVE_TREE_KEY = '@learnsmart_active_tree';
var FocusTracker = /** @class */ (function () {
    function FocusTracker() {
        var _this = this;
        this.appState = 'active';
        this.activeTree = null;
        this.focusCheckInterval = null;
        this.growthInterval = null;
        this.appStateSubscription = null;
        this.handleAppStateChange = function (nextAppState) {
            var _a;
            var previousState = _this.appState;
            _this.appState = nextAppState;
            // If app goes to background or inactive, kill the tree
            if ((nextAppState === 'background' || nextAppState === 'inactive') &&
                previousState === 'active' &&
                ((_a = _this.activeTree) === null || _a === void 0 ? void 0 : _a.alive)) {
                _this.killTree();
            }
        };
    }
    // Tree management
    FocusTracker.prototype.startGrowingTree = function (sessionId_1) {
        return __awaiter(this, arguments, void 0, function (sessionId, treeType) {
            var treeId;
            if (treeType === void 0) { treeType = 'oak'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        treeId = "tree_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                        this.activeTree = {
                            treeId: treeId,
                            sessionId: sessionId,
                            growth: 0,
                            alive: true,
                            plantedAt: new Date().toISOString(),
                            lastFocusCheck: Date.now(),
                        };
                        return [4 /*yield*/, this.saveActiveTree(this.activeTree)];
                    case 1:
                        _a.sent();
                        this.startTracking();
                        return [2 /*return*/, treeId];
                }
            });
        });
    };
    FocusTracker.prototype.stopGrowingTree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tree;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.stopTracking();
                        if (!(this.activeTree && this.activeTree.alive)) return [3 /*break*/, 3];
                        _a = {
                            id: this.activeTree.treeId
                        };
                        return [4 /*yield*/, this.getRandomTreeType()];
                    case 1:
                        tree = (_a.type = _b.sent(),
                            _a.growth = this.activeTree.growth,
                            _a.alive = true,
                            _a.plantedAt = this.activeTree.plantedAt,
                            _a.sessionId = this.activeTree.sessionId,
                            _a);
                        return [4 /*yield*/, this.saveTree(tree)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        this.activeTree = null;
                        return [4 /*yield*/, async_storage_1.default.removeItem(ACTIVE_TREE_KEY)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FocusTracker.prototype.killTree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tree;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.activeTree)
                            return [2 /*return*/];
                        this.activeTree.alive = false;
                        return [4 /*yield*/, this.saveActiveTree(this.activeTree)];
                    case 1:
                        _b.sent();
                        _a = {
                            id: this.activeTree.treeId
                        };
                        return [4 /*yield*/, this.getRandomTreeType()];
                    case 2:
                        tree = (_a.type = _b.sent(),
                            _a.growth = this.activeTree.growth,
                            _a.alive = false,
                            _a.plantedAt = this.activeTree.plantedAt,
                            _a.sessionId = this.activeTree.sessionId,
                            _a);
                        return [4 /*yield*/, this.saveTree(tree)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FocusTracker.prototype.restartTree = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeTree) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.killTree()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: 
                    // Start a new tree
                    return [2 /*return*/, this.startGrowingTree(sessionId)];
                }
            });
        });
    };
    FocusTracker.prototype.saveTree = function (tree) {
        return __awaiter(this, void 0, void 0, function () {
            var trees, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getAllTrees()];
                    case 1:
                        trees = _a.sent();
                        trees.push(tree);
                        return [4 /*yield*/, async_storage_1.default.setItem(TREES_STORAGE_KEY, JSON.stringify(trees))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FocusTracker.prototype.getAllTrees = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(TREES_STORAGE_KEY)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data ? JSON.parse(data) : []];
                    case 2:
                        error_2 = _a.sent();
                        // Error handled silently
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FocusTracker.prototype.getAliveTrees = function () {
        return __awaiter(this, void 0, void 0, function () {
            var trees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllTrees()];
                    case 1:
                        trees = _a.sent();
                        return [2 /*return*/, trees.filter(function (tree) { return tree.alive; })];
                }
            });
        });
    };
    FocusTracker.prototype.getTreesBySession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var trees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllTrees()];
                    case 1:
                        trees = _a.sent();
                        return [2 /*return*/, trees.filter(function (tree) { return tree.sessionId === sessionId; })];
                }
            });
        });
    };
    // Focus tracking
    FocusTracker.prototype.startTracking = function () {
        var _this = this;
        // Track app state changes
        var subscription = react_native_1.AppState.addEventListener('change', this.handleAppStateChange);
        // Check focus periodically
        this.focusCheckInterval = setInterval(function () {
            _this.checkFocus();
        }, 1000); // Check every second
        // Update tree growth periodically
        this.growthInterval = setInterval(function () {
            _this.updateGrowth();
        }, 500); // Update growth every 500ms
    };
    FocusTracker.prototype.stopTracking = function () {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
        if (this.focusCheckInterval) {
            clearInterval(this.focusCheckInterval);
            this.focusCheckInterval = null;
        }
        if (this.growthInterval) {
            clearInterval(this.growthInterval);
            this.growthInterval = null;
        }
    };
    FocusTracker.prototype.checkFocus = function () {
        if (!this.activeTree)
            return;
        // Additional focus check logic could go here
        // For example, checking if the user is actually interacting with the app
        this.activeTree.lastFocusCheck = Date.now();
        this.saveActiveTree(this.activeTree);
    };
    FocusTracker.prototype.updateGrowth = function () {
        if (!this.activeTree || !this.activeTree.alive)
            return;
        // Only grow if app is active
        if (this.appState === 'active') {
            // Growth rate: 100% over 25 minutes (1500 seconds)
            // That's 0.067% per second per 500ms interval = 0.033%
            this.activeTree.growth = Math.min(100, this.activeTree.growth + 0.05);
            this.saveActiveTree(this.activeTree);
        }
    };
    // Active tree management
    FocusTracker.prototype.saveActiveTree = function (tree) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.setItem(ACTIVE_TREE_KEY, JSON.stringify(tree))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FocusTracker.prototype.loadActiveTree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, async_storage_1.default.getItem(ACTIVE_TREE_KEY)];
                    case 1:
                        data = _a.sent();
                        if (!data) return [3 /*break*/, 4];
                        this.activeTree = JSON.parse(data);
                        if (!(this.activeTree.alive && this.appState === 'active')) return [3 /*break*/, 2];
                        this.startTracking();
                        return [2 /*return*/, this.activeTree];
                    case 2:
                        if (!this.activeTree.alive) return [3 /*break*/, 4];
                        // App was not active when tree was loaded
                        return [4 /*yield*/, this.killTree()];
                    case 3:
                        // App was not active when tree was loaded
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    // Stats
    FocusTracker.prototype.getForestStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var trees, now, weekAgo_1, monthAgo_1, treesThisWeek, treesThisMonth, forestScore, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getAllTrees()];
                    case 1:
                        trees = _a.sent();
                        now = new Date();
                        weekAgo_1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        monthAgo_1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        treesThisWeek = trees.filter(function (tree) {
                            var plantedDate = new Date(tree.plantedAt);
                            return tree.alive && plantedDate >= weekAgo_1;
                        }).length;
                        treesThisMonth = trees.filter(function (tree) {
                            var plantedDate = new Date(tree.plantedAt);
                            return tree.alive && plantedDate >= monthAgo_1;
                        }).length;
                        forestScore = treesThisWeek * 10;
                        return [2 /*return*/, {
                                totalTrees: trees.filter(function (t) { return t.alive; }).length,
                                treesThisWeek: treesThisWeek,
                                treesThisMonth: treesThisMonth,
                                forestScore: forestScore,
                            }];
                    case 2:
                        error_5 = _a.sent();
                        // Error handled silently
                        return [2 /*return*/, {
                                totalTrees: 0,
                                treesThisWeek: 0,
                                treesThisMonth: 0,
                                forestScore: 0,
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FocusTracker.prototype.getRecentTrees = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var trees, error_6;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getAllTrees()];
                    case 1:
                        trees = _a.sent();
                        return [2 /*return*/, trees
                                .filter(function (tree) { return tree.alive; })
                                .sort(function (a, b) { return new Date(b.plantedAt).getTime() - new Date(a.plantedAt).getTime(); })
                                .slice(0, limit)];
                    case 2:
                        error_6 = _a.sent();
                        // Error handled silently
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Tree type utilities
    FocusTracker.prototype.getRandomTreeType = function () {
        return __awaiter(this, void 0, void 0, function () {
            var types, randomIndex;
            return __generator(this, function (_a) {
                types = ['oak', 'pine', 'cherry', 'willow', 'maple'];
                randomIndex = Math.floor(Math.random() * types.length);
                return [2 /*return*/, types[randomIndex]];
            });
        });
    };
    FocusTracker.prototype.getTreeEmoji = function (treeType) {
        var emojis = {
            oak: '🌳',
            pine: '🌲',
            cherry: '🌸',
            willow: '🏞️',
            maple: '🍁',
        };
        return emojis[treeType] || '🌳';
    };
    FocusTracker.prototype.getTreeName = function (treeType) {
        var names = {
            oak: 'Oak Tree',
            pine: 'Pine Tree',
            cherry: 'Cherry Blossom',
            willow: 'Willow Tree',
            maple: 'Maple Tree',
        };
        return names[treeType] || 'Tree';
    };
    // Cleanup
    FocusTracker.prototype.destroy = function () {
        this.stopTracking();
        this.activeTree = null;
    };
    FocusTracker.prototype.getCurrentGrowth = function () {
        var _a, _b;
        return (_b = (_a = this.activeTree) === null || _a === void 0 ? void 0 : _a.growth) !== null && _b !== void 0 ? _b : 0;
    };
    FocusTracker.prototype.isTreeAlive = function () {
        var _a, _b;
        return (_b = (_a = this.activeTree) === null || _a === void 0 ? void 0 : _a.alive) !== null && _b !== void 0 ? _b : false;
    };
    return FocusTracker;
}());
exports.focusTracker = new FocusTracker();
