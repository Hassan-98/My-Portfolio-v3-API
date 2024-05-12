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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connection = mongoose_1.default.connection;
const controllerHandlerWithTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield connection.startSession();
    try {
        session.startTransaction();
        /**
         *
         * Handling The Controller
         *
        */
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        next(error);
    }
    session.endSession();
});
//# sourceMappingURL=withTransation%5Bexample%5D.js.map