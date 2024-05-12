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
const general_model_1 = __importDefault(require("./general.model"));
const stack_model_1 = __importDefault(require("../Stack/stack.model"));
function migrateGeneralSettings() {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const generalSettingsCount = yield general_model_1.default.count({});
        if (generalSettingsCount <= 0) {
            const stacks = yield stack_model_1.default.find({
                name: { $in: ['Node.js', 'MongoDB', 'React', 'Vue', 'TypeScript'] }
            }).lean();
            yield general_model_1.default.create({
                header: {
                    jobTitle: "MERN Stack developer",
                    descriptionText: "I'm a self-taught software engineer based on Egypt, with over 2 years experience specializing in MERN Stack web development.",
                    pictureUrl: "/images/my-picture.png"
                },
                intro: {
                    experienceYears: 2,
                    jobTitle: "MERN Stack developer",
                    aboutMe: `Hello! My name is Hassan, a self-taught software engineer based on Egypt, with +2 years experience as a professional Web developer, specializing in MERN Stack web development, Welcome to my corner of the internet. <BR>
        My interest in web development started back in 2018 when I decided to try to create my first personal website — turns out hacking together a custom website taught me a lot about HTML & CSS!`
                },
                links: {
                    emailAddress: "7assan.3li1998@gmail.com",
                    phoneNumber: "+201146321817",
                    github: "https://github.com/Hassan-98",
                    twitter: "https://twitter.com/aeae9992",
                    linkedin: "https://www.linkedin.com/in/hassan1998"
                },
                recentStack: [
                    {
                        stack: (_a = stacks.find(stack => stack.name === "Node.js")) === null || _a === void 0 ? void 0 : _a._id,
                        order: 1
                    },
                    {
                        stack: (_b = stacks.find(stack => stack.name === "MongoDB")) === null || _b === void 0 ? void 0 : _b._id,
                        order: 2
                    },
                    {
                        stack: (_c = stacks.find(stack => stack.name === "React")) === null || _c === void 0 ? void 0 : _c._id,
                        order: 3
                    },
                    {
                        stack: (_d = stacks.find(stack => stack.name === "Vue")) === null || _d === void 0 ? void 0 : _d._id,
                        order: 4
                    },
                    {
                        stack: (_e = stacks.find(stack => stack.name === "TypeScript")) === null || _e === void 0 ? void 0 : _e._id,
                        order: 5
                    }
                ]
            });
        }
    });
}
exports.default = migrateGeneralSettings;
;
//# sourceMappingURL=general.seeding.js.map