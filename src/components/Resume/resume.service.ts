//= Models
import GENERAL, { IResumeModel } from './resume.model';
//= Utils
import errorMessages from '../../utils/error-messages';
import { uploadFileToStorage } from '../../storage/storage.util';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Types
import { IResume, IResumeDocument, Template } from './resume.types';

class ResumeService {
  public MODEL: IResumeModel = GENERAL;

  public async getResumePreferences(): Promise<IResume> {
    let resumePreferences: IResume = await this.MODEL.findOne({}).lean();
    return resumePreferences;
  }

  public async addTemplate({ data, image }: { data: Template, image: Express.Multer.File | undefined }): Promise<IResumeDocument> {
    if (!image) throw HttpError(400, errorMessages.REQUIRED("template image"));

    let uploadedImage = await uploadFileToStorage({ file: image, fileType: 'image', folder: `resume-template[${data.name}]` });

    const tempate = {
      name: data.name,
      image: uploadedImage.url
    }

    let resumePreferences: IResumeDocument | null = await this.MODEL.findOneAndUpdate({}, {
      $push: {
        templates: tempate
      }
    }, { new: true, runValidators: true }).lean();

    if (!resumePreferences) throw HttpError(400, errorMessages.NOT_EXIST("resume preferences"));

    return resumePreferences;
  }

  public async updateTemplate({ id, updates, image }: { id: string, updates: Template & { _id: string }, image?: Express.Multer.File }): Promise<IResumeDocument> {
    let uploadedImage;
    if (image) {
      uploadedImage = await uploadFileToStorage({ file: image, fileType: 'image', folder: `resume-template[${updates.name}]` });
    }

    let resumePreferences: IResumeDocument | null = await this.MODEL.findOneAndUpdate({ 'templates._id': id }, {
      ...(updates.name ? { 'templates.$.name': updates.name } : {}),
      ...(uploadedImage ? { 'templates.$.image': uploadedImage.url } : {})
    }, { new: true, runValidators: true }).lean();

    if (!resumePreferences) throw HttpError(400, errorMessages.NOT_EXIST("resume preferences"));

    return resumePreferences;
  }

  public async deleteTemplate(id: string): Promise<IResumeDocument> {
    let resumePreferences: IResumeDocument | null = await this.MODEL.findOneAndUpdate({}, {
      $pull: {
        templates: {
          _id: id
        }
      }
    }, { new: true, runValidators: true }).lean();

    if (!resumePreferences) throw HttpError(400, errorMessages.NOT_EXIST("resume preferences"));

    return resumePreferences;
  }

  public async updatePreferences(updates: Partial<IResume>): Promise<IResumeDocument> {
    let resumePreferences: IResumeDocument | null = await this.MODEL.findOne({});

    if (!resumePreferences) throw HttpError(400, errorMessages.NOT_EXIST("resume preferences"));

    Object.keys(updates).forEach((key) => {
      if (resumePreferences) resumePreferences.set(key, updates[key as keyof IResume]);
    });

    await resumePreferences.save();

    return resumePreferences;
  }
}

export default ResumeService;
