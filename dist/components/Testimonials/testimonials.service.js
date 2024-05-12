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
const testimonials_model_1 = __importDefault(require("./testimonials.model"));
//= Utils
const queryBuilder_1 = __importDefault(require("../../utils/queryBuilder"));
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
class TestimonialService {
    constructor() {
        this.MODEL = testimonials_model_1.default;
    }
    getTestimonials(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = queryOptions || {};
            const { filter, projection, sortition } = (0, queryBuilder_1.default)(queryOptions || {});
            let testimonials = yield this.MODEL.find(filter, projection, Object.assign(Object.assign(Object.assign({}, sortition), (limit ? { limit } : {})), (skip ? { skip } : {}))).lean();
            if (!testimonials.length)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("testimonials"));
            return testimonials;
        });
    }
    getTestimonialById(id, queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projection } = (0, queryBuilder_1.default)(queryOptions || {});
            let testimonial = yield this.MODEL.findById(id, projection).lean();
            if (!testimonial)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("testimonial", id));
            return testimonial;
        });
    }
    addNewTestimonial(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const testimonial = yield this.MODEL.create(data);
            return testimonial;
        });
    }
    updateTestimonial(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            let testimonial = yield this.MODEL.findById(id);
            if (!testimonial)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("testimonial", id));
            Object.keys(updates).forEach((key) => {
                if (testimonial)
                    testimonial.set(key, updates[key]);
            });
            yield testimonial.save();
            return testimonial;
        });
    }
    deleteATestimonial(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let isDeleted = yield this.MODEL.findByIdAndDelete(id);
            if (!isDeleted)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("testimonial", id));
            return true;
        });
    }
}
exports.default = TestimonialService;
//# sourceMappingURL=testimonials.service.js.map