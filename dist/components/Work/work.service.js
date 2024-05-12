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
const work_model_1 = __importDefault(require("./work.model"));
//= Utils
const storage_util_1 = require("../../storage/storage.util");
const queryBuilder_1 = __importDefault(require("../../utils/queryBuilder"));
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
class WorkService {
    constructor() {
        this.MODEL = work_model_1.default;
    }
    getAllWorks(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = params || {};
            const { filter, projection, population, sortition } = (0, queryBuilder_1.default)(params || {});
            let works = yield this.MODEL.find(filter, projection, Object.assign(Object.assign(Object.assign(Object.assign({}, population), sortition), (limit ? { limit } : {})), (skip ? { skip } : {}))).lean();
            return works;
        });
    }
    getWorkById(id, queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projection, population } = (0, queryBuilder_1.default)(queryOptions || {});
            let work = yield this.MODEL.findById(id, projection, Object.assign({}, population)).lean();
            if (!work)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Work", id));
            return work;
        });
    }
    addNewWork({ data, images }) {
        return __awaiter(this, void 0, void 0, function* () {
            let desktopImage, mobileImage;
            if (!data.images) {
                if (!images)
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.REQUIRED('images'));
                try {
                    [desktopImage, mobileImage] = yield Promise.all([
                        (0, storage_util_1.uploadFileToStorage)({ file: images.desktop, fileType: 'image', folder: data.name }),
                        (0, storage_util_1.uploadFileToStorage)({ file: images.mobile, fileType: 'image', folder: data.name })
                    ]);
                    data.images = {
                        desktop: desktopImage.url,
                        mobile: mobileImage.url,
                    };
                }
                catch (error) {
                    console.log(error);
                    throw (0, error_handler_middleware_1.HttpError)(400, error.message);
                }
            }
            try {
                yield this.MODEL.updateMany({}, {
                    $inc: {
                        order: 1
                    }
                });
                const work = yield this.MODEL.create(data);
                return work;
            }
            catch (error) {
                console.log(error);
                throw (0, error_handler_middleware_1.HttpError)(400, error.message);
            }
        });
    }
    updateWork(id, updates, images) {
        return __awaiter(this, void 0, void 0, function* () {
            let work = yield this.MODEL.findById(id);
            if (!work)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Work", id));
            if (images) {
                let uploads = [];
                if (images.desktop)
                    uploads.push((0, storage_util_1.uploadFileToStorage)({ file: images.desktop, fileType: 'image', folder: work.name }));
                if (images.mobile)
                    uploads.push((0, storage_util_1.uploadFileToStorage)({ file: images.mobile, fileType: 'image', folder: work.name }));
                let [desktopImage, mobileImage] = yield Promise.all(uploads);
                work.images = Object.assign(Object.assign({}, (desktopImage ? { desktop: desktopImage.url } : { desktop: work.images.desktop })), (mobileImage ? { mobile: mobileImage.url } : { mobile: work.images.mobile }));
            }
            Object.keys(updates).forEach((key) => {
                if (work)
                    work.set(key, updates[key]);
            });
            yield work.save();
            return work;
        });
    }
    updateWorksOrder(newOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            const writes = newOrder.map(Order => ({
                updateOne: {
                    filter: { _id: Order.id },
                    update: { $set: { order: Order.order } }
                }
            }));
            yield this.MODEL.bulkWrite(writes);
            return true;
        });
    }
    deleteWork(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let isDeleted = yield this.MODEL.findByIdAndDelete(id);
            if (!isDeleted)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Work", id));
            return true;
        });
    }
}
exports.default = WorkService;
//# sourceMappingURL=work.service.js.map