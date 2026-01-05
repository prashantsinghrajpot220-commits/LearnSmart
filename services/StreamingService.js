"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingService = void 0;
var StreamingService = /** @class */ (function () {
    function StreamingService() {
    }
    StreamingService.createController = function (chatId) {
        this.stop(chatId); // Stop any existing stream for this chat
        var controller = new AbortController();
        this.abortControllers.set(chatId, controller);
        return controller;
    };
    StreamingService.stop = function (chatId) {
        var controller = this.abortControllers.get(chatId);
        if (controller) {
            controller.abort();
            this.abortControllers.delete(chatId);
        }
    };
    StreamingService.getSignal = function (chatId) {
        var _a;
        return (_a = this.abortControllers.get(chatId)) === null || _a === void 0 ? void 0 : _a.signal;
    };
    StreamingService.isStopped = function (chatId) {
        return !this.abortControllers.has(chatId);
    };
    StreamingService.abortControllers = new Map();
    return StreamingService;
}());
exports.StreamingService = StreamingService;
