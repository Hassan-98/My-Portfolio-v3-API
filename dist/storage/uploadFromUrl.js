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
const axios_1 = __importDefault(require("axios"));
//= Utils
const storage_util_1 = require("./storage.util");
exports.default = (url, folder, fileType = "image") => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imageResponse = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
    if (!imageResponse)
        throw new Error(`Can't get image from ${url}`);
    let file = {
        buffer: Buffer.from(imageResponse.data, "binary"),
        fieldname: "image",
        originalname: `external-image.${(_a = imageResponse === null || imageResponse === void 0 ? void 0 : imageResponse.headers['content-type']) === null || _a === void 0 ? void 0 : _a.split("/")[1]}`,
        encoding: "binary",
        mimetype: (imageResponse === null || imageResponse === void 0 ? void 0 : imageResponse.headers['content-type']) || '',
        size: parseInt((imageResponse === null || imageResponse === void 0 ? void 0 : imageResponse.headers['content-length']) || '0') || 0
    };
    const uploadedPicture = yield (0, storage_util_1.uploadFileToStorage)({ file, fileType, folder });
    return uploadedPicture;
});
//# sourceMappingURL=uploadFromUrl.js.map