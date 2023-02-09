//= Models
import GENERAL, { IGeneralModel } from './general.model';
//= Utils
import queryBuilder from '../../utils/queryBuilder';
import errorMessages from '../../utils/error-messages';
//= Middlwares
import { HttpError } from '../../middlewares/error.handler.middleware';
//= Config
import ConfigVars from '../../configs/app.config';
//= Types
import { IGeneral } from './general.types';
import type { QueryParams } from '../../utils/queryBuilder';

const Config = ConfigVars();

class GeneralService {
  public MODEL: IGeneralModel = GENERAL;

  public async getGeneralSettings(): Promise<IGeneral> {
    let generalSettings: IGeneral = await this.MODEL.findOne({}, {}, { populate: 'recentStack.stack' }).lean();
    return generalSettings;
  }
}

export default GeneralService;
