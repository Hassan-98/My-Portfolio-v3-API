//= Models
import GENERAL, { IGeneralModel } from './general.model';
//= Utils
import errorMessages from '../../utils/error-messages';
import { uploadFileToStorage } from '../../storage/storage.util';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Types
import { IGeneral, IGeneralDocument } from './general.types';

class GeneralService {
  public MODEL: IGeneralModel = GENERAL;

  public async getGeneralSettings(): Promise<IGeneral> {
    let generalSettings: IGeneral = await this.MODEL.findOne({}, {}, { populate: 'recentStack.stack' }).lean();
    return generalSettings;
  }

  public async updateSettings(updates: Partial<IGeneral>, picture?: Express.Multer.File): Promise<IGeneralDocument> {
    let settings: IGeneralDocument | null = await this.MODEL.findOne({});

    if (!settings) throw HttpError(400, errorMessages.NOT_EXIST("general settings"));

    Object.keys(updates).forEach((key) => {
      if (settings) settings.set(key, updates[key as keyof IGeneral]);
    });

    if (picture) {
      let uploadedImage = await uploadFileToStorage({ file: picture, fileType: 'image', folder: 'general settings' });
      settings.header.pictureUrl = uploadedImage.url;
    }

    await settings.save();

    return settings;
  }
}

export default GeneralService;
