"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = exports.HttpException = void 0;
//= Error Generator
const http_errors_1 = __importDefault(require("http-errors"));
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.HttpException = HttpException;
const HttpError = (status, message) => (0, http_errors_1.default)(status, message);
exports.HttpError = HttpError;
function errorHandlerMiddleware(error, req, res) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    console.error('\n\x1b[31m%s\x1b[0m\n', message);
    console.error(error.stack);
    res.status(status).json({ success: false, data: null, message });
}
exports.default = errorHandlerMiddleware;
//# sourceMappingURL=error.handler.middleware.js.map