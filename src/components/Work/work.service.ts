import mongoose from 'mongoose';
//= Models
import WORK, { IWorkModel } from './work.model';
//= Utils
import { uploadFileToStorage } from '../../storage/storage.util';
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Types
import { IWork, IWorkDocument } from './work.types';
import type { QueryParams } from '../../utils/queryBuilder';


class WorkService {
  public MODEL: IWorkModel = WORK;

  public async getAllWorks(params?: QueryParams): Promise<IWork[]> {
    const { limit, skip } = params || {};
    const { filter, projection, population, sortition } = queryBuilder(params || {});

    let works: IWork[] = await this.MODEL.find(filter, projection, { ...population, ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();

    return works;
  }

  public async getWorkById(id: string, queryOptions?: QueryParams): Promise<IWork> {
    const { projection, population } = queryBuilder(queryOptions || {});

    let work = await this.MODEL.findById(id, projection, { ...population }).lean();

    if (!work) throw HttpError(400, errorMessages.NOT_EXIST("Work", id));

    return work;
  }

  public async addNewWork({ data, images }: { data: IWork, images?: { desktop: Express.Multer.File, mobile: Express.Multer.File } }): Promise<IWorkDocument> {
    let desktopImage, mobileImage;

    if (!data.images) {
      if (!images) throw HttpError(400, errorMessages.REQUIRED('images'));

      try {
        [desktopImage, mobileImage] = await Promise.all([
          uploadFileToStorage({ file: images.desktop, fileType: 'image', folder: data.name }),
          uploadFileToStorage({ file: images.mobile, fileType: 'image', folder: data.name })
        ]);

        data.images = {
          desktop: desktopImage.url,
          mobile: mobileImage.url,
        };
      } catch (error: any) {
        console.log(error);
        throw HttpError(400, error.message);
      }
    }

    try {
      await this.MODEL.updateMany({}, {
        $inc: {
          order: 1
        }
      });
      const work = await this.MODEL.create(data);
      return work;
    } catch (error: any) {
      console.log(error);
      throw HttpError(400, error.message);
    }
  }

  public async updateWork(id: string, updates: Partial<IWork>, images?: { desktop?: Express.Multer.File, mobile?: Express.Multer.File }): Promise<IWorkDocument> {
    let work: IWorkDocument | null = await this.MODEL.findById(id);

    if (!work) throw HttpError(400, errorMessages.NOT_EXIST("Work", id));

    if (images) {
      let uploads = [];
      if (images.desktop) uploads.push(uploadFileToStorage({ file: images.desktop, fileType: 'image', folder: work.name }));
      if (images.mobile) uploads.push(uploadFileToStorage({ file: images.mobile, fileType: 'image', folder: work.name }));

      let [desktopImage, mobileImage] = await Promise.all(uploads);

      work.images = {
        ...(desktopImage ? { desktop: desktopImage.url } : { desktop: work.images.desktop }),
        ...(mobileImage ? { mobile: mobileImage.url } : { mobile: work.images.mobile })
      };
    }

    Object.keys(updates).forEach((key) => {
      if (work) work.set(key, updates[key as keyof IWork]);
    });

    await work.save();

    return work;
  }

  public async updateWorksOrder(newOrder: { id: string, order: number }[]): Promise<boolean> {
    const writes = newOrder.map(Order => ({
      updateOne: {
        filter: { _id: Order.id },
        update: { $set: { order: Order.order } }
      }
    }));

    await this.MODEL.bulkWrite(writes);

    return true;
  }

  public async deleteWork(id: string): Promise<boolean> {
    let isDeleted = await this.MODEL.findByIdAndDelete(id);
    if (!isDeleted) throw HttpError(400, errorMessages.NOT_EXIST("Work", id));
    return true;
  }
}

export default WorkService;
