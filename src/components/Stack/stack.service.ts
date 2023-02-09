//= Models
import STACK, { IStackModel } from './stack.model';
//= Utils
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Config
import ConfigVars from '../../configs/app.config';
//= Types
import { IStack } from './stack.types';
import type { QueryParams } from '../../utils/queryBuilder';

const Config = ConfigVars();

class StackService {
  public MODEL: IStackModel = STACK;

  public async getStacks(params: QueryParams): Promise<IStack[]> {
    const { limit, skip } = params || {};
    const { filter, projection, population, sortition } = queryBuilder(params || {});

    let stacks: IStack[] = await this.MODEL.find(filter, projection, { ...population, ...sortition, ...(limit ? { limit } : {}), ...(skip ? { skip } : {}) }).lean();

    if (!stacks.length) throw HttpError(400, errorMessages.NOT_EXIST("Stacks"));

    return stacks;
  }
}

export default StackService;
