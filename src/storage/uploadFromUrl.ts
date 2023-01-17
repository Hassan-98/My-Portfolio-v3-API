//= Modules
import axios, { AxiosResponse } from 'axios';
//= Utils
import { uploadFileToStorage } from './storage.util';
//= Types
import { File, URLFile } from './storage.types';


export default async (url: string, folder: string, fileType: string = "image"): Promise<File> => {
  const imageResponse: AxiosResponse = await axios.get(url, { responseType: 'arraybuffer' });

  if (!imageResponse) throw new Error(`Can't get image from ${url}`);


  let file: URLFile = {
    buffer: Buffer.from(imageResponse.data, "binary"),
    fieldname: "image",
    originalname: `external-image.${imageResponse?.headers['content-type']?.split("/")[1]}`,
    encoding: "binary",
    mimetype: imageResponse?.headers['content-type'] || '',
    size: parseInt(imageResponse?.headers['content-length'] || '0') || 0
  }

  const uploadedPicture: File = await uploadFileToStorage({ file, fileType, folder });

  return uploadedPicture;
}
