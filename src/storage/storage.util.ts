//= Modules
import Multer from "multer";
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
//= Filters
import { FilterAndCompressImages, FilterVideos, FilterAudios, FilterDocs, FilterFiles } from './filters';
//= Constants
import { documentWhitelistTypes } from './constants';
//= Config
import ConfigVars from '../configs/app.config';
//= Types
import { IFile, IURLFile, UploadParams } from './storage.types';

const Config = ConfigVars();


export const multer = Multer({
  storage: Multer.memoryStorage()
});

const serviceAccount: ServiceAccount = {
  projectId: Config.ServiceAccount_project_id,
  privateKey: Config.ServiceAccount_private_key?.replace(/\\n/g, '\n'),
  clientEmail: Config.ServiceAccount_client_email,
}

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${Config.ServiceAccount_project_id}.appspot.com`
});

export const bucket = getStorage().bucket();


// Upload Function
export const uploadFileToStorage = ({ file, fileType = 'file', folder }: UploadParams): Promise<IFile> => {
  return new Promise(async (resolve, reject) => {
    let Outputed_File: IFile | IURLFile;

    // Auto-Detect File Type
    if (!fileType) {
      let type = file.mimetype.split("/")[0];

      switch (type) {
        case "image":
          fileType = "image"
          break;
        case "video":
          fileType = "video"
          break;
        case "audio":
          fileType = "audio"
          break;
        case "application":
          if (documentWhitelistTypes.indexOf(file.mimetype.split("/")[1]) !== -1) fileType = "document";
          else fileType = "file"
          break;
        default:
          fileType = "file"
      }
    }

    // Filter & Compress Based on File Type
    switch (fileType) {
      case "image":
        try {
          Outputed_File = await FilterAndCompressImages(file);
        } catch (e) {
          return reject(e)
        }
        break;
      case "video":
        try {
          Outputed_File = await FilterVideos(file);
        } catch (e) {
          return reject(e)
        }
        break;
      case "audio":
        try {
          Outputed_File = await FilterAudios(file);
        } catch (e) {
          return reject(e)
        }
        break;
      case "document":
        try {
          Outputed_File = await FilterDocs(file);
        } catch (e) {
          return reject(e)
        }
        break;
      case "file":
        try {
          Outputed_File = await FilterFiles(file);
        } catch (e) {
          return reject(e)
        }
        break;

      default:
        return reject("File is not supported");
    }

    let newFileName = `${fileType}_${Date.now()}`;

    const uploadedFile = bucket.file(folder ? `${fileType}s/${folder}/${newFileName}` : `${fileType}s/${newFileName}`);

    let buffer = Outputed_File.buffer;

    await uploadedFile.save(buffer, {
      contentType: Outputed_File.mimetype,
      gzip: true
    });

    const [File_URL] = await uploadedFile.getSignedUrl({
      action: "read",
      expires: "01-01-2100"
    });

    resolve({
      name: newFileName,
      url: File_URL,
      path: `${fileType}s/${folder}/${newFileName}`,
      size: Outputed_File.size
    });
  });
};

export async function deleteFileByURL(fileUrl: string) {
  try {
    const fullPath: string[] = fileUrl.split("?")[0].split("/");

    if (!fullPath) throw new Error('Error occurred while extracting file path');

    const filePath = `${fullPath.at(-3)}/${decodeURI(fullPath.at(-2) as string)}/${fullPath.at(-1)}`;

    await bucket.file(filePath).delete();

    return { success: true }
  } catch (e: any) {
    return { err: e.message }
  }
}

export async function deleteFileByPath(filePath: string) {
  try {
    await bucket.file(filePath).delete();

    return { success: true }
  } catch (e: any) {
    return { err: e.message }
  }
}