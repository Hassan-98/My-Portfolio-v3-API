//= Modules
import Multer from 'multer';
//= Filters
import { FilterAndCompressImages, FilterVideos, FilterAudios, FilterDocs, FilterFiles } from './filters';
//= Constants
import { documentWhitelistTypes } from './constants';
//= Config
import ConfigVars from '../configs/app.config';
//= Types
import { IFile, IURLFile, UploadParams } from './storage.types';
//= Storage backends
import { saveToFirebaseBucket, deleteFileByURL as firebaseDeleteByUrl, deleteFileByPath as firebaseDeleteByPath } from './firebase.storage';
import { saveToTelegram } from './telegram';

const Config = ConfigVars();

export const multer = Multer({
  storage: Multer.memoryStorage(),
});

export const uploadFileToStorage = ({ file, fileType = 'file', folder, covertToWebp = true }: UploadParams): Promise<IFile> => {
  return new Promise(async (resolve, reject) => {
    let resolvedFileType = fileType;
    let Outputed_File: IFile | IURLFile;

    if (!resolvedFileType) {
      const type = file.mimetype.split('/')[0];
      switch (type) {
        case 'image':
          resolvedFileType = 'image';
          break;
        case 'video':
          resolvedFileType = 'video';
          break;
        case 'audio':
          resolvedFileType = 'audio';
          break;
        case 'application':
          if (documentWhitelistTypes.indexOf(file.mimetype.split('/')[1]) !== -1) resolvedFileType = 'document';
          else resolvedFileType = 'file';
          break;
        default:
          resolvedFileType = 'file';
      }
    }

    switch (resolvedFileType) {
      case 'image':
        try {
          Outputed_File = await FilterAndCompressImages({ file, covertToWebp });
        } catch (e) {
          return reject(e);
        }
        break;
      case 'video':
        try {
          Outputed_File = await FilterVideos(file);
        } catch (e) {
          return reject(e);
        }
        break;
      case 'audio':
        try {
          Outputed_File = await FilterAudios(file);
        } catch (e) {
          return reject(e);
        }
        break;
      case 'document':
        try {
          Outputed_File = await FilterDocs(file);
        } catch (e) {
          return reject(e);
        }
        break;
      case 'file':
        try {
          Outputed_File = await FilterFiles(file);
        } catch (e) {
          return reject(e);
        }
        break;
      default:
        return reject('File is not supported');
    }

    const newFileName = `${resolvedFileType}_${Date.now()}`;
    const logicalPath = folder
      ? `${resolvedFileType}s/${folder}/${newFileName}`
      : `${resolvedFileType}s/${newFileName}`;

    const buffer = Outputed_File.buffer;

    try {
      if (Config.STORAGE_PROVIDER === 'telegram') {
        const { url, path } = await saveToTelegram({
          buffer,
          mimetype: Outputed_File.mimetype,
          size: Outputed_File.size,
          newFileName,
          logicalPath,
        });
        resolve({
          name: newFileName,
          url,
          path,
          size: Outputed_File.size,
        });
        return;
      }

      const url = await saveToFirebaseBucket(logicalPath, buffer, Outputed_File.mimetype);
      resolve({
        name: newFileName,
        url,
        path: logicalPath,
        size: Outputed_File.size,
      });
    } catch (e) {
      reject(e);
    }
  });
};

export async function deleteFileByURL(fileUrl: string) {
  return firebaseDeleteByUrl(fileUrl);
}

export async function deleteFileByPath(filePath: string) {
  return firebaseDeleteByPath(filePath);
}
