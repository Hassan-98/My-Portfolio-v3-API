import mongoose from 'mongoose';
//= Models
import SKILL, { ISkillModel } from './skills.model';
//= Utils
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Types
import { ISkill, ISkillDocument } from './skills.types';
import type { QueryParams } from '../../utils/queryBuilder';

class SkillService {
  public MODEL: ISkillModel = SKILL;

  public async getSkills(queryOptions: QueryParams): Promise<ISkill[]> {
    const { limit, skip } = queryOptions || {};
    const { filter, population, projection, sortition } = queryBuilder(queryOptions || {});

    let skills: ISkill[] = await this.MODEL.find(filter, projection, { ...population, ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();

    if (!skills.length) throw HttpError(400, errorMessages.NOT_EXIST("skills"));

    return skills;
  }

  public async getSkillById(id: string, queryOptions: QueryParams): Promise<ISkill> {
    const { projection, population } = queryBuilder(queryOptions || {});

    let skill: ISkill = await this.MODEL.findById(id, projection, { ...population }).lean();

    if (!skill) throw HttpError(400, errorMessages.NOT_EXIST("skill", id));

    return skill;
  }

  public async addNewSkill(data: ISkill): Promise<ISkillDocument> {
    const skill = await this.MODEL.findOneAndUpdate({ _id: new mongoose.Types.ObjectId() }, data, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      populate: { path: 'skill' }
    });

    return skill;
  }

  public async updateSkill(id: string, updates: Partial<ISkill>): Promise<ISkillDocument> {
    let skill: ISkillDocument | null = await this.MODEL.findById(id);

    if (!skill) throw HttpError(400, errorMessages.NOT_EXIST("skill", id));

    Object.keys(updates).forEach((key) => {
      if (skill) {
        skill.set(key, updates[key as keyof ISkill]);
      }
    });

    await skill.save();

    return skill;
  }

  public async updateSkillsOrder(newOrder: { id: string, order: number }[]): Promise<boolean> {
    const writes = newOrder.map(Order => ({
      updateOne: {
        filter: { _id: Order.id },
        update: { $set: { order: Order.order } }
      }
    }));

    await this.MODEL.bulkWrite(writes);

    return true;
  }

  public async deleteASkill(id: string): Promise<boolean> {
    let isDeleted = await this.MODEL.findByIdAndDelete(id);
    if (!isDeleted) throw HttpError(400, errorMessages.NOT_EXIST("skill", id));
    return true;
  }
}

export default SkillService;
