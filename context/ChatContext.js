"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSmartyContext = exports.SmartyChatProvider = void 0;
var react_1 = require("react");
var ChatContext = (0, react_1.createContext)(undefined);
var SmartyChatProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(), currentSubject = _b[0], setCurrentSubject = _b[1];
    var _c = (0, react_1.useState)(), currentChapter = _c[0], setCurrentChapter = _c[1];
    var _d = (0, react_1.useState)(), currentLesson = _d[0], setCurrentLesson = _d[1];
    var setCurrentContext = (0, react_1.useCallback)(function (subject, chapter, lesson) {
        setCurrentSubject(subject);
        setCurrentChapter(chapter);
        setCurrentLesson(lesson);
    }, []);
    var getContextInfo = (0, react_1.useCallback)(function () {
        return { subject: currentSubject, chapter: currentChapter, lesson: currentLesson };
    }, [currentSubject, currentChapter, currentLesson]);
    return (<ChatContext.Provider value={{
            currentSubject: currentSubject,
            currentChapter: currentChapter,
            currentLesson: currentLesson,
            setCurrentContext: setCurrentContext,
            getContextInfo: getContextInfo,
        }}>
      {children}
    </ChatContext.Provider>);
};
exports.SmartyChatProvider = SmartyChatProvider;
var useSmartyContext = function () {
    var context = (0, react_1.useContext)(ChatContext);
    if (context === undefined) {
        throw new Error('useSmartyContext must be used within a SmartyChatProvider');
    }
    return context;
};
exports.useSmartyContext = useSmartyContext;
