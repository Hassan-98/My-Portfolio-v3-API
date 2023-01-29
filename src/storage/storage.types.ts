export interface IURLFile {
  buffer: Buffer;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
}

export interface IFile {
  name: string;
  url: string;
  path: string;
  size: number;
}

export interface UploadParams {
  file: Express.Multer.File | IURLFile;
  fileType: string;
  folder: string
}