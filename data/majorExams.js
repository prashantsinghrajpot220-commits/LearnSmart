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
exports.getUpcomingExams = exports.sortExamsByDate = exports.getUrgencyColor = exports.getDaysRemaining = exports.majorExams = void 0;
// Current year - dynamically adjust based on current date
var getCurrentYear = function () { return new Date().getFullYear(); };
var getNextYear = function () { return new Date().getFullYear() + 1; };
exports.majorExams = [
    {
        id: 'cbse-10',
        name: 'CBSE Class 10 Board',
        subject: 'All Subjects',
        date: "".concat(getNextYear(), "-03-15"),
        dateDisplay: 'March 15, 2025',
        color: 'yellow',
        completed: false,
        isPrePopulated: true,
    },
    {
        id: 'cbse-12',
        name: 'CBSE Class 12 Board',
        subject: 'All Subjects',
        date: "".concat(getNextYear(), "-02-15"),
        dateDisplay: 'February 15, 2025',
        color: 'yellow',
        completed: false,
        isPrePopulated: true,
    },
    {
        id: 'jee-main-1',
        name: 'JEE Main Session 1',
        subject: 'Physics, Chemistry, Maths',
        date: "".concat(getNextYear(), "-01-24"),
        dateDisplay: 'January 24, 2025',
        color: 'green',
        completed: false,
        isPrePopulated: true,
    },
    {
        id: 'jee-main-2',
        name: 'JEE Main Session 2',
        subject: 'Physics, Chemistry, Maths',
        date: "".concat(getNextYear(), "-04-04"),
        dateDisplay: 'April 4, 2025',
        color: 'yellow',
        completed: false,
        isPrePopulated: true,
    },
    {
        id: 'jee-main-3',
        name: 'JEE Main Session 3',
        subject: 'Physics, Chemistry, Maths',
        date: "".concat(getNextYear(), "-06-05"),
        dateDisplay: 'June 5, 2025',
        color: 'green',
        completed: false,
        isPrePopulated: true,
    },
    {
        id: 'neet',
        name: 'NEET UG',
        subject: 'Physics, Chemistry, Biology',
        date: "".concat(getNextYear(), "-05-05"),
        dateDisplay: 'May 5, 2025',
        color: 'yellow',
        completed: false,
        isPrePopulated: true,
    },
    {
        id: 'bitsat',
        name: 'BITSAT',
        subject: 'Physics, Chemistry, Maths',
        date: "".concat(getNextYear(), "-05-20"),
        dateDisplay: 'May 20, 2025',
        color: 'green',
        completed: false,
        isPrePopulated: true,
    },
    {
        id: 'viteee',
        name: 'VITEEE',
        subject: 'Physics, Chemistry, Maths',
        date: "".concat(getNextYear(), "-04-20"),
        dateDisplay: 'April 20, 2025',
        color: 'green',
        completed: false,
        isPrePopulated: true,
    },
    {
        id: 'sat',
        name: 'SAT',
        subject: 'Reading, Writing, Maths',
        date: "".concat(getNextYear(), "-03-08"),
        dateDisplay: 'March 8, 2025',
        color: 'green',
        completed: false,
        isPrePopulated: true,
    },
];
// Helper function to get days remaining for an exam
var getDaysRemaining = function (examDate) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    var diffTime = exam.getTime() - today.getTime();
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
exports.getDaysRemaining = getDaysRemaining;
// Helper function to determine urgency color
var getUrgencyColor = function (daysRemaining) {
    if (daysRemaining <= 7)
        return 'red';
    if (daysRemaining <= 30)
        return 'yellow';
    return 'green';
};
exports.getUrgencyColor = getUrgencyColor;
// Helper function to sort exams by date
var sortExamsByDate = function (exams) {
    return __spreadArray([], exams, true).filter(function (exam) { return !exam.completed; })
        .sort(function (a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime(); });
};
exports.sortExamsByDate = sortExamsByDate;
// Get upcoming exams (not completed, in the future)
var getUpcomingExams = function (exams, limit) {
    if (limit === void 0) { limit = 3; }
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return (0, exports.sortExamsByDate)(exams)
        .filter(function (exam) { return new Date(exam.date) >= today; })
        .slice(0, limit);
};
exports.getUpcomingExams = getUpcomingExams;
