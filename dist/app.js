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
//= Modules
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
//= Router
const AppRouter_1 = require("./router/AppRouter");
require("./router/Routes");
//= Seedings
const general_seeding_1 = __importDefault(require("./components/General/general.seeding"));
const stack_seeding_1 = __importDefault(require("./components/Stack/stack.seeding"));
const skills_seeding_1 = __importDefault(require("./components/Skills/skills.seeding"));
const resume_seeding_1 = __importDefault(require("./components/Resume/resume.seeding"));
//= Database Configurations
const db_config_1 = require("./configs/db.config");
class App {
    constructor() {
        var _a;
        this.whitelistedDomains = ((_a = process.env.WHITELISTED_DOMAINS) === null || _a === void 0 ? void 0 : _a.split('|')) || [''];
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 9999;
        this.isProduction = process.env.NODE_ENV === 'production' ? true : false;
        this.isTesting = process.env.NODE_ENV === 'testing' ? true : false;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeAppRouter();
        this.initSeedings();
    }
    start() {
        this.app.listen(this.port, () => {
            console.log('\x1b[32m%s\x1b[0m', `\n✅ [Server] listening at port ${this.port}`);
        });
        return this.app;
    }
    initSeedings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, stack_seeding_1.default)();
            yield (0, general_seeding_1.default)();
            yield (0, skills_seeding_1.default)();
            yield (0, resume_seeding_1.default)();
        });
    }
    initializeMiddlewares() {
        if (this.isProduction) {
            // Disable etag and x-powered-by
            this.app.disable("etag").disable("x-powered-by");
            // HPP Protect
            this.app.use((0, hpp_1.default)());
            // Helmet Protect
            this.app.use((0, helmet_1.default)());
        }
        // Req & Res Compression
        this.app.use((0, compression_1.default)());
        // Cross-Origin Resource Sharing
        this.app.use((0, cors_1.default)({
            origin: true,
            credentials: true
        }));
        // Cookie Parser
        this.app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
        // Set Morgan Logger
        this.app.use((0, morgan_1.default)(':method :url :status - :response-time ms'));
        // Setting JSON in Body Of Requests
        this.app.use(express_1.default.json({ limit: '20mb' }));
        this.app.use(express_1.default.urlencoded({ limit: '20mb', extended: true }));
    }
    initializeAppRouter() {
        this.app.use(AppRouter_1.AppRouter.getRouter());
    }
    corsOptionsDelegate(req, callback) {
        var _a;
        let corsOptions;
        let domains = ((_a = process.env.WHITELISTED_DOMAINS) === null || _a === void 0 ? void 0 : _a.split('|')) || [''];
        if (domains.indexOf(req.headers.origin) > -1)
            corsOptions = {
                origin: true,
                credentials: true,
            };
        else
            corsOptions = { origin: false, credentials: true };
        callback(null, corsOptions);
    }
    connectToDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE, MONGO_DEV_DATABASE } = db_config_1.databaseConfig;
        if (this.isProduction && !this.isTesting) {
            mongoose_1.default.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`);
        }
        else if (this.isTesting && this.isProduction) {
            mongoose_1.default.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}-testing`);
        }
        else if (this.isTesting && !this.isProduction) {
            mongoose_1.default.connect(`mongodb://127.0.0.1:27017/${MONGO_DEV_DATABASE}-testing`);
        }
        else {
            mongoose_1.default.connect(`mongodb://127.0.0.1:27017/${MONGO_DEV_DATABASE}`);
        }
        mongoose_1.default.connection.on('connected', () => {
            console.log('\x1b[32m%s\x1b[0m', '✅ [MongoDB] Connected...');
        });
        mongoose_1.default.connection.on('error', (err) => console.log('\x1b[31m%s\x1b[0m', '❌ [MongoDB] Error : ' + err));
        mongoose_1.default.connection.on('disconnected', () => console.log('\x1b[31m%s\x1b[0m', '❌ [MongoDB] Disconnected...'));
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map