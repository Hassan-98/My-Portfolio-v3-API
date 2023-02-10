//= Models
import STACK, { IStackModel } from './stack.model';
//= Utils
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
import checkObjectId from '../../utils/checkObjectId';
import { uploadFileToStorage } from '../../storage/storage.util';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Types
import { IStack, IStackDocument } from './stack.types';
import type { QueryParams } from '../../utils/queryBuilder';

class StackService {
  public MODEL: IStackModel = STACK;

  public async getStacks(queryOptions: QueryParams): Promise<IStack[]> {
    const { limit, skip } = queryOptions || {};
    const { filter, projection, population, sortition } = queryBuilder(queryOptions || {});

    let stacks: IStack[] = await this.MODEL.find(filter, projection, { ...population, ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();

    if (!stacks.length) throw HttpError(400, errorMessages.NOT_EXIST("Stacks"));

    return stacks;
  }

  public async getStackByIdOrName(idOrName: string, queryOptions: QueryParams): Promise<IStack> {
    const { projection, population } = queryBuilder(queryOptions || {});

    let stack: IStack;

    if (checkObjectId(idOrName)) stack = await this.MODEL.findById(idOrName, projection, { ...population }).lean();
    else stack = await this.MODEL.findOne({ name: { $regex: idOrName, $options: 'i' } }).lean();

    if (!stack) throw HttpError(400, errorMessages.NOT_EXIST("Stack", idOrName));

    return stack;
  }

  public async addNewStack({ data, image }: { data: IStack, image?: Express.Multer.File }): Promise<IStackDocument> {
    let Image;

    if (!data.image) {
      if (!image) throw HttpError(400, errorMessages.REQUIRED('image'));
      Image = await uploadFileToStorage({ file: image, fileType: 'image', folder: data.name });
      data.image = Image.url;
    }

    const stack = await this.MODEL.create(data);
    return stack;
  }

  public async updateStack(id: string, updates: Partial<IStack>, image?: Express.Multer.File): Promise<IStackDocument> {
    let stack: IStackDocument | null = await this.MODEL.findById(id);

    if (!stack) throw HttpError(400, errorMessages.NOT_EXIST("stack", id));

    if (image) {
      let uploadedImage = await uploadFileToStorage({ file: image, fileType: 'image', folder: stack.name });
      stack.image = uploadedImage.url;
    }

    Object.keys(updates).forEach((key) => {
      if (stack) stack.set(key, updates[key as keyof IStack]);
    });

    await stack.save();

    return stack;
  }

  public async deleteAStack(id: string): Promise<boolean> {
    let isDeleted = await this.MODEL.findByIdAndDelete(id);
    if (!isDeleted) throw HttpError(400, errorMessages.NOT_EXIST("Stack", id));
    return true;
  }
}

export default StackService;
