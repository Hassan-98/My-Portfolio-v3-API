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
const certificates_model_1 = __importDefault(require("./certificates.model"));
//= Utils
const storage_util_1 = require("../../storage/storage.util");
const queryBuilder_1 = __importDefault(require("../../utils/queryBuilder"));
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
class CertificateService {
    constructor() {
        this.MODEL = certificates_model_1.default;
    }
    getAllCertificates(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = params || {};
            const { filter, projection, population, sortition } = (0, queryBuilder_1.default)(params || {});
            let certificates = yield this.MODEL.find(filter, projection, Object.assign(Object.assign(Object.assign(Object.assign({}, population), sortition), (limit ? { limit } : {})), (skip ? { skip } : {}))).lean();
            if (!certificates.length)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Certificates"));
            return certificates;
        });
    }
    getCertificateById(id, queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projection, population } = (0, queryBuilder_1.default)(queryOptions || {});
            let certificate = yield this.MODEL.findById(id, projection, Object.assign({}, population)).lean();
            if (!certificate)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Certificate", id));
            return certificate;
        });
    }
    addNewCertificate({ data, image }) {
        return __awaiter(this, void 0, void 0, function* () {
            let Image;
            if (!data.image) {
                if (!image)
                    throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.REQUIRED('image'));
                Image = yield (0, storage_util_1.uploadFileToStorage)({ file: image, fileType: 'image', folder: data.title });
                data.image = Image.url;
            }
            yield this.MODEL.updateMany({}, {
                $inc: {
                    order: 1
                }
            });
            const certificate = yield this.MODEL.create(data);
            return certificate;
        });
    }
    updateCertificate(id, updates, image) {
        return __awaiter(this, void 0, void 0, function* () {
            let certificate = yield this.MODEL.findById(id);
            if (!certificate)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Certificate", id));
            if (image) {
                let uploaded_image = yield (0, storage_util_1.uploadFileToStorage)({ file: image, fileType: 'image', folder: certificate.title });
                certificate.image = uploaded_image.url;
            }
            Object.keys(updates).forEach((key) => {
                if (certificate)
                    certificate.set(key, updates[key]);
            });
            yield certificate.save();
            return certificate;
        });
    }
    updateCertificatesOrder(newOrder) {
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
    deleteCertificate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let isDeleted = yield this.MODEL.findByIdAndDelete(id);
            if (!isDeleted)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("Certificate", id));
            return true;
        });
    }
}
exports.default = CertificateService;
//# sourceMappingURL=certificates.service.js.map