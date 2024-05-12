"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//= Load Environment Variables
require("dotenv/config");
//= Application
const app_1 = __importDefault(require("./app"));
//= Validate Config Vars
const app_config_1 = __importDefault(require("./configs/app.config"));
// Validate Config Vars
(0, app_config_1.default)();
// Init New Application
const app = new app_1.default();
// Start The App
const expressApp = app.start();
exports.default = expressApp;
//# sourceMappingURL=index.js.map