"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
require("reflect-metadata");
const AppRouter_1 = require("../router/AppRouter");
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const constants_1 = require("../constants");
function Controller(routePrefix) {
    const router = AppRouter_1.AppRouter.getRouter();
    return function (target) {
        let props = Object.getOwnPropertyNames(target.prototype).filter((property) => property !== 'constructor');
        for (let key of props) {
            const routeHandler = target.prototype[key];
            const path = Reflect.getMetadata(constants_1.MetadataKeys.PATH, target.prototype, key);
            const method = Reflect.getMetadata(constants_1.MetadataKeys.METHOD, target.prototype, key);
            const middlewares = Reflect.getMetadata(constants_1.MetadataKeys.MIDDLEWARE, target.prototype, key) || [];
            if (path) {
                router[method](`${routePrefix}${path}`, ...middlewares, (0, async_handler_1.default)(`${routePrefix}${path}`, routeHandler));
            }
        }
    };
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map