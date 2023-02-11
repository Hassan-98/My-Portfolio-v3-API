//= Models
import EXPERINCE, { IExperienceModel } from './experience.model';
//= Utils
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
import checkObjectId from '../../utils/checkObjectId';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Types
import { IExperience, IExperienceDocument } from './experience.types';
import type { QueryParams } from '../../utils/queryBuilder';

class ExperienceService {
  public MODEL: IExperienceModel = EXPERINCE;

  public async getExperiences(queryOptions: QueryParams): Promise<IExperience[]> {
    const { limit, skip } = queryOptions || {};
    const { filter, projection, sortition } = queryBuilder(queryOptions || {});

    let experiences: IExperience[] = await this.MODEL.find(filter, projection, { ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();

    if (!experiences.length) throw HttpError(400, errorMessages.NOT_EXIST("experiences"));

    return experiences;
  }

  public async getExperienceByIdOrName(idOrName: string, queryOptions: QueryParams): Promise<IExperience> {
    const { projection } = queryBuilder(queryOptions || {});

    let experience: IExperience;

    if (checkObjectId(idOrName)) experience = await this.MODEL.findById(idOrName, projection).lean();
    else experience = await this.MODEL.findOne({ name: { $regex: idOrName, $options: 'i' } }).lean();

    if (!experience) throw HttpError(400, errorMessages.NOT_EXIST("experience", idOrName));

    return experience;
  }

  public async addNewExperience(data: IExperience): Promise<IExperienceDocument> {
    if (data.endedAt && new Date(data.endedAt).getTime() < new Date(data.startedAt).getTime()) throw HttpError(400, "Job end date cannot be before job start date");

    const experience = await this.MODEL.create(data);
    return experience;
  }

  public async updateExperience(id: string, updates: Partial<IExperience>): Promise<IExperienceDocument> {
    let experience: IExperienceDocument | null = await this.MODEL.findById(id);

    if (!experience) throw HttpError(400, errorMessages.NOT_EXIST("experience", id));

    Object.keys(updates).forEach((key) => {
      if (experience) {
        if (updates.endedAt && updates.startedAt && new Date(updates.endedAt).getTime() < new Date(updates.startedAt).getTime()) throw HttpError(400, "Job end date cannot be before job start date");
        else if (updates.endedAt && !updates.startedAt && new Date(updates.endedAt).getTime() < new Date(experience.startedAt).getTime()) throw HttpError(400, "Job end date cannot be before job start date");

        experience.set(key, updates[key as keyof IExperience]);
      }
    });

    await experience.save();

    return experience;
  }

  public async deleteAExperience(id: string): Promise<boolean> {
    let isDeleted = await this.MODEL.findByIdAndDelete(id);
    if (!isDeleted) throw HttpError(400, errorMessages.NOT_EXIST("experience", id));
    return true;
  }
}

export default ExperienceService;
