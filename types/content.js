"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = exports.ContentType = void 0;
var ContentType;
(function (ContentType) {
    ContentType["Lesson"] = "lesson";
    ContentType["QuizQuestion"] = "quiz_question";
    ContentType["Book"] = "book";
    ContentType["Pathway"] = "pathway";
    ContentType["UserGeneratedText"] = "user_generated_text";
    ContentType["AIResponseText"] = "ai_response_text";
})(ContentType || (exports.ContentType = ContentType = {}));
var ContentRating;
(function (ContentRating) {
    ContentRating["G"] = "G";
    ContentRating["PG"] = "PG";
    ContentRating["PG13"] = "PG-13";
    ContentRating["R"] = "R";
    ContentRating["NC17"] = "NC-17";
})(ContentRating || (exports.ContentRating = ContentRating = {}));
