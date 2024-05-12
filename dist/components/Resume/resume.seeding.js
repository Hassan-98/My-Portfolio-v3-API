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
const resume_model_1 = __importDefault(require("./resume.model"));
function migrateResumePreferences() {
    return __awaiter(this, void 0, void 0, function* () {
        const resumePreferencesCount = yield resume_model_1.default.count({});
        if (resumePreferencesCount <= 0) {
            yield resume_model_1.default.create({
                templates: [
                    {
                        name: "Minimal 1",
                        image: "/images/minimal-cv.png"
                    },
                    {
                        name: "Minimal 2",
                        image: "/images/minimal-2-cv.png"
                    }
                ],
                links: {
                    showEmail: true,
                    showPhone: true,
                    showLinkedin: true,
                    showGithub: true,
                    showTwitter: false
                },
                summary: {
                    showSection: true,
                    showPicture: false,
                    enableCustomSummary: true,
                    customSummary: "I’m Hassan Ali, MERN Stack web developer from Egypt, Innovative Web Developer with over 1.5 years of experience inwebsite design and development. Demonstrated talent for front and back end web development to optimize onlinepresence. Expert in languages such as HTML, CSS, JavaScript and Node.js as well as React and Vue frameworks.",
                    enableCustomTitle: false
                },
                skills: {
                    showSection: true,
                    showFrontendSkills: true,
                    showBackendSkills: true,
                    showToolsSkills: true,
                    skillsPeriority: 'front'
                },
                experiences: {
                    showSection: true,
                    isLimited: true,
                    limit: 3
                },
                education: {
                    showSection: true,
                    isLimited: true,
                    limit: 3
                },
                projects: {
                    showSection: true,
                    isLimited: true,
                    showTcgWorks: true,
                    limit: 6
                }
            });
        }
    });
}
exports.default = migrateResumePreferences;
;
//# sourceMappingURL=resume.seeding.js.map