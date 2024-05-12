"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Use = void 0;
require("reflect-metadata");
const constants_1 = require("../constants");
function Use(middleware) {
    return function (target, key) {
        const middlewares = Reflect.getMetadata(constants_1.MetadataKeys.MIDDLEWARE, target, key) || [];
        middlewares.unshift(middleware);
        Reflect.defineMetadata(constants_1.MetadataKeys.MIDDLEWARE, middlewares, target, key);
    };
}
exports.Use = Use;
//# sourceMappingURL=use.js.map