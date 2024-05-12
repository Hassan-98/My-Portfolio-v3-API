"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Put = exports.Delete = exports.Patch = exports.Post = exports.Get = void 0;
require("reflect-metadata");
const constants_1 = require("../constants");
function routeBinder(method) {
    return function (path) {
        return function (target, key) {
            Reflect.defineMetadata(constants_1.MetadataKeys.PATH, path, target, key);
            Reflect.defineMetadata(constants_1.MetadataKeys.METHOD, method, target, key);
        };
    };
}
exports.Get = routeBinder(constants_1.Methods.GET);
exports.Post = routeBinder(constants_1.Methods.POST);
exports.Patch = routeBinder(constants_1.Methods.PATCH);
exports.Delete = routeBinder(constants_1.Methods.DELETE);
exports.Put = routeBinder(constants_1.Methods.PUT);
//# sourceMappingURL=methods.js.map