//= Modules
import path from 'path';
import sharp from 'sharp';
//= Constants
import { fileSizes, documentWhitelistTypes, audioWhitelistExtentions, videoWhitelistExtentions, imagesWhitelistExtentions } from './constants';
//= Types
import { IURLFile } from './storage.types';

// Filter and Compress Images
export const FilterAndCompressImages = ({ file, covertToWebp }: { file: Express.Multer.File | IURLFile; covertToWebp: boolean }): Promise<Express.Multer.File | IURLFile> => {
  return new Promise(async (resolve, reject) => {
    // File Type Filter
    const fileType = file.mimetype.split("/")[0];
    if (!file || fileType != "image") return reject("The selected file is not an image");

    // File Size Filter
    const maxFileSize = fileSizes.images * (1024 * 1024)
    if (file.size > maxFileSize) return reject(`Image size is more than ${fileSizes.images}MB`);

    // File Extention Filter
    const fileExtention = path.extname(file.originalname);
    if (imagesWhitelistExtentions.indexOf(fileExtention.toLowerCase()) == -1) return reject("Image type is not supported");

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
  })
}

// Filter Videos
export const FilterVideos = (file: Express.Multer.File | IURLFile): Promise<Express.Multer.File | IURLFile> => {
  return new Promise((resolve, reject) => {
    // File Type Filter
    const fileType = file.mimetype.split("/")[0];
    if (!file || fileType != "video") return reject("The selected file is not a video");

    // File Size Filter
    const maxFileSize = fileSizes.videos * (1024 * 1024)
    if (file.size > maxFileSize) return reject(`Video size is more than ${fileSizes.videos}MB`);

    // File Extention Filter
    const fileExtention = path.extname(file.originalname);
    if (videoWhitelistExtentions.indexOf(fileExtention.toLowerCase()) == -1) return reject("Video type is not supported");

    return resolve(file);
  })
}

// Filter Videos
export const FilterAudios = (file: Express.Multer.File | IURLFile): Promise<Express.Multer.File | IURLFile> => {
  return new Promise((resolve, reject) => {
    // File Type Filter
    const fileType = file.mimetype.split("/")[0];
    if (!file || fileType != "audio") return reject("The selected file is not an audio");

    // File Size Filter
    const maxFileSize = fileSizes.audios * (1024 * 1024) // 20MB
    if (file.size > maxFileSize) return reject(`Audio size is more than ${fileSizes.audios}MB`);

    // File Extention Filter
    const fileExtention = path.extname(file.originalname);
    if (audioWhitelistExtentions.indexOf(fileExtention.toLowerCase()) == -1) return reject("Audio type is not supported");

    return resolve(file);
  })
}

// Filter Files
export const FilterDocs = (file: Express.Multer.File | IURLFile): Promise<Express.Multer.File | IURLFile> => {
  return new Promise((resolve, reject) => {
    // File Type Filter
    const fileType = file.mimetype.split("/")[1];

    if (documentWhitelistTypes.indexOf(fileType) == -1) return reject("File is not a document");

    // File Size Filter
    const maxFileSize = fileSizes.documents * (1024 * 1024)
    if (file.size > maxFileSize) return reject(`Document size is more than ${fileSizes.documents}MB`);

    return resolve(file);
  })
}

// Filter Files
export const FilterFiles = (file: Express.Multer.File | IURLFile): Promise<Express.Multer.File | IURLFile> => {
  return new Promise((resolve, reject) => {
    // File Size Filter
    const maxFileSize = fileSizes.files * (1024 * 1024)
    if (file.size > maxFileSize) return reject(`File size is more than ${fileSizes.files}MB`);

    return resolve(file);
  })
}