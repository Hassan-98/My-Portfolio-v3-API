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
exports.FilterFiles = exports.FilterDocs = exports.FilterAudios = exports.FilterVideos = exports.FilterAndCompressImages = void 0;
//= Modules
const path_1 = __importDefault(require("path"));
//= Constants
const constants_1 = require("./constants");
// Filter and Compress Images
const FilterAndCompressImages = ({ file, covertToWebp }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // File Type Filter
        const fileType = file.mimetype.split("/")[0];
        if (!file || fileType != "image")
            return reject("The selected file is not an image");
        // File Size Filter
        const maxFileSize = constants_1.fileSizes.images * (1024 * 1024);
        if (file.size > maxFileSize)
            return reject(`Image size is more than ${constants_1.fileSizes.images}MB`);
        // File Extention Filter
        const fileExtention = path_1.default.extname(file.originalname);
        if (constants_1.imagesWhitelistExtentions.indexOf(fileExtention.toLowerCase()) == -1)
            return reject("Image type is not supported");
        // Use Sharp to compress image
        // var compressedFile: Express.Multer.File | IURLFile = covertToWebp || fileExtention.toLowerCase() !== '.avif' ? {
        //   ...file,
        //   mimetype: 'image/webp',
        //   buffer: await sharp(file.buffer).webp({ nearLossless: true, quality: 50, alphaQuality: 80, effort: 5 }).toBuffer()
        // } : file;
        // var compressedFile: Express.Multer.File | IURLFile = covertToWebp || fileExtention.toLowerCase() !== '.avif' ? {
        //   ...file,
        //   mimetype: 'image/webp',
        //   buffer: await sharp(file.buffer).webp({ nearLossless: true, quality: 50, alphaQuality: 80, effort: 5 }).toBuffer()
        // } : file;
        // if (!compressedFile) return reject("An error occurred while uploading the file");
        return resolve(file);
    }));
};
exports.FilterAndCompressImages = FilterAndCompressImages;
// Filter Videos
const FilterVideos = (file) => {
    return new Promise((resolve, reject) => {
        // File Type Filter
        const fileType = file.mimetype.split("/")[0];
        if (!file || fileType != "video")
            return reject("The selected file is not a video");
        // File Size Filter
        const maxFileSize = constants_1.fileSizes.videos * (1024 * 1024);
        if (file.size > maxFileSize)
            return reject(`Video size is more than ${constants_1.fileSizes.videos}MB`);
        // File Extention Filter
        const fileExtention = path_1.default.extname(file.originalname);
        if (constants_1.videoWhitelistExtentions.indexOf(fileExtention.toLowerCase()) == -1)
            return reject("Video type is not supported");
        return resolve(file);
    });
};
exports.FilterVideos = FilterVideos;
// Filter Videos
const FilterAudios = (file) => {
    return new Promise((resolve, reject) => {
        // File Type Filter
        const fileType = file.mimetype.split("/")[0];
        if (!file || fileType != "audio")
            return reject("The selected file is not an audio");
        // File Size Filter
        const maxFileSize = constants_1.fileSizes.audios * (1024 * 1024); // 20MB
        if (file.size > maxFileSize)
            return reject(`Audio size is more than ${constants_1.fileSizes.audios}MB`);
        // File Extention Filter
        const fileExtention = path_1.default.extname(file.originalname);
        if (constants_1.audioWhitelistExtentions.indexOf(fileExtention.toLowerCase()) == -1)
            return reject("Audio type is not supported");
        return resolve(file);
    });
};
exports.FilterAudios = FilterAudios;
// Filter Files
const FilterDocs = (file) => {
    return new Promise((resolve, reject) => {
        // File Type Filter
        const fileType = file.mimetype.split("/")[1];
        if (constants_1.documentWhitelistTypes.indexOf(fileType) == -1)
            return reject("File is not a document");
        // File Size Filter
        const maxFileSize = constants_1.fileSizes.documents * (1024 * 1024);
        if (file.size > maxFileSize)
            return reject(`Document size is more than ${constants_1.fileSizes.documents}MB`);
        return resolve(file);
    });
};
exports.FilterDocs = FilterDocs;
// Filter Files
const FilterFiles = (file) => {
    return new Promise((resolve, reject) => {
        // File Size Filter
        const maxFileSize = constants_1.fileSizes.files * (1024 * 1024);
        if (file.size > maxFileSize)
            return reject(`File size is more than ${constants_1.fileSizes.files}MB`);
        return resolve(file);
    });
};
exports.FilterFiles = FilterFiles;
//# sourceMappingURL=filters.js.map