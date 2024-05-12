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
const skills_model_1 = __importDefault(require("./skills.model"));
const stack_model_1 = __importDefault(require("../Stack/stack.model"));
//= Types
const skills_types_1 = require("./skills.types");
const stack_types_1 = require("../Stack/stack.types");
function migrateSkills() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    return __awaiter(this, void 0, void 0, function* () {
        const skillsFound = yield skills_model_1.default.count({});
        if (!skillsFound) {
            const stacks = yield stack_model_1.default.find({}).lean();
            yield skills_model_1.default.create([
                {
                    skill: (_a = stacks.find(stack => stack.name === "HTML")) === null || _a === void 0 ? void 0 : _a._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 1
                },
                {
                    skill: (_b = stacks.find(stack => stack.name === "CSS")) === null || _b === void 0 ? void 0 : _b._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 2
                },
                {
                    skill: (_c = stacks.find(stack => stack.name === "JavaScript")) === null || _c === void 0 ? void 0 : _c._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 3
                },
                {
                    skill: (_d = stacks.find(stack => stack.name === "TypeScript")) === null || _d === void 0 ? void 0 : _d._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 4
                },
                {
                    skill: (_e = stacks.find(stack => stack.name === "jQuery")) === null || _e === void 0 ? void 0 : _e._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 5
                },
                {
                    skill: (_f = stacks.find(stack => stack.name === "Bootstrap")) === null || _f === void 0 ? void 0 : _f._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 6
                },
                {
                    skill: (_g = stacks.find(stack => stack.name === "Sass")) === null || _g === void 0 ? void 0 : _g._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 7
                },
                {
                    skill: (_h = stacks.find(stack => stack.name === "React")) === null || _h === void 0 ? void 0 : _h._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 8
                },
                {
                    skill: (_j = stacks.find(stack => stack.name === "Redux")) === null || _j === void 0 ? void 0 : _j._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 9
                },
                {
                    skill: (_k = stacks.find(stack => stack.name === "Next.js")) === null || _k === void 0 ? void 0 : _k._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 10
                },
                {
                    skill: (_l = stacks.find(stack => stack.name === "Vue")) === null || _l === void 0 ? void 0 : _l._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 11
                },
                {
                    skill: (_m = stacks.find(stack => stack.name === "Nuxt")) === null || _m === void 0 ? void 0 : _m._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.front,
                    order: 12
                },
                {
                    skill: (_o = stacks.find(stack => stack.name === "Material UI")) === null || _o === void 0 ? void 0 : _o._id,
                    mastery: skills_types_1.SkillMastery.Moderate,
                    type: stack_types_1.StackType.front,
                    order: 13
                },
                {
                    skill: (_p = stacks.find(stack => stack.name === "Gatsby")) === null || _p === void 0 ? void 0 : _p._id,
                    mastery: skills_types_1.SkillMastery.Moderate,
                    type: stack_types_1.StackType.front,
                    order: 14
                },
                {
                    skill: (_q = stacks.find(stack => stack.name === "Jest")) === null || _q === void 0 ? void 0 : _q._id,
                    mastery: skills_types_1.SkillMastery.Moderate,
                    type: stack_types_1.StackType.front,
                    order: 15
                },
                {
                    skill: (_r = stacks.find(stack => stack.name === "Node.js")) === null || _r === void 0 ? void 0 : _r._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.back,
                    order: 1
                },
                {
                    skill: (_s = stacks.find(stack => stack.name === "Express")) === null || _s === void 0 ? void 0 : _s._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.back,
                    order: 2
                },
                {
                    skill: (_t = stacks.find(stack => stack.name === "MongoDB")) === null || _t === void 0 ? void 0 : _t._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.back,
                    order: 3
                },
                {
                    skill: (_u = stacks.find(stack => stack.name === "TypeScript")) === null || _u === void 0 ? void 0 : _u._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.back,
                    order: 4
                },
                {
                    skill: (_v = stacks.find(stack => stack.name === "Prisma")) === null || _v === void 0 ? void 0 : _v._id,
                    mastery: skills_types_1.SkillMastery.Moderate,
                    type: stack_types_1.StackType.back,
                    order: 5
                },
                {
                    skill: (_w = stacks.find(stack => stack.name === "Jest")) === null || _w === void 0 ? void 0 : _w._id,
                    mastery: skills_types_1.SkillMastery.Moderate,
                    type: stack_types_1.StackType.back,
                    order: 6
                },
                {
                    skill: (_x = stacks.find(stack => stack.name === "PostgreSQL")) === null || _x === void 0 ? void 0 : _x._id,
                    mastery: skills_types_1.SkillMastery.Moderate,
                    type: stack_types_1.StackType.back,
                    order: 7
                },
                {
                    skill: (_y = stacks.find(stack => stack.name === "Git")) === null || _y === void 0 ? void 0 : _y._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.tools,
                    order: 1
                },
                {
                    skill: (_z = stacks.find(stack => stack.name === "Github")) === null || _z === void 0 ? void 0 : _z._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.tools,
                    order: 2
                },
                {
                    skill: (_0 = stacks.find(stack => stack.name === "NPM")) === null || _0 === void 0 ? void 0 : _0._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.tools,
                    order: 3
                },
                {
                    skill: (_1 = stacks.find(stack => stack.name === "Yarn")) === null || _1 === void 0 ? void 0 : _1._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.tools,
                    order: 4
                },
                {
                    skill: (_2 = stacks.find(stack => stack.name === "Vercel")) === null || _2 === void 0 ? void 0 : _2._id,
                    mastery: skills_types_1.SkillMastery.Proficient,
                    type: stack_types_1.StackType.tools,
                    order: 5
                },
                {
                    skill: (_3 = stacks.find(stack => stack.name === "Netlify")) === null || _3 === void 0 ? void 0 : _3._id,
                    mastery: skills_types_1.SkillMastery.Moderate,
                    type: stack_types_1.StackType.tools,
                    order: 6
                },
                {
                    skill: (_4 = stacks.find(stack => stack.name === "AWS")) === null || _4 === void 0 ? void 0 : _4._id,
                    mastery: skills_types_1.SkillMastery.Moderate,
                    type: stack_types_1.StackType.tools,
                    order: 7
                }
            ]);
        }
    });
}
exports.default = migrateSkills;
;
//# sourceMappingURL=skills.seeding.js.map