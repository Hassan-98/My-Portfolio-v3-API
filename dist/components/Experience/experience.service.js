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
const experience_model_1 = __importDefault(require("./experience.model"));
//= Utils
const queryBuilder_1 = __importDefault(require("../../utils/queryBuilder"));
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
class ExperienceService {
    constructor() {
        this.MODEL = experience_model_1.default;
    }
    getExperiences(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = queryOptions || {};
            const { filter, projection, sortition } = (0, queryBuilder_1.default)(queryOptions || {});
            let experiences = yield this.MODEL.find(filter, projection, Object.assign(Object.assign(Object.assign({}, sortition), (limit ? { limit } : {})), (skip ? { skip } : {}))).lean();
            if (!experiences.length)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("experiences"));
            return experiences;
        });
    }
    getExperienceByIdOrName(idOrName, queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projection } = (0, queryBuilder_1.default)(queryOptions || {});
            let experience;
            if ((0, checkObjectId_1.default)(idOrName))
                experience = yield this.MODEL.findById(idOrName, projection).lean();
            else
                experience = yield this.MODEL.findOne({ name: { $regex: idOrName, $options: 'i' } }).lean();
            if (!experience)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("experience", idOrName));
            return experience;
        });
    }
    addNewExperience(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.endedAt && new Date(data.endedAt).getTime() < new Date(data.startedAt).getTime())
                throw (0, error_handler_middleware_1.HttpError)(400, "Job end date cannot be before job start date");
            const experience = yield this.MODEL.create(data);
            return experience;
        });
    }
    updateExperience(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            let experience = yield this.MODEL.findById(id);
            if (!experience)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("experience", id));
            Object.keys(updates).forEach((key) => {
                if (experience) {
                    if (updates.endedAt && updates.startedAt && new Date(updates.endedAt).getTime() < new Date(updates.startedAt).getTime())
                        throw (0, error_handler_middleware_1.HttpError)(400, "Job end date cannot be before job start date");
                    else if (updates.endedAt && !updates.startedAt && new Date(updates.endedAt).getTime() < new Date(experience.startedAt).getTime())
                        throw (0, error_handler_middleware_1.HttpError)(400, "Job end date cannot be before job start date");
                    experience.set(key, updates[key]);
                }
            });
            yield experience.save();
            return experience;
        });
    }
    deleteAExperience(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let isDeleted = yield this.MODEL.findByIdAndDelete(id);
            if (!isDeleted)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("experience", id));
            return true;
        });
    }
}
exports.default = ExperienceService;
//# sourceMappingURL=experience.service.js.map