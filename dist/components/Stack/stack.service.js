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
//= Models
const stack_model_1 = __importDefault(require("./stack.model"));
//= Utils
const queryBuilder_1 = __importDefault(require("../../utils/queryBuilder"));
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
const storage_util_1 = require("../../storage/storage.util");
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
class StackService {
    constructor() {
        this.MODEL = stack_model_1.default;
    }
    getStacks(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = queryOptions || {};
            const { filter, projection, population, sortition } = (0, queryBuilder_1.default)(queryOptions || {});
            let stacks = yield this.MODEL.find(filter, projection, Object.assign(Object.assign(Object.assign(Object.assign({}, population), sortition), (limit ? { limit } : {})), (skip ? { skip } : {}))).lean();
            if (!stacks.length)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Stacks"));
            return stacks;
        });
    }
    getStackByIdOrName(idOrName, queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projection, population } = (0, queryBuilder_1.default)(queryOptions || {});
            let stack;
            if ((0, checkObjectId_1.default)(idOrName))
                stack = yield this.MODEL.findById(idOrName, projection, Object.assign({}, population)).lean();
            else
                stack = yield this.MODEL.findOne({ name: { $regex: idOrName, $options: 'i' } }).lean();
            if (!stack)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Stack", idOrName));
            return stack;
        });
    }
    addNewStack({ data, image }) {
        return __awaiter(this, void 0, void 0, function* () {
            let Image;
            if (!data.image) {
                if (!image)
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.REQUIRED('image'));
                Image = yield (0, storage_util_1.uploadFileToStorage)({ file: image, fileType: 'image', folder: data.name });
                data.image = Image.url;
            }
            const stack = yield this.MODEL.create(data);
            return stack;
        });
    }
    updateStack(id, updates, image) {
        return __awaiter(this, void 0, void 0, function* () {
            let stack = yield this.MODEL.findById(id);
            if (!stack)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("stack", id));
            if (image) {
                let uploadedImage = yield (0, storage_util_1.uploadFileToStorage)({ file: image, fileType: 'image', folder: stack.name });
                stack.image = uploadedImage.url;
            }
            Object.keys(updates).forEach((key) => {
                if (stack)
                    stack.set(key, updates[key]);
            });
            yield stack.save();
            return stack;
        });
    }
    deleteAStack(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let isDeleted = yield this.MODEL.findByIdAndDelete(id);
            if (!isDeleted)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Stack", id));
            return true;
        });
    }
}
exports.default = StackService;
//# sourceMappingURL=stack.service.js.map