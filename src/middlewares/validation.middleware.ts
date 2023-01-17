//= Types
import { RequestHandler } from '../types/request.type';

export function bodyValidator(Schema: any): RequestHandler {
  return (req, res, next) => {
    let validtion_check = Schema.safeParse(req.body);
    if (!validtion_check.success) {
      let InvalidFields = validtion_check.error.issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`).join(' | ');

      res.status(422).json({
        success: false,
        data: null,
        errors: validtion_check.error.issues,
        message: `Invalid request body, invalid fields (${InvalidFields})`
      });
    }
    else next();
  };
}


export function paramsValidator(Schema: any): RequestHandler {
  return (req, res, next) => {
    let validtion_check = Schema.safeParse(req.params);
    if (!validtion_check.success) {
      let InvalidFields = validtion_check.error.issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`).join(' | ');

      res.status(422).json({
        success: false,
        data: null,
        errors: validtion_check.error.issues,
        message: `Invalid request params, invalid fields (${InvalidFields})`
      });
    }
    else next();
  };
}
