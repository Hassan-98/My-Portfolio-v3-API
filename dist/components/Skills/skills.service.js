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
//= Models
const skills_model_1 = __importDefault(require("./skills.model"));
//= Utils
const queryBuilder_1 = __importDefault(require("../../utils/queryBuilder"));
const error_messages_1 = __importDefault(require("../../utils/error-messages"));
//= Middlwares
const error_handler_middleware_1 = require("../../middlewares/error.handler.middleware");
class SkillService {
    constructor() {
        this.MODEL = skills_model_1.default;
    }
    getSkills(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = queryOptions || {};
            const { filter, population, projection, sortition } = (0, queryBuilder_1.default)(queryOptions || {});
            let skills = yield this.MODEL.find(filter, projection, Object.assign(Object.assign(Object.assign(Object.assign({}, population), sortition), (limit ? { limit } : {})), (skip ? { skip } : {}))).lean();
            if (!skills.length)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("skills"));
            return skills;
        });
    }
    getSkillById(id, queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projection, population } = (0, queryBuilder_1.default)(queryOptions || {});
            let skill = yield this.MODEL.findById(id, projection, Object.assign({}, population)).lean();
            if (!skill)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("skill", id));
            return skill;
        });
    }
    addNewSkill(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const skill = yield this.MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId() }, data, {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
                populate: { path: 'skill' }
            });
            return skill;
        });
    }
    updateSkillsByType(skills, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.MODEL.deleteMany({ type });
            yield this.MODEL.create(skills);
            return true;
        });
    }
    updateSkill(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            let skill = yield this.MODEL.findById(id);
            if (!skill)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("skill", id));
            Object.keys(updates).forEach((key) => {
                if (skill) {
                    skill.set(key, updates[key]);
                }
            });
            yield skill.save();
            return skill;
        });
    }
    deleteASkill(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let isDeleted = yield this.MODEL.findByIdAndDelete(id);
            if (!isDeleted)
                throw (0, error_handler_middleware_1.HttpError)(400, error_messages_1.default.NOT_EXIST("skill", id));
            return true;
        });
    }
}
exports.default = SkillService;
//# sourceMappingURL=skills.service.js.map