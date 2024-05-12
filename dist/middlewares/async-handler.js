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
Object.defineProperty(exports, "__esModule", { value: true });
function asyncHandler(controller, requestHandler) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield requestHandler(req, res, next);
            }
            catch (err) {
                const status = err.status || 500;
                const message = err.message || 'Something went wrong';
                console.error(`Error occurred in -> ${req.method.toUpperCase()} ${controller}`);
                console.error('\n\x1b[31m%s\x1b[0m\n', message);
                console.error(err.stack);
                res.status(status).json({ success: false, data: null, message });
            }
        });
    };
}
exports.default = asyncHandler;
//# sourceMappingURL=async-handler.js.map